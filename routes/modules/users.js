const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')
const Record = require('../../models/record')

// 進入登入頁
router.get('/login', (req, res) => {
  res.render('login')
})
// 提交登入資訊
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))
// 進入註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})
// 提交註冊表單
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // 先處理錯誤狀況
  if (!name || !email || !password || !confirmPassword) {
    console.log('請填寫必填資料!')
    res.redirect('/users/register')
  }
  if (password !== confirmPassword) {
    console.log('密碼與確認密碼不符!')
    res.redirect('/users/register')
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('此信箱已經註冊過了!')
        return res.render('register', { name, email })
      } else {
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('login'))
          .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
})

module.exports = router