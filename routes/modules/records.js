const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 進入新增支出頁面
router.get('/new', (req, res) => {
  res.render('new')
})
// 提交新增支出表單
router.post('/', async (req, res) => {
  try {
    const body = req.body
    const categoryItem = await Category.findOne({ name: body.category })
    await Record.create({
      name: body.name,
      date: body.date,
      cost: body.cost,
      categoryId: categoryItem._id
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})
// 進入修改支出頁面
router.get('/:_id/edit', (req, res) => {
  const id = req.params._id
  Record.findOne({ _id: id })
    .lean()
    .then((record) => {
      return Category.findOne({ _id: record.categoryId })
        .then((category) => {
          record.categoryName = category.name
          return record
        })
    })
    .then((record) => {
      record.date = record.date.toISOString().slice(0, 10)
      res.render('edit', { record })
    })
})
// 提交修改支出表單
router.put('/:_id', (req, res) => {
  const id = req.params._id
  const body = req.body
  return Category.findOne({ name: body.category })
    .then(categoryItem => {
      return Record.findOne({ _id: id })
        .then(record => {
          record.name = body.name
          record.date = body.date
          record.cost = body.cost
          record.categoryId = categoryItem._id
          return record.save()
        })
    })
    .then(() => res.redirect(`/records/${id}/edit`))
    .catch(error => console.log(error))
})
// 點擊刪除支出
router.delete('/:_id', (req, res) => {
  const id = req.params._id
  return Record.findOne({ _id: id })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router