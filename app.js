const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000

// template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

// 進入首頁
app.get('/', (req, res) => {
  res.render('index')
})
// 進入新增頁面
app.get('/new', (req, res) => {
  res.render('new')
})
// 提交新增支出表單
app.post('/new', (req, res) => {
  const body = req.body
  res.render('new', { body })
})
// 進入編輯頁面
app.get('/edit', (req, res) => {
  res.render('edit')
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
