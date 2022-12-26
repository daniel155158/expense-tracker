const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = app => {
  // middleware初始化設定
  app.use(passport.initialize());
  app.use(passport.session());
  // 設定local登入
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true, }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '此信箱尚未註冊!' })
        }
        return (bcrypt.compare(password, user.password))
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: '請輸入正確的信箱與密碼' })
            }
            return done(null, user);
          })
      })
      .catch(error => console.log(error))
  }))
  // 設定serialize & deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch(err => done(err, null))
  })
}