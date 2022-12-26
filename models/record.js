const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  categoryId: { //與category關聯
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
    required: true
  },
  userId: { //與user關聯
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
})

module.exports = mongoose.model('Record', recordSchema)