module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticate) {
      return next()
    }
    res.redirect('/users/login')
  }
}