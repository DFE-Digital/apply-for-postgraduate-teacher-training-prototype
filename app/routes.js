const express = require('express')
const router = express.Router()

// Make `applicationId` available as local variable
router.all(['/application/:applicationId', '/application/:applicationId/*'], (req, res, next) => {
  res.locals.applicationId = req.params.applicationId
  next()
})

// Make `choiceId` available as local variable
router.all([
  '/application/:applicationId/choices/:choiceId',
  '/application/:applicationId/choices/:choiceId/*'
], (req, res, next) => {
  res.locals.choiceId = req.params.choiceId
  next()
})

// Make `validate` available as local variable for Find page
router.get('/find/feedback', (req, res) => {
  const { validate } = req.query

  res.render('find/feedback.njk', {
    validate
  })
})

require('./routes/account')(router)
require('./routes/delete')(router) // Must appear before other routes
require('./routes/apply')(router)
require('./routes/application')(router)
require('./routes/reference')(router)
require('./routes/emails')(router)
require('./routes/send-email')(router)
require('./routes/survey')(router)

// Routes used to set up application states
require('./routes/admin/state')(router)

// Clear all data in session if you open /admin/clear-data
router.post('/admin/clear-data', function (req, res) {
  req.session.data = {}
  res.render('admin/clear-data-success')
})

// Show feature flags
router.get('/admin/flags', (req, res) => {
  res.render('admin/flags', {
    flags: req.session.data.flags
  })
})

module.exports = router
