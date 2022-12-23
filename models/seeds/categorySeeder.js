const mongoose = require('mongoose')
const Category = require('../category')

const CATEGORY = [
  {
    name: '家居物業',
    icon: 'https://fontawesome.com/icons/home?style=solid'
  },
  {
    name: '交通出行',
    icon: 'https://fontawesome.com/icons/shuttle-van?style=solid'
  },
  {
    name: '休閒娛樂',
    icon: 'https://fontawesome.com/icons/grin-beam?style=solid'
  },
  {
    name: '餐飲食品',
    icon: 'https://fontawesome.com/icons/utensils?style=solid'
  },
  {
    name: '其他',
    icon: 'https://fontawesome.com/icons/pen?style=solid'
  }
]

// 非正式環境下使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// mongoose setting
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
  Category.insertMany(CATEGORY)
    .then(() => console.log('categorySeeder created!'))
    .catch(error => console.log(error))
})




