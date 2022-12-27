const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

// 進入新增支出頁面
router.get('/new', (req, res) => {
  res.render('new')
})
// 提交新增支出表單
router.post('/', async (req, res) => {
  try {
    // 透過email找特定user資料，來取得record資料庫關聯用的user的_id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    // 透過category的name，來取得record資料庫關聯用的category的_id
    const body = req.body
    const categoryItem = await Category.findOne({ name: body.category })
    await Record.create({
      name: body.name,
      date: body.date,
      cost: body.cost,
      categoryId: categoryItem._id,
      userId
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})
// 進入修改支出頁面
router.get('/:_id/edit', async (req, res) => {
  try {
    const _id = req.params._id
    // 透過email找特定user資料，來取得record資料庫關聯用的user的_id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    // 透過record和user兩者的_id取得特定record資料
    const record = await Record.findOne({ _id, userId }).lean()
    // 透過該record的categoryId來取得特定category資料
    const category = await Category.findOne({ _id: record.categoryId })
    record.categoryName = category.name
    record.date = record.date.toISOString().slice(0, 10)
    res.render('edit', { record })
  }
  catch (error) {
    console.log(error)
  }
})
// 提交修改支出表單
router.put('/:_id', async (req, res) => {
  try {
    const _id = req.params._id
    // 透過email找特定user資料，來取得record資料庫關聯用的user的_id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    // 透過category的name來取得特定category資料
    const body = req.body
    const categoryItem = await Category.findOne({ name: body.category })
    const record = await Record.findOne({ _id, userId })
    // 將資料修改成使用者提交的內容
    record.name = body.name
    record.date = body.date
    record.cost = body.cost
    record.categoryId = categoryItem._id
    record.save()
    res.redirect(`/records/${_id}/edit`)
  }
  catch (error) {
    console.log(error)
  }
})
// 點擊刪除支出
router.delete('/:_id', async (req, res) => {
  try {
    const _id = req.params._id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    const record = await Record.findOne({ _id, userId })
    record.remove()
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router