const getKeypath = require('keypather/get')
const providers = require('../data/providers')
const utils = require('./../utils')

// Add Nunjucks filters with access to app, req and res
module.exports = (nunjucksAppEnv, app) => {
  app.use((req, res, next) => {
    const applicationId = () => {
      return req.params.applicationId
    }

    const getApplicationValue = (sections) => {
      const path = ['applications', applicationId()]
      sections = sections || []
      path.push(...sections)
      return getKeypath(req.session.data, path.map(s => `["${s}"]`).join(''))
    }

    const prefillPreviousQualificationValues = (sections) => {
      if (sections.includes('subject') || sections.includes('grade')) {
        return null
      }

      // Get the most recently added qualification
      const qualifications = getApplicationValue(sections.slice(0, 1))

      if (!qualifications || Object.values(qualifications).length === 0) {
        return null
      }

      const latestQualification = Object.values(qualifications).slice(-1)[0]

      // Return value from previously added qualification
      return latestQualification[sections.slice(-1)[0]]
    }

    // Add name, value, id, idPrefix and checked attributes to GOVUK form inputs
    // Generate the attributes based on the application ID and the section they’re in
    nunjucksAppEnv.addFilter('decorateApplicationAttributes', (obj, sections) => {
      sections = sections || []
      let storedValue = getApplicationValue(sections)

      // Prefill qualification values based on previous answers
      if (!storedValue &&
        !sections.includes('completed') &&
        sections.includes('otherQualifications')) {
        storedValue = prefillPreviousQualificationValues(sections)
      }

      if (obj.items !== undefined) {
        obj.items = obj.items.map(item => {
          let checked = ''
          if (typeof item.value === 'undefined') {
            item.value = item.text
          }

          // If data is an array, check it exists in the array
          if (Array.isArray(storedValue)) {
            if (storedValue.indexOf(item.value) !== -1) {
              checked = 'checked'
            }
          } else {
            // The data is just a simple value, check it matches
            if (storedValue === item.value) {
              checked = 'checked'
            }
          }

          item.checked = checked
          return item
        })

        obj.idPrefix = sections.join('-')
      } else {
        obj.value = storedValue
      }

      obj.id = sections.join('-')
      obj.name = `applications[${applicationId()}]${sections.map(s => `[${s}]`).join('')}`
      return obj
    })

    // Check if something is set in the current application
    nunjucksAppEnv.addFilter('ifSetForApplication', (sections) => {
      return !!getApplicationValue(sections)
    })

    // Retrieve the value of something in the current application
    // Designed as a replacement to `data[thing][thing]`
    nunjucksAppEnv.addGlobal('applicationValue', (sections) => {
      if (sections && !Array.isArray(sections)) {
        sections = [sections]
      }

      return getApplicationValue(sections)
    })

    nunjucksAppEnv.addGlobal('valueOrPreviousQualificationValue', (sections) => {
      if (sections && !Array.isArray(sections)) {
        sections = [sections]
      }

      return getApplicationValue(sections) || prefillPreviousQualificationValues(sections)
    })

    nunjucksAppEnv.addFilter('getCourseFromProviderCode', providerCode => {
      const courses = getApplicationValue(['courses'])
      const course = Object.values(courses).find(course => course.providerCode === providerCode)
      return course ? providers[providerCode].courses[course.courseCode] : false
    })

    nunjucksAppEnv.addGlobal('hasSubmittedApplications', () => {
      return utils.hasSubmittedApplications(req)
    })

    nunjucksAppEnv.addGlobal('hasStartedApplications', () => {
      return utils.hasStartedApplications(req)
    })

    nunjucksAppEnv.addGlobal('hasPrimaryChoices', () => {
      return utils.hasPrimaryChoices(req)
    })

    // Returns true if there is an application in the unsubmitted state
    nunjucksAppEnv.addGlobal('hasDraftApplication', () => {
      return Boolean(utils.toArray(req.session.data.applications)
        .find(application => application.status == 'started'))
    })

    // Returns number of courses that have ever been applied to, regardless of state
    nunjucksAppEnv.addGlobal('totalNumberOfChoices', () => {
      let numberOfChoices = 0

      for (application of utils.toArray(req.session.data.applications)) {
        numberOfChoices += utils.toArray(application.choices)
      }

      return numberOfChoices
    })

    // Returns the accepted offer if there is one, regardless of whether
    // there are conditions that need to be met, or if the offer has been deferred
    nunjucksAppEnv.addGlobal('acceptedChoice', () => {
      let acceptedChoice = null

      for (application of utils.toArray(req.session.data.applications)) {
        for (choice of utils.toArray(application.choices)) {
          if (choice.status == 'Offer accepted' || choice.status == 'Offer deferred' || choice.status == 'Offer confirmed') {
            acceptedChoice = choice
          }
        }
      }

      return acceptedChoice
    })


    // Returns the number of courses to which the candidate has a pending application
    // (submitted and still waiting on an outcome)
    nunjucksAppEnv.addGlobal('numberOfPendingChoices', () => {
      let numberOfPendingChoices = 0
      for (application of utils.toArray(req.session.data.applications)) {
        for (choice of utils.toArray(application.choices)) {
          if (application.status == 'submitted' &&
            (choice.status == 'Awaiting decision' || choice.status == 'Offer received' )
          ) {
            numberOfPendingChoices += 1
          }
        }
      }

      return numberOfPendingChoices
    })




    next()
  })
}
