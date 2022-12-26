const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // middleware初始化設定
  app.use(passport.initialize());
  app.use(passport.session());
  // 設定local登入
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false)
        }
        if (user.password !== password) {
          return done(null, false)
        }
        return done(null, user);
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
      .then(() => done(null, user))
      .catch(err => done(err, null))
  })
}