const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')

router.use('/', home)
router.use('/users', users)
router.use('/records', records)

module.exports = router