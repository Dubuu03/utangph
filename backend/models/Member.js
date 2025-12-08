import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

const Member = mongoose.model('Member', memberSchema)

export default Member
