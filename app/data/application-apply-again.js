// Copies dummy application and tweaks some fields
const applicationApplyAgain = JSON.parse(JSON.stringify(require('./application')))

// No choices yet
applicationApplyAgain.choices = {}
applicationApplyAgain.completed.choices = false
applicationApplyAgain.completed.personalStatement = false

module.exports = applicationApplyAgain
