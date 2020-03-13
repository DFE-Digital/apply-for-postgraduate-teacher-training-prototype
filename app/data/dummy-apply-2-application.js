// Copies dummy application and tweaks some fields
var dummyApply2Application = JSON.parse(JSON.stringify(require('./dummy-application')))

// Custom Apply 2 fields
dummyApply2Application.apply2 = true
dummyApply2Application.previousApplications = ['12345']

// No sections completed
dummyApply2Application.completed = {}

// No choices yet
dummyApply2Application.choices = {}

module.exports = dummyApply2Application
