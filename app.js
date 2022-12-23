const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Record = require('./models/record')
const Category = require('./models/category')
const port = 3000

// template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs')
// 非正式環境下使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// mongoose setting
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

// middleware
app.use(bodyParser.urlencoded({ extended: true }))

// 進入首頁
app.get('/', async (req, res) => {
  let totalAmount = 0
  const items = await Record.find().lean().sort({ _id: 'asc' })
  const records = await Promise.all(items.map(async (item) => {
    const category = await Category.findOne({ _id: item.categoryId })
    item.categoryIcon = category.icon
    item.date = item.date.toISOString().slice(0, 10)
    totalAmount += item.cost
    return item
  }))
  records.totalAmount = totalAmount
  res.render('index', { records })
})
// 進入新增頁面
app.get('/new', (req, res) => {
  res.render('new')
})
// 提交新增支出表單
app.post('/new', async (req, res) => {
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
// 進入編輯頁面
app.get('/edit/:_id', (req, res) => {
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
// 提交編輯支出表單
app.post('/edit', (req, res) => {
  const body = req.body
  res.render('edit', { body })
})
// 點擊delete
app.get('/delete', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`app is running in http://localhost:${port}`)
})
