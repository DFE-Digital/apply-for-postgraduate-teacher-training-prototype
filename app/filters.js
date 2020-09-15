const { DateTime } = require('luxon')
const humanizeDuration = require('humanize-duration')
const marked = require('marked')
const numberToWords = require('number-to-words')
const providers = require('./data/providers')
const degree = require('./data/degree')()

module.exports = (env) => {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  /**
   * Convert str to date
   * @type {String} str
   * @type {String} format
   */
  filters.date = (str, format = 'yyyy-LL-dd') => {
    if (str) {
      const date = (str === 'now') ? DateTime.local() : str

      const datetime = DateTime.fromISO(date, {
        locale: 'en-GB'
      }).toFormat(format)

      return datetime
    }
  }

  /**
   * Add days to date
   * @type {Integer} days
   * @type {String} format
   */
  filters.nowPlusDays = (days, format = 'yyyy-LL-dd') => {
    const date = DateTime.local().plus({ days: days })

    return DateTime.fromISO(date, {
      locale: 'en-GB'
    }).toFormat(format)
  }

  /**
   * Convert milliseconds to readable duration
   * @type {String} str
   */
  filters.duration = (int) => {
    if (!isNaN(int)) {
      const duration = humanizeDuration(int, {
        delimiter: ' and ',
        largest: 2,
        round: true,
        units: ['y', 'mo']
      })

      return duration
    }
  }

  /**
   * Convert number to ordinal word
   * @type {String} str
   */
  filters.ordinalWord = (int) => {
    if (!isNaN(int)) {
      return numberToWords.toWordsOrdinal(int)
    }
  }

  /**
   * Filter array by value
   * @type {Array} arr
   * @type {String} searchString
   *
   */
  filters.includes = (arr, searchString) => {
    if (arr) {
      if (arr.includes(searchString)) {
        return true
      }
    }
  }

  /**
   * Convert Markdown to HTML
   * @type {String} str
   * @type {String} value
   *
   */
  filters.markdown = (str, value) => {
    if (str) {
      return marked(str)
    }
  }

  /**
   * Split string into an array
   * @type {String} str
   *
   */
  filters.split = (str) => {
    if (str && !Array.isArray(str)) {
      return str.split()
    }

    return str
  }

  /**
   * Convert object to array
   * @type {Object} obj
   */
  filters.toArray = (obj) => {
    if (obj) {
      const arr = []
      for (const [key, value] of Object.entries(obj)) {
        value.id = key
        arr.push(value)
      }
      return arr
    }
  }

  /**
   * Get course information
   * @type {String} providerCode
   * @type {String} courseCode
   */
  filters.getCourse = (providerCode, courseCode) => {
    return providers[providerCode].courses[courseCode]
  }

  filters.providerCode = (providerAndCode) => {
    const regExp = /\(([^)]+)\)$/
    return regExp.exec(providerAndCode)[1]
  }

  /**
   * Check if degree type is an undergraduate degree
   * @type {String} string
   */
  filters.isUndergraduateDegree = (string) => {
    const degreeTypes = degree.types.all
    const thisType = degreeTypes.find(type => type.value === string)
    if (thisType) {
      return thisType.level === 6
    }
    return false
  }

  filters.statusClass = (status) => {
    switch (status) {
      // Application phases
      case 'Submitted':
        return 'govuk-tag--grey'
      case 'Awaiting decision':
        return 'govuk-tag--purple'
      case 'Offer received':
        return 'govuk-tag--turquoise'
      case 'Offer accepted':
        return 'govuk-tag--blue'
      case 'Offer declined':
        return 'govuk-tag--orange'
      case 'Offer deferred':
        return 'govuk-tag--yellow'
      case 'Offer withdrawn':
      case 'Conditions not met':
        return 'govuk-tag--red'
      case 'Conditions met':
        return 'govuk-tag--green'
      case 'Unsuccessful':
      case 'Application not sent':
        return 'govuk-tag--pink'
      case 'Application cancelled':
      case 'Application withdrawn':
        return 'govuk-tag--orange'

      // Reference statuses
      case 'Not requested yet':
        return 'govuk-tag--grey'
      case 'Awaiting response':
        return 'govuk-tag--purple'
      case 'Reference overdue':
        return 'govuk-tag--yellow'
      case 'Reference given':
        return 'govuk-tag--green'
      case 'Cancelled':
        return 'govuk-tag--orange'
      case 'Reference declined':
      case 'Email address incorrect':
        return 'govuk-tag--red'
    }
  }

  return filters
}
