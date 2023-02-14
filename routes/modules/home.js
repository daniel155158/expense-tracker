const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

// 進入首頁
router.get('/', async (req, res) => {
  try {
    let totalAmount = 0
    // 找特定使用者的records
    const userId = req.user._id
    const items = await Record.find({ userId }).lean().sort({ date: 'desc' })
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
    // 找特定使用者的records
    const userId = req.user._id
    const allRecords = await Record.find({ userId }).lean().sort({ date: 'desc' })
    // 透過category的name，來取得record資料庫關聯用的category的_id
    const search = req.body.search
    if (search === '全部') {
      // 如果是篩選全部
      const records = await Promise.all(allRecords.map(async (record) => {
        const category = await Category.findOne({ _id: record.categoryId })
        record.categoryIcon = category.icon
        record.date = record.date.toISOString().slice(0, 10)
        totalAmount += record.cost
        return record
      }))
      records.totalAmount = totalAmount
      res.render('index', { records })
    } else {
      // 如果是篩選個別選項
      const categoryItem = await Category.findOne({ name: search })
      const categoryId = categoryItem._id
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
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router
