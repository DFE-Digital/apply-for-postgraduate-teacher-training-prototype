const utils = require('../utils')

// UR: Hard-coded template values for use during research sesions
const urChoices = [{
  // Participant declines offer on first choice
  providerName: 'Gorse SCITT',
  courseName: 'Primary (2XT2)',
  courseDate: 'September 2020',
  conditionsList: '* Fitness to teach check\n* Disclosure and Barring Service check'
}, {
  // Participant is rejected on second choice
  providerName: 'Leeds Trinity University',
  courseName: 'Primary (3-7) (2VLT)',
  courseDate: 'September 2020',
  reasonsList: '* Candidate didn’t come to the interview or assessment'
}, {
  // Participant accepts offer on third choice
  providerName: 'Bradford College',
  courseName: 'Primary (X100)',
  courseDate: 'September 2020',
  conditionsList: '* Fitness to teach check\n* Disclosure and Barring Service check'
}]

/**
 * Email routes
 */
module.exports = router => {
  // Account: Welcome
  router.get('/account/account-created', (req, res) => {
    if (!req.session.data.welcomeEmailSent) {
      utils.sendEmail(req, '8aa601b6-9985-471e-bd28-5fe0697820e5')
    }

    req.session.data.welcomeEmailSent = true
    res.redirect('/application/start')
  })

  // Account: Sign up
  router.post('/send-email/create-account', (req, res) => {
    utils.sendEmail(req, 'd19c241f-73f9-45da-a9cc-6613f9b3d2da')
    res.redirect('/account/check-email/create-account')
  })

  // Account: Sign in
  router.post('/send-email/sign-in', (req, res) => {
    utils.sendEmail(req, 'c3457068-675e-4ff9-963e-2e7444607bad')
    res.redirect('/account/check-email/sign-in')
  })

  // Confirmation: Application submitted
  router.post('/send-email/:applicationId/application-submitted', (req, res) => {
    const { applicationId } = req.params
    const application = utils.applicationData(req)
    const candidateName = application.givenName || 'applicant'

    // Update state of application and choices
    application.status = 'submitted'

    for (choice of utils.toArray(application.choices)) {
      choice.status = 'Awaiting decision'
    }

    const choices = []
    for (const choice in application.choices) {
      const { courseCode, providerCode } = application.choices[choice]
      const provider = utils.getProvider(providerCode)
      const course = utils.getCourse(providerCode, courseCode)
      const result = `* ${provider.name} - ${course.name_and_code}\nStarting 5 September 2020`
      choices.push(result)
    }

    utils.sendEmail(req, '99a20df5-564d-4612-810e-3788edf7285e', {
      reference: applicationId,
      candidateName,
      choiceList: choices.join('\n'),
      amendDate: utils.nowPlusDays(7, 'd MMMM yyyy')
    })

    res.redirect(`/survey?applicationId=${applicationId}`)
  })

  // Decision: Unsuccessful/Offer received
  router.post('/admin/send-email', (req, res) => {
    const { email, name } = req.session.data

    let notifyTemplate
    let providerName
    let courseName
    let courseDate
    let outstandingResponsesList
    let conditionsList
    let reasonsList
    switch (email) {
      case 'offer': {
        notifyTemplate = '2a3478f7-e1bb-45a5-ae3c-2acac1448087';
        ({ providerName, courseName, courseDate, conditionsList } = urChoices[0])
        outstandingResponsesList = `* ${urChoices[1].providerName} — ${urChoices[1].courseName}\n* ${urChoices[2].providerName} — ${urChoices[2].courseName}`
        break
      }
      case 'reject': {
        notifyTemplate = '621e621d-66b6-4894-9f9e-7b9483929db7';
        ({ providerName, courseName, courseDate, reasonsList } = urChoices[1])
        outstandingResponsesList = `* ${urChoices[2].providerName} — ${urChoices[2].courseName}`
        break
      }
      case 'final-offer': {
        notifyTemplate = 'd1cde367-8ad8-4cb4-8e4f-f369f6699ade';
        ({ providerName, courseName, courseDate, conditionsList } = urChoices[2])
        break
      }
    }

    utils.sendEmail(req, notifyTemplate, {
      candidateName: name || 'candidate',
      dbdDate: utils.nowPlusDays(12, 'd MMMM yyyy'),
      providerName,
      courseName,
      courseDate,
      outstandingResponsesList,
      conditionsList, // Offer emails only
      reasonsList // Reject emails only
    })
    res.redirect('/admin/send-email-success')
  })

  // Confirmation: Decision made
  router.post('/send-email/:applicationId/:choiceId/decision', (req, res) => {
    const { applicationId, choiceId } = req.params
    const application = utils.applicationData(req)
    const { decision } = req.session.data

    let notifyTemplate
    const choice = application.choices[choiceId]
    switch (decision) {
      case 'withdraw': {
        notifyTemplate = '9ac2723b-11c3-4491-9ec5-88b472403ea2'
        choice.status = 'Application withdrawn'
        break
      }
      case 'accept': {
        notifyTemplate = '7446b2c8-1bf1-42a8-b325-509b8dabe747'
        choice.status = 'Offer accepted'

        // Set remaining course choice statuses to `withdrawn` and move to `previousApplications`
        let { choices } = application
        choices = utils.toArray(choices)
        application.choices = choices.map(choice => {
          if (choice.status === 'Offer received') {
            choice.status = 'Application withdrawn'
          }

          const newApplicationCodeForUnsuccessfulCourses = utils.generateRandomString()

          if (choice.status !== 'Offer accepted') {
            if (!req.session.data.applications[newApplicationCodeForUnsuccessfulCourses]) {
              // Copy application to previousApplications
              req.session.data.applications[newApplicationCodeForUnsuccessfulCourses] = JSON.parse(JSON.stringify(application))
              req.session.data.applications[newApplicationCodeForUnsuccessfulCourses].choices = {}
            }

            // console.log(req.session.data.applications[newApplicationCodeForUnsuccessfulCourses])
            application.previousApplications = [newApplicationCodeForUnsuccessfulCourses]
            // Add choice to previousApplication
            req.session.data.applications[newApplicationCodeForUnsuccessfulCourses].choices[choice.id] = choice
          }

          return choice
        })

        application.choices = [choice]
        break
      }
      case 'decline': {
        notifyTemplate = '906399c1-8694-4430-bcbf-c12cc06fd5a7'
        choice.status = 'Offer declined'
        break
      }
    }

    // UR: Decision is made on third course choice
    utils.sendEmail(req, notifyTemplate, {
      reference: applicationId,
      candidateName: application.givenName || 'applicant',
      providerName: urChoices[2].providerName,
      courseName: urChoices[2].courseName,
      courseDate: urChoices[2].courseDate,
      conditionsList: urChoices[2].conditionsList
    })

    if (decision === 'withdraw') {
      res.redirect(`/application/${applicationId}/${choiceId}/withdraw/confirmation`)
    } else {
      res.redirect(`/dashboard`)
    }
  })
}
