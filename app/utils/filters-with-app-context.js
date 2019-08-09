const getKeypath = require('keypather/get')

// Add Nunjucks filters with access to app, req and res
module.exports = function (nunjucksAppEnv, app) {
  app.use(function (req, res, next) {
    function applicationId() {
      return req.params.applicationId
    }

    function getApplicationValue(sections) {
      var path = ["applications", applicationId()]
      sections = sections || []
      path.push(...sections)
      return getKeypath(req.session.data, path.map(s => `["${s}"]`).join(''))
    }

    // Add name, value, id, idPrefix and checked attributes to GOVUK form inputs
    // Generate the attributes based on the application ID and the section they’re in
    nunjucksAppEnv.addFilter('decorateApplicationAttributes', function (obj, sections) {
      sections = sections || []
      const storedValue = getApplicationValue(sections)

      if (obj.items !== undefined) {
        obj.items = obj.items.map(item => {
          var checked = ''
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
    nunjucksAppEnv.addFilter('ifSetForApplication', function (sections) {
      return !!getApplicationValue(sections)
    })

    // Retrieve the value of something in the current application
    // Designed as a replacement to `data[thing][thing]`
    nunjucksAppEnv.addGlobal('applicationValue', function (sections) {
      if (sections && !Array.isArray(sections)) {
        sections = [sections]
      }

      return getApplicationValue(sections)
    })

    next()
  })
}