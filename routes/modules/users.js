const express = require('express')
const router = express.Router()

// 進入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 進入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router