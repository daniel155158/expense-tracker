const bcrypt = require('bcryptjs')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')
const recordList = require('./record.json').results
const db = require('../../config/mongoose')

const USER = [
  {
    name: 'USER1',
    email: 'user1@example.com',
    password: '12345678',
    recordIndexes: [1, 3, 4, 6, 7, 9, 10, 12],
  }, {
    name: 'USER2',
    email: 'user2@example.com',
    password: '12345678',
    recordIndexes: [0, 2, 5, 8, 11, 13],
  }
]

db.once('open', async () => {
  await Promise.all(USER.map(async (user) => {
    const { name, email, password } = user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const seederUser = await User.create({
      name,
      email,
      password: hash,
    })
    const userId = seederUser._id
    await Promise.all(user.recordIndexes.map(async (index) => {
      const record = recordList[index]
      const categoryItem = await Category.findOne({ name: record.category })
      const categoryId = categoryItem._id
      await Record.create({
        name: record.name,
        date: record.date,
        cost: record.cost,
        categoryId,
        userId
      })
    }))
  }))
  console.log('recordSeeder created!')
  process.exit()
})