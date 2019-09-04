const providers = require('../../data/providers')
const utils = require('./../../utils')

/**
 * Application: Subject knowledge routes
 */
module.exports = router => {
  router.get('/application/:applicationId/personal-statement/:providerCode', (req, res) => {
    const applicationData = utils.applicationData(req)
    const providerCode = req.params.providerCode
    const personalStatement = applicationData['personal-statements'][providerCode]
    // const referrer = req.query.referrer
    // const provider = providers[providerCode]

    if (personalStatement && personalStatement.id) {
      res.redirect(`/application/${req.params.applicationId}/personal-statement/${providerCode}/review`)
    } else {
      res.redirect(`/application/${req.params.applicationId}/personal-statement/${providerCode}/new`)
    }
  })

  router.post('/application/:applicationId/personal-statement/:providerCode/copy', (req, res) => {
    const applicationData = utils.applicationData(req)
    const providerCode = req.params.providerCode
    const personalStatement = applicationData['personal-statements'][providerCode]
    // const referrer = req.query.referrer
    // const provider = providers[providerCode]

    if (personalStatement['write-new'] == 'new') {
      // TODO: copy existing


    } else {
      // TODO: set pointer
      // What does this look like?
    }

    res.redirect(`/application/${req.params.applicationId}/personal-statement/${providerCode}/review`)
  })

  // Render other cover letter pages
  router.get('/application/:applicationId/personal-statement/:providerCode/:view', (req, res) => {
    const referrer = req.query.referrer
    const providerCode = req.params.providerCode
    const provider = providers[providerCode]
    const view = req.params.view

    res.render(`application/personal-statement/${view}`, {
      formaction: referrer || `/application/${req.params.applicationId}`,
      referrer,
      providerCode,
      provider
    })
  })
}
