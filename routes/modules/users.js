const express = require('express')
const router = express.Router()

// 進入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router