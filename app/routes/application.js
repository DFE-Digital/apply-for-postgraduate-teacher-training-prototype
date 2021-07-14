const utils = require('./../utils')

function createNewApplication (req) {
  const code = utils.generateRandomString()
  const data = req.session.data

  if (typeof data.applications === 'undefined') {
    data.applications = {}
  }

  if (typeof data.applications[code] === 'undefined') {
    data.applications[code] = {
      status: 'started',
      apply2: false,
      completed: {},
      choices: {},
      references: {},
      candidate: {},
      contactInformation: {},
      additionalSupportDisclose: null,
      additionalSupport: {},
      safeguardingDisclose: null,
      safeguarding: null,
      degree: {},
      otherQualifications: {},
      gcse: {
        maths: {},
        english: {},
        science: {}
      },
      subjectKnowledge: null,
      interviewNeedsDisclose: null,
      interviewNeeds: null,
      personalStatement: null,
      workHistory: {},
      unpaidExperience: {}
    }
  }

  return code
}

/**
 * Application routes
 */
module.exports = router => {
  router.all('/application', (req, res) => {
    if (utils.hasStartedApplications(req)) {
      res.redirect('/application/started')
    } else {
      res.redirect('/application/start')
    }
  })

  // Generate new applicationID and redirect to that application
  router.get('/application/start', (req, res) => {
    const code = createNewApplication(req)
    req.session.data.applications[code].welcomeFlow = true

    if (req.session.data.course_from_find) {
      // If coming from Find, go straight to course selection
      res.redirect(`/application/${code}/choices/add`)
    } else {
      // Otherwise, give some context about the Apply pilot
      res.redirect(`/application/${code}/before-you-start`)
    }
  })

  router.get('/application/start/choice', (req, res) => {
    const code = createNewApplication(req)
    res.redirect(`/application/${code}/choices/add`)
  })

  router.all('/application/started', (req, res) => {
    const { applications } = req.session.data
    const applicationId = Object.entries(applications).filter(a => a[1].status === 'started')[0][0]
    if (applicationId) {
      res.redirect('/application/' + applicationId)
    }
  })

  // Render application page
  router.all('/application/:applicationId', (req, res) => {
    const showCopiedBanner = req.query.copied

    req.session.data.applications[req.params.applicationId].welcomeFlow = false
    res.render('application/index', {
      showCopiedBanner,
      closed: req.query.closed,
      findNotOpen: req.query.findNotOpen,
      cycleNotOpen: req.query.cycleNotOpen
    })
  })

  // Render before you start page
  router.all('/application/:applicationId/before-you-start', (req, res) => {
    res.render('application/before-you-start', { showCopiedBanner: req.query.copied })
  })

  // Generate a new application from an existing one
  router.get('/application/:applicationId/apply2', (req, res) => {
    const code = 12346
    const { applications } = req.session.data
    const existingApplicationId = req.params.applicationId
    const existingApplication = applications[existingApplicationId]
    const apply2Application = JSON.parse(JSON.stringify(existingApplication))

    apply2Application.welcomeFlow = false

    if (existingApplication.cycleDeadlinePassed == true || req.query.from === 'unsubmitted') {
      apply2Application.apply2 = false
    } else {
      apply2Application.apply2 = true
    }
    apply2Application.choices = {}
    apply2Application.completed.choices = false
    apply2Application.previousApplications = [existingApplicationId]

    for (const choice of utils.toArray(existingApplication.choices)) {
      if (choice?.feedback?.qualityOfApplication?.personalStatement) {
        apply2Application.completed.personalStatement = false
      }

      if (choice?.feedback?.qualityOfApplication?.subjectKnowledge) {
        apply2Application.completed.subjectKnowledge = false
      }

      if (choice?.feedback?.qualifications?.noMathsGCSEOrEquivalent) {
        apply2Application.completed.maths = false
      }
    }

    if (apply2Application.references && apply2Application.references[0]) {
      apply2Application.references[0].status = 'Received'
    }

    if (apply2Application.references && apply2Application.references[1]) {
      apply2Application.references[1].status = 'Received'
    }

    applications[code] = apply2Application

    if (existingApplication.cycleDeadlinePassed == true || req.query.from === 'unsubmitted') {
      res.redirect(`/application/${code}?findNotOpen=true&cycleNotOpen=true`)
    } else {
      res.redirect(`/application/${code}?copied=true`)
    }
  })

  // Render course-specific submitted page
  router.all('/application/:applicationId/submitted/:choiceId', (req, res) => {
    const { referrer } = req.query
    const { choiceId } = req.params

    res.render('application/submitted', {
      referrer,
      choiceId
    })
  })

  // Render submitted page
  router.all('/application/:applicationId/submitted', (req, res) => {
    const { referrer } = req.query

    res.render('application/submitted', {
      referrer
    })
  })

  require('./application/choices')(router)
  require('./application/personal-information')(router)
  require('./application/contact-information')(router)
  require('./application/english-language')(router)
  require('./application/work-history')(router)
  require('./application/unpaid-experience')(router)
  require('./application/additional-support')(router)
  require('./application/safeguarding')(router)
  require('./application/degree')(router)
  require('./application/gcse')(router)
  require('./application/other-qualifications')(router)
  require('./application/personal-statement')(router)
  require('./application/subject-knowledge')(router)
  require('./application/interview-needs')(router)
  require('./application/references')(router)
  require('./application/review')(router)
  require('./application/equality-monitoring')(router)
  require('./application/confirmation')(router)
  require('./application/dashboard')(router)
  require('./application/decision')(router)

  // Render provided view, or index template for that view if not found
  router.all('/application/:applicationId/:view', (req, res) => {
    const { referrer } = req.query

    res.render(
      `application/${req.params.view}`,
      {},
      (error, html) => {
        if (error && error.message.includes('template not found')) {
          res.render(`application/${req.params.view}/index`, {
            referrer
          })
        } else {
          res.send(html)
        }
      }
    )
  })
}
