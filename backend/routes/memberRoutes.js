import express from 'express'
import Member from '../models/Member.js'
import Expense from '../models/Expense.js'

const router = express.Router()

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 })
    res.json(members)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }
    res.json(member)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get member balance and transactions
router.get('/:id/balance', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    // Get all expenses involving this member
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.params.id },
        { splitWith: req.params.id }
      ]
    })
      .populate('paidBy', 'name')
      .populate('splitWith', 'name')
      .sort({ date: -1 })

    let totalPaid = 0
    let totalOwed = 0

    expenses.forEach(expense => {
      const sharePerPerson = expense.amount / expense.splitWith.length

      // If this member paid
      if (expense.paidBy._id.toString() === req.params.id) {
        totalPaid += expense.amount
      }

      // If this member is in the split
      if (expense.splitWith.some(m => m._id.toString() === req.params.id)) {
        totalOwed += sharePerPerson
      }
    })

    const balance = totalPaid - totalOwed

    res.json({
      member,
      totalPaid,
      totalOwed,
      balance,
      expenses
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new member
router.post('/', async (req, res) => {
  const member = new Member({
    name: req.body.name
  })

  try {
    const newMember = await member.save()
    res.status(201).json(newMember)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    if (req.body.name) member.name = req.body.name

    const updatedMember = await member.save()
    res.json(updatedMember)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    await member.deleteOne()
    res.json({ message: 'Member deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
