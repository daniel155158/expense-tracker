const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const app = express()
const port = 3000
const routes = require('./routes')
require('./config/mongoose')

// template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs')

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'MySecret',
  resave: false,
  saveUninitialized: true,
}))
app.use(routes)

app.listen(port, () => {
  console.log(`app is running in http://localhost:${port}`)
})
