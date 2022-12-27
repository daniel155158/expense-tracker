const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

// 進入首頁
router.get('/', async (req, res) => {
  try {
    let totalAmount = 0
    // 透過email找特定user資料，來取得record資料庫關聯用的user的_id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    // 找特定使用者的records
    const items = await Record.find({ userId }).lean().sort({ _id: 'asc' })
    const records = await Promise.all(items.map(async (item) => {
      // 透過category的_id來取得特定category資料
      const category = await Category.findOne({ _id: item.categoryId })
      item.categoryIcon = category.icon
      item.date = item.date.toISOString().slice(0, 10)
      totalAmount += item.cost
      return item
    }))
    records.totalAmount = totalAmount
    res.render('index', { records })
  }
  catch (error) {
    console.log(error)
  }
})

// 搜尋不同類別的支出情形
router.post('/search', async (req, res) => {
  try {
    let totalAmount = 0
    // 透過email找特定user資料，來取得record資料庫關聯用的user的_id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    // 透過category的name，來取得record資料庫關聯用的category的_id
    const search = req.body.search
    const categoryItem = await Category.findOne({ name: search })
    const categoryId = categoryItem._id
    // 找特定使用者的records
    const allRecords = await Record.find({ userId }).lean().sort({ _id: 'asc' })
    // 篩選出特定category的records
    const filteredRecords = allRecords.filter(record => {
      return (JSON.stringify(record.categoryId)) === (JSON.stringify(categoryId))
    })
    const records = filteredRecords.map(record => {
      record.categoryIcon = categoryItem.icon
      record.date = record.date.toISOString().slice(0, 10)
      totalAmount += record.cost
      return record
    })
    records.totalAmount = totalAmount
    records.categoryName = categoryItem.name
    res.render('index', { records })
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router