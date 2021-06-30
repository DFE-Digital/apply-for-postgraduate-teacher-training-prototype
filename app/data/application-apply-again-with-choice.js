// Copies dummy application and tweaks some fields
const applicationApplyAgainWithChoice = JSON.parse(JSON.stringify(require('./application')))

// No choices yet
applicationApplyAgainWithChoice.choices = {
  ABCDE: applicationApplyAgainWithChoice.choices.ABCDE
}

module.exports = applicationApplyAgainWithChoice
