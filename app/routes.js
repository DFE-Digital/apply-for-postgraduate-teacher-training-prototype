const express = require('express')
const router = express.Router()

// Application: Personal details
router.post('/profile/personal-details/answer', (req, res) => {
  let nationality = req.session.data['nationality']

  let eea = ['Austrian', 'Belgian', 'Bulgarian', 'Croatian', 'Cypriot', 'Czech', 'Danish', 'Dutch', 'Estonian', 'Finnish', 'French', 'German', 'Greek', 'Hungarian', 'Icelandic', 'Irish', 'Italian', 'Latvian', 'Liechtenstein citizen', 'Lithuanian', 'Luxembourger', 'Maltese', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Swiss', 'British']

  if (eea.includes(nationality)) {
    res.redirect('/profile')
  } else {
    res.redirect('/profile/personal-details/residency-status')
  }
})

// Application: Contact details
router.post('/profile/contact-details/address-answer', (req, res) => {
  let location = req.session.data['address-location']

  if (location === 'domestic') {
    res.redirect('/profile/contact-details/lookup-address')
  } else {
    res.redirect('/profile/contact-details/enter-address')
  }
})

// Application: Work history
router.get('/profile/work-history/add-job', (req, res) => {
  res.render('profile/work-history/job', {
    action: 'add',
    title: 'Add job',
    buttonText: 'Save and continue'
  })
})

router.get('/profile/work-history/edit-job', (req, res) => {
  res.render('profile/work-history/job', {
    action: 'edit',
    title: 'Edit job',
    buttonText: 'Save changes'
  })
})

// Application: School experience
router.get('/profile/school-experience/add-role', (req, res) => {
  res.render('profile/school-experience/role', {
    action: 'add',
    title: 'Add role',
    buttonText: 'Save and continue'
  })
})

router.get('/profile/school-experience/edit-role', (req, res) => {
  res.render('profile/school-experience/role', {
    action: 'edit',
    title: 'Edit role',
    buttonText: 'Save changes'
  })
})

// Application: References
router.get('/profile/references/add-principle-referee', (req, res) => {
  res.render('profile/references/referee', {
    action: 'add',
    formAction: '/profile/references/add-secondary-referee',
    title: 'Add principle referee',
    type: 'principle',
    buttonText: 'Save and continue'
  })
})

router.get('/profile/references/edit-principle-referee', (req, res) => {
  res.render('profile/references/referee', {
    action: 'edit',
    formAction: '/profile/references/review',
    title: 'Edit principle referee',
    type: 'principle',
    buttonText: 'Save changes'
  })
})

router.get('/profile/references/add-secondary-referee', (req, res) => {
  res.render('profile/references/referee', {
    action: 'add',
    formAction: '/profile/references/review',
    title: 'Add secondary referee',
    type: 'secondary',
    buttonText: 'Save and continue'
  })
})

router.get('/profile/references/edit-secondary-referee', (req, res) => {
  res.render('profile/references/referee', {
    action: 'edit',
    formAction: '/profile/references/review',
    title: 'Edit secondary referee',
    type: 'secondary',
    buttonText: 'Save changes'
  })
})

module.exports = router
