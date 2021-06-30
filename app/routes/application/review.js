const utils = require('./../../utils')

module.exports = router => {
  router.get('/application/:applicationId/review', (req, res) => {
    const application = utils.applicationData(req)
    const { applicationId } = req.params
    const pageObject = {}
    const successFlash = req.flash('success')

    if (successFlash[0] === 'submitted-incompleted-application') {
      pageObject.errorList = []
      const sections = {
        choices: 'Course choices not marked as completed',
        // references: 'You need 2 references before you can submit your application',
        personalInformation: 'Personal information not marked as completed',
        contactInformation: 'Contact information not marked as completed',
        english: 'English GCSE or equivalent not marked as completed',
        maths: 'Maths GCSE or equivalent not marked as completed',
        science: 'Science GCSE or equivalent not marked as completed',
        otherQualifications: 'A levels and other qualifications not marked as complete',
        degree: 'Degree section not marked as completed',
        workHistory: 'Work history not marked as completed',
        unpaidExperience: 'Unpaid experience not marked as completed',
        personalStatement: 'Personal statement not marked as completed',
        subjectKnowledge: 'Subject knowledge not marked as completed',
        additionalSupport: 'Any disability or other needs not marked as completed',
        interviewNeeds: 'Interview needs not marked as completed',
        safeguarding: 'Safeguarding information not marked as completed'
      }

      for (const [key, value] of Object.entries(sections)) {
        if (key === 'gcse') {
          const subjects = ['maths', 'english', 'science']
          subjects.forEach(subject => {
            if (!utils.hasCompletedSection(application.completed.subject)) {
              pageObject.errorList.push({
                text: value[subject],
                href: `#gcse-${subject}`
              })
            }
          })
        } else {
          if (!utils.hasCompletedSection(application.completed[key])) {
            pageObject.errorList.push({
              text: value,
              href: `#${key}`
            })
          }
        }
      }
    }

    pageObject.closed = req.query.closed

    pageObject.applicationPath = `/application/${applicationId}`

    res.render('application/review', pageObject)
  })

  router.post('/application/:applicationId/review', (req, res) => {
    // If updating job/role, ensure dates are saved using ISO 8601
    const id = req.query.update
    const application = utils.applicationData(req)
    const referer = req.get('referer')

    if (id && referer.includes('work-history')) {
      utils.saveIsoDate(req, application.workHistory, id)
    }

    if (id && referer.includes('unpaid-experience')) {
      utils.saveIsoDate(req, application.unpaidExperience, id)
    }

    res.render('application/review')
  })

  router.post('/application/:applicationId/review-complete', (req, res) => {
    const { applicationId } = req.params
    const completedApplication = utils.hasCompletedApplication(req)

    if (completedApplication) {
      res.redirect(`/application/${applicationId}/equality-monitoring`)
    } else {
      req.flash('success', 'submitted-incompleted-application')
      res.redirect(`/application/${applicationId}/review`)
    }
  })
}
