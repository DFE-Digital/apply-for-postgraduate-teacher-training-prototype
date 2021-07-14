const { DateTime } = require('luxon')
const humanizeDuration = require('humanize-duration')
const marked = require('marked')
const numberToWords = require('number-to-words')
const providers = require('./data/providers')
const degree = require('./data/degree')()
const utils = require('./utils')

module.exports = (env) => {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  filters.dateNow = () => {
    return DateTime.local()
  }

  /**
   * Remove empty values from address object and break into new lines
   *
   * @type {object} object
   */
  filters.formatAddress = object => {
    if (object) {
      const array = filters.toArray(object)
      return array.filter(value => value !== '').join('\n')
    }
  }

  /**
   * Format numeric date into a human readable format
   *
   * @type {object} object
   */
  filters.formatDate = object => {
    if (object) {
      const date = `${object.year}-${object.month}-${object.day}`

      return filters.date(date, 'd MMMM yyyy')
    }
  }

  /**
   * Format list of nationalities to remove ‘Other’
   *
   * @type {object} object
   */
  filters.formatNationalities = (object = {}) => {
    if (object) {
      // Using slice() to shallow-copy the array rather than referencing the original
      const nationalities = object.nationality.slice()
      if (object.otherNationality1) { nationalities.push(object.otherNationality1) }
      if (object.otherNationality2) { nationalities.push(object.otherNationality2) }
      if (object.otherNationality3) { nationalities.push(object.otherNationality3) }

      const nationalityList = nationalities.filter(value => value !== 'Other')

      return filters.formatList(nationalityList)
    }
  }

  /**
   * Convert array to readable list format
   * @param {Array} array Array to convert
   * @example [A, B, C] => A, B anc C
   */
  filters.formatList = (array = []) => {
    const lf = new Intl.ListFormat('en')
    return lf.format(array)
  }

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

  filters.push = (array, item) => {
    array.push(item)
    return array
  }

  /**
   * Get course information
   * @type {String} providerCode
   * @type {String} courseCode
   */
  filters.getCourse = (providerCode, courseCode) => {
    return providers[providerCode].courses[courseCode]
  }

  filters.getProvider = (providerCode) => {
    return utils.getProvider(providerCode)
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

  filters.statusClass = (status, prefix = 'govuk-tag') => {
    switch (status) {
      // Application statuses
      case 'Submitted':
        return `${prefix}--grey`
      case 'Awaiting decision':
        return `${prefix}--purple`
      case 'Offer received':
        return `${prefix}--turquoise`
      case 'Offer accepted':
        return `${prefix}--blue`
      case 'Offer declined':
        return `${prefix}--orange`
      case 'Offer deferred':
        return `${prefix}--yellow`
      case 'Offer withdrawn':
      case 'Conditions not met':
        return `${prefix}--red`
      case 'Offer confirmed':
        return `${prefix}--green`
      case 'Unsuccessful':
      case 'Application not sent':
        return `${prefix}--pink`
      case 'Application cancelled':
      case 'Application withdrawn':
        return `${prefix}--orange`

      // Reference statuses
      case 'Not requested yet':
      case 'Deactivated':
        return `${prefix}--grey`
      case 'Awaiting response':
        return `${prefix}--purple`
      case 'Reference overdue':
        return `${prefix}--yellow`
      case 'Reference given':
        return `${prefix}--green`
      case 'Request cancelled':
        return `${prefix}--orange`
      case 'Reference declined':
      case 'Request failed':
        return `${prefix}--red`
    }
  }

  return filters
}
