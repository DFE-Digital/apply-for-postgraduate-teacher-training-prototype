module.exports = router => {
  router.get('/survey', (req, res) => {
    const { applicationId } = req.query

    res.render('survey/index', {
      applicationId
    })
  })

  router.post('/survey', (req, res) => {
    const { applicationId } = req.body

    res.redirect(`/dashboard?confirmation=true`)
  })
}
