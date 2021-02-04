const providers = require('../../data/providers')
const utils = require('./../../utils')

module.exports = router => {


  // Top level respond page
  router.get('/application/:applicationId/respond', (req, res) => {
    const { applicationId } = req.params
    const application = utils.applicationData(req)

    const choices = utils.toArray(application.choices).filter(function(choice) {
      return (choice["status"] == "Offer received")
    })

    res.render(`application/decision/respond`, {
      applicationId,
      application,
      choices
    })
  })



  // Render decision pages
  router.get('/application/:applicationId/:choiceId/:view(withdraw|accept|decline|view)', (req, res) => {
    const { choiceId } = req.params
    const { referrer } = req.query
    const application = utils.applicationData(req)

    const choice = application.choices[choiceId]
    const provider = providers[choice.providerCode]
    const course = provider.courses[choice.courseCode]

    res.render(`application/decision/${req.params.view}`, {
      provider,
      course,
      choice,
      choiceId,
      referrer
    })
  })

  // Render withdraw confirmation page
  router.get('/application/:applicationId/:choiceId/withdraw/confirmation', (req, res) => {
    const { choiceId } = req.params
    const { referrer } = req.query
    const application = utils.applicationData(req)

    const choice = application.choices[choiceId]
    const provider = providers[choice.providerCode]
    const course = provider.courses[choice.courseCode]

    res.render('application/decision/withdraw-confirmation', {
      provider,
      course,
      choice,
      choiceId,
      referrer
    })
  })

  // Submit decision
  router.post('/application/:applicationId/:choiceId/view', (req, res) => {
    const { applicationId, choiceId } = req.params
    const { decision } = req.session.data

    res.redirect(`/application/${applicationId}/${choiceId}/${decision}`)
  })
}
