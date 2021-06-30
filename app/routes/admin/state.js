const { DateTime } = require('luxon')
const utils = require('./../../utils')

module.exports = router => {
  router.get('/admin/state/:applicationStatus?', (req, res) => {

    const { applicationId, applicationStatus } = req.params
    const { confirmation } = req.query

    if (applicationStatus) {
      // clear data and reset it from file
      req.session.data = {}
      req.session.data = utils.defaultSessionData()
    }

    const application = utils.applicationData(req) || {}
    // const choices = application.choices || {}

    switch (applicationStatus) {

      // Started but unsubmitted
      case 'started':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application'))
        req.session.data.applications["45678"].status = 'started'

        break

      // Stated an second application after first one unsuccessful
      case 'applying-again':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'
        req.session.data.applications["45678"].choices.ABCDE.status = 'Unsuccessful'

        req.session.data.applications["ABC12"] = utils.copyObject(require('../../data/application'))
        req.session.data.applications["ABC12"].status = 'started'


        break


      // One submitted, one in draft
      case 'one-submitted-one-in-draft':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'
        req.session.data.applications["45678"].choices.ABCDE.status = 'Awaiting decision'

        req.session.data.applications["AB12C"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications.AB12C.status = 'started'
        req.session.data.applications.AB12C.choices = {}
        req.session.data.applications.AB12C.completed.choices = false
        break

      // Single course states
      case 'awaiting-provider-decision':

        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))

        req.session.data.applications["45678"].status = 'submitted'
        const choices = req.session.data.applications["45678"].choices
        choices.ABCDE.status = 'Awaiting decision'
        choices.ABCDE.interview = false
        choices.ABCDE.feedback = null
        choices.ABCDE.rejectedByDefault = false
        break

      case 'future-interview':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))

        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Awaiting decision'
        req.session.data.applications["45678"].choices.ABCDE.interview = [{
          date: DateTime.local().set({ hour: 10, minute: 30 }).plus({ days: 7 }),
          providerName: 'Leeds Trinity University',
          address: 'Brownberrie Lane, Horsforth, Leeds. LS18 5HD'
        }]
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      case 'post-interview':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Awaiting decision'
        req.session.data.applications["45678"].choices.ABCDE.interview = [{
          date: DateTime.local().set({ hour: 10, minute: 30 }).minus({ days: 2 }),
          providerName: 'Leeds Trinity University',
          address: 'Brownberrie Lane, Horsforth, Leeds. LS18 5HD'
        }]
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      case 'offer-received':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer received'
        req.session.data.applications["45678"].choices.ABCDE.interview = null
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check',
          'Achievement of Degree in BA Ballet Education with 2:1 or above',
          'Verification of original or certified copies of GCSE Maths and English certificates at grade C (4) or above.',
          'Return completed and signed Suitability Declaration.',
          'Return completed and signed Fee Status Declaration.'
        ]
        break

      case 'offer-received-different-course':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer received'
        req.session.data.applications["45678"].choices.ABCDE.offeredCourseId = '3C2X'
        req.session.data.applications["45678"].choices.ABCDE.interview = null
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]
        break

      case 'offer-received-different-provider':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer received'
        req.session.data.applications["45678"].choices.ABCDE.offeredCourseId = 'X100'
        req.session.data.applications["45678"].choices.ABCDE.offeredProviderId = 'S31'
        req.session.data.applications["45678"].choices.ABCDE.interview = null
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]
        break

      case 'unsuccessful-with-feedback':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications["45678"].choices.ABCDE.hasFeedback = true
        req.session.data.applications["45678"].choices.ABCDE.feedback = {
          behaviour: {
            didNotReplyToMessages: true
          },
          qualityOfApplication: {
            subjectKnowledge: 'Understand the purpose of primary education and then learn more about the procedures related to safeguarding.'
          },
          qualifications: {
            degree_does_not_meet_requirements: true
          }
        }
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      case 'unsuccessful-course-full':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications["45678"].choices.ABCDE.hasFeedback = true
        req.session.data.applications["45678"].choices.ABCDE.feedback = {
          course_full: true
        }
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      case 'unsuccessful-provider-did-not-respond':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications["45678"].choices.ABCDE.hasFeedback = true
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = true
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        break

      case 'withdrawn':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Application withdrawn'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        break

      case 'offer-withdrawn':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer withdrawn'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.feedback = {
          behaviour: {
            didNotReplyToMessages: true,
            other: 'You did not send us the required form with additional information.',
            whatTheyCouldToDoImprove: 'Respond promptly to our requests.'
          }
        }
        break

      case 'accepted':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer accepted'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.feedback = null
        req.session.data.applications["45678"].choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check',
          'Achievement of Degree in BA Ballet Education with 2:1 or above',
          'Verification of original or certified copies of GCSE Maths and English certificates at grade C (4) or above.',
          'Return completed and signed Suitability Declaration.',
          'Return completed and signed Fee Status Declaration.'
        ]
        break

      case 'declined':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer declined'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      case 'deferred':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer deferred'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check',
          'Achievement of Degree in BA Ballet Education with 2:1 or above',
          'Verification of original or certified copies of GCSE Maths and English certificates at grade C (4) or above.',
          'Return completed and signed Suitability Declaration.',
          'Return completed and signed Fee Status Declaration.'
        ]
        break

      case 'did-not-respond-to-offer':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer declined'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      case 'conditions-not-met':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Conditions not met'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        req.session.data.applications["45678"].choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check',
          'Achievement of Degree in BA Ballet Education with 2:1 or above',
          'Verification of original or certified copies of GCSE Maths and English certificates at grade C (4) or above.',
          'Return completed and signed Suitability Declaration.',
          'Return completed and signed Fee Status Declaration.'
        ]
        break
      case 'recruited-single':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Offer confirmed'
        req.session.data.applications["45678"].choices.ABCDE.rejectedByDefault = false
        break

      // Multiple courses applied for
      case 'awaiting-all-provider-decisions':
        req.session.data.applications["45678"] = utils.copyObject(require('../../data/application'))
        req.session.data.applications["45678"].status = 'submitted'

        req.session.data.applications["45678"].choices.ABCDE.status = 'Awaiting decision'
        req.session.data.applications["45678"].choices.ABCDE.interview = false
        req.session.data.applications["45678"].choices.FGHIJ.status = 'Awaiting decision'
        req.session.data.applications["45678"].choices.FGHIJ.interview = false
        req.session.data.applications["45678"].choices.ZYXWV.status = 'Awaiting decision'
        req.session.data.applications["45678"].choices.ZYXWV.interview = false
        break

      case 'interviewing':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Awaiting decision'
        req.session.data.applications.Z12S3.choices.ABCDE.interview = [{
          date: DateTime.local().set({ hour: 10, minute: 30 }).plus({ days: 7 }),
          providerName: 'University of Leeds',
          address: 'Zoom: <a href="#">https://zoom.us/https://us02web.zoom.us/j/35346436342?pwd=bk43RStvSnFHK1NQZnVp6D3DFTSJFGNS</a>'
        }]
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Awaiting decision'
        req.session.data.applications.Z12S3.choices.FGHIJ.interview = [{
          date: DateTime.local().set({ hour: 14, minute: 30 }).plus({ days: 2 }),
          providerName: 'Leeds Trinity University',
          address: 'Brownberrie Lane, Horsforth, Leeds. LS18 5HD'
        }]
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Awaiting decision'

        break

      case 'awaiting-one-provider-decision-one-offer':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Awaiting decision'
        req.session.data.applications.Z12S3.choices.ABCDE.interview = [{
          date: DateTime.local().set({ hour: 10, minute: 30 }).minus({ days: 2 }),
          providerName: 'University of Leeds',
          address: 'Zoom: <a href="#">https://zoom.us/https://us02web.zoom.us/j/35346436342?pwd=bk43RStvSnFHK1NQZnVp6D3DFTSJFGNS</a>'
        }]
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.FGHIJ.feedback = {
          course_full: true
        }
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Offer received'
        req.session.data.applications.Z12S3.choices.ZYXWV.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]

        break

      case 'awaiting-one-provider-decision-no-offers':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Awaiting decision'
        req.session.data.applications.Z12S3.choices.ABCDE.interview = [{
          date: DateTime.local().set({ hour: 10, minute: 30 }).plus({ days: 7 }),
          providerName: 'Gorse SCITT',
          address: 'Clifford Moor Road, Boston Spa, West Yorkshire. LS23 6RW'
        }]
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.FGHIJ.feedback = {
          qualityOfApplication: {
            personalStatement: 'Your rationale for wanting to teach was strong but your personal statement did not demonstrate that you understand the rewards and challenges of teaching. There were a number of spelling and grammar errors throughout the application.'
          },
          additionalFeedback: 'It would also strengthen your application if you could get more experience of working within a primary school. '
        }
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ZYXWV.interview = null
        req.session.data.applications.Z12S3.choices.ZYXWV.feedback = {
          additionalFeedback: 'Thank you for your application. After careful consideration, we have decided not to select you for interview for a place on this highly competitive programme.  We wish you all the best with the other applications you have made.'
        }
        break

      case 'received-one-offer':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ABCDE.interview = false
        req.session.data.applications.Z12S3.choices.ABCDE.feedback = {
          behaviour: {
            didNotReplyToMessages: true
          }
        }
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Application withdrawn'
        req.session.data.applications.Z12S3.choices.FGHIJ.interview = false
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Offer received'
        req.session.data.applications.Z12S3.choices.ZYXWV.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]
        break

      case 'received-two-offers':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Offer received'
        req.session.data.applications.Z12S3.choices.ABCDE.interview = [{
          date: DateTime.local().set({ hour: 10, minute: 30 }).minus({ days: 3 }),
          providerName: 'Gorse SCITT',
          address: 'Clifford Moor Road, Boston Spa, West Yorkshire. LS23 6RW'
        }]
        req.session.data.applications.Z12S3.choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check',
          'Return completed and signed Suitability Declaration.',
          'Return completed and signed Fee Status Declaration.'
        ]
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.FGHIJ.feedback = {
          course_full: true
        }
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Offer received'
        req.session.data.applications.Z12S3.choices.ZYXWV.interview = false
        req.session.data.applications.Z12S3.choices.ZYXWV.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]
        break

      case 'awaiting-candidate-response':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ABCDE.hasFeedback = true
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Offer received'
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Awaiting decision'
        break

      // Actionable feedback
      case 'ended-without-success':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ABCDE.feedback = {
          qualityOfApplication: {
            personalStatement: 'Contained several spelling mistakes and grammatical errors.\n\nThe candidate should describe the impact they want to have on their students in more detail.',
            other: 'Candidate was not able to demonstrate sufficient experience of working with children.'
          }
        }
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.FGHIJ.feedback = {
          qualityOfApplication: {
            personalStatement: 'Your rationale for wanting to teach was strong but your personal statement did not demonstrate that you understand the rewards and challenges of teaching. There were a number of spelling and grammar errors throughout the application.'
          },
          additionalFeedback: 'It would also strengthen your application if you could get more experience of working within a primary school. '
        }
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ZYXWV.interview = null
        req.session.data.applications.Z12S3.choices.ZYXWV.feedback = {
          qualityOfApplication: {
            personalStatement: 'Focus more on why teaching is the career for you.',
            subjectKnowledge: 'Look at ways to evidence subject knowledge within your application or supporting statement.'
          }
        }
        break

      // Vague feedback
      case 'ended-without-success-vague-feedback':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ABCDE.feedback = {
          qualityOfApplication: {
            personalStatement: 'The overall application was weak suggesting that the applicant may not be successful on the course',
            subjectKnowledge: 'Lack of reference regarding the subject.'
          }
        }
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.FGHIJ.feedback = {
          performanceAtInterview: 'You had not made a sufficiently considered and informed decision to train to teach.',
          qualityOfApplication: {
            personalStatement: 'The quality of communication in the personal statement could be improved.'
          },
          additionalFeedback: 'There have been limited places for this course and stronger applications received.'
        }
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ZYXWV.interview = null
        req.session.data.applications.Z12S3.choices.ZYXWV.feedback = {
          qualityOfApplication: {
            personalStatement: 'Focus more on why teaching is the career for you.',
            subjectKnowledge: 'Academic record does not look strong enough to cope with the PGCE that is mandatory this year, on top of heavy planning and teaching workload.'
          },
          additionalFeedback: 'You could apply for the unsalaried route that we offer.'
        }
        break

      // Qualifications feedback
      case 'ended-without-success-qualifications-feedback':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.gcse.maths.gradeSingle = 'D'
        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ABCDE.feedback = {
          qualifications: {
            noMathsGCSEOrEquivalent: true
          }
        }
        req.session.data.applications.Z12S3.choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.FGHIJ.feedback = {
          qualifications: {
            noMathsGCSEOrEquivalent: true,
            other: 'Our minimum degree requirement is a 2:1. We cannot accepted degrees with a 2:2 or below.'
          },
          additionalFeedback: 'There have been limited places for this course and stronger applications received.'
        }
        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Unsuccessful'
        req.session.data.applications.Z12S3.choices.ZYXWV.interview = null
        req.session.data.applications.Z12S3.choices.ZYXWV.feedback = {
          qualifications: {
            noMathsGCSEOrEquivalent: true,
            other: 'Thank you for your application. Unfortunately you do not meet our entry requirements in terms of subject knowledge. As your degree is not in English you would need A Levels of grade C or above in English Language and English Literature.'
          }
        }
        break

      case 'pending-conditions':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Offer accepted'
        req.session.data.applications.Z12S3.choices.ABCDE.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]
        req.session.data.applications.Z12S3.choices = [req.session.data.applications.Z12S3.choices.ABCDE]
        break

      case 'offer-deferred':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Offer deferred'
        req.session.data.applications.Z12S3.choices.ZYXWV.conditions = [
          'Fitness to Teach check',
          'Disclosure and barring service check'
        ]
        req.session.data.applications.Z12S3.choices = [req.session.data.applications.Z12S3.choices.ZYXWV]

        break

      case 'recruited':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application'))
        req.session.data.applications.Z12S3.status = 'submitted'

        req.session.data.applications.Z12S3.choices.ZYXWV.status = 'Offer confirmed'
        req.session.data.applications.Z12S3.choices = [req.session.data.applications.Z12S3.choices.ZYXWV]
        break

      case 'awaiting-apply-again-response':
        req.session.data.applications.Z12S3 = utils.copyObject(require('../../data/application-single-choice'))
        req.session.data.applications.Z12S3.status = 'submitted'
        req.session.data.applications.Z12S3.choices.ABCDE.status = 'Awaiting decision'

        req.session.data.applications['12345'] = utils.copyObject(require('../../data/application'))
        req.session.data.applications['12345'].status = 'submitted'
        req.session.data.applications['12345'].choices.ABCDE.status = 'Unsuccessful'
        req.session.data.applications["12345"].choices.ABCDE.feedback = {
          course_full: true
        }
        req.session.data.applications['12345'].choices.FGHIJ.status = 'Unsuccessful'
        req.session.data.applications["12345"].choices.FGHIJ.feedback = {
          course_full: true
        }

        req.session.data.applications['12345'].choices.ZYXWV.status = 'Unsuccessful'
        req.session.data.applications["12345"].choices.ZYXWV.feedback = {
          course_full: true
        }
        break
    }

    res.redirect('/dashboard')
  })
}
