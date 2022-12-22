const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000

// template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/new', (req, res) => {
  res.render('new')
})

app.listen(port, () => {
  console.log(`app is running in http://localhost:${port}`)
})
