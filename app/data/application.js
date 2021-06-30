module.exports = {
  status: 'started',
  welcomeFlow: false,
  ended_without_success: false,
  completed: {
    choices: 'true',
    personalInformation: 'true',
    contactInformation: 'true',
    workHistory: 'true',
    unpaidExperience: 'true',
    additionalSupport: 'true',
    safeguarding: 'true',
    subjectKnowledge: 'true',
    interviewNeeds: 'true',
    english: 'true',
    science: 'true',
    maths: 'true',
    degree: 'true',
    otherQualifications: 'true',
    personalStatement: 'true'
  },
  account: {
    email: 'janina.doe@example.com'
  },
  choices: {
    ABCDE: {
      courseCode: '2MH9',
      providerCode: '1DR',
      locationName: 'Hillcrest Academy',
      locationAddress: 'Cowper Street, Leeds. LS7 4DR',
      studyMode: 'Full time',
      type: 'PGCE with QTS full time',
      length: '1 year',
      starts: '2021-09'
    },
    FGHIJ: {
      courseCode: '38PN',
      providerCode: 'S90',
      locationName: 'Main Site',
      locationAddress: 'Brownberrie Lane, Horsforth, Leeds. LS18 5HD',
      studyMode: 'Full time',
      type: 'PGCE with QTS full time',
      length: '1 year',
      starts: '2021-09'
    },
    ZYXWV: {
      courseCode: '3C2X',
      providerCode: '1N1',
      locationName: 'Boston Spa School',
      locationAddress: 'Clifford Moor Road, West Yorkshire, LS23 6RW',
      studyMode: 'Full time',
      type: 'PGCE with QTS full time',
      length: '1 year',
      starts: '2021-09'
    }
  },
  references: {
    first: {
      id: 'first',
      name: 'Joesph Bloggs',
      relationship: 'They were my tutor at university from 2011 to 2013',
      email: 'joesph.r.bloggs@example.com',
      type: 'Academic',
      status: 'Reference given',
      ready: true,
      log: [{
        note: 'Request sent',
        date: '2021-01-03T17:39:20'
      }, {
        note: 'Automated reminder sent',
        date: '2021-01-10T17:39:20'
      }, {
        note: 'Reference given',
        date: '2021-01-10T21:39:20'
      }]
    },
    second: {
      id: 'second',
      name: 'Jane Doe',
      relationship: 'Faith leader who I have known since January 2018',
      email: 'jane.doe@example.com',
      type: 'Character',
      status: 'Request cancelled',
      nudges: 0,
      log: [{
        note: 'Request sent',
        date: '2021-01-03T17:39:20'
      }, {
        note: 'Automated reminder sent',
        date: '2021-01-10T17:39:20'
      }, {
        note: 'Request cancelled',
        date: '2021-01-10T21:39:20'
      }]
    },
    third: {
      id: 'third',
      name: 'Jamie Murphy',
      relationship: 'They were my tutor at university from 2011 to 2013',
      email: 'james.m@example.com',
      type: 'Academic',
      status: 'Reference given',
      ready: true,
      nudges: 0,
      log: [{
        note: 'Request sent',
        date: '2021-01-03T17:39:20'
      }, {
        note: 'Reference given',
        date: '2021-01-05T10:12:20'
      }]
    }
  },
  candidate: {
    givenName: 'Janina',
    familyName: 'Doe',
    dateOfBirth: {
      day: '09',
      month: '02',
      year: '1988'
    },
    nationality: ['British']
  },
  contactInformation: {
    tel: '07944 386555',
    addressType: 'domestic',
    address: {
      line1: '5 Claremont Road',
      level2: 'Pudsey',
      level1: 'West Yorkshire',
      country: 'United Kingdom',
      postalCode: 'LS28 7DQ'
    }
  },
  additionalSupportDisclose: 'No',
  safeguardingDisclose: 'No',
  test: "test",
  degree: {
    abcde: {
      id: 'kq19m',
      provenance: 'domestic',
      typeUk: 'BSc',
      subject: 'Physics',
      org: 'The University of Edinburgh',
      country: 'United Kingdom',
      yearStart: '2006',
      yearEnd: '2009',
      completed: 'Yes',
      grade: 'Lower second-class honours (2:2)'
    }
  },
  gcse: {
    maths: {
      id: 'maths',
      type: 'GCSE',
      gradeSingle: 'A*',
      year: '2004',
      country: 'United Kingdom'
    },
    english: {
      id: 'english',
      type: 'GCSE',
      exam: ['English Language', 'English Literature'],
      gradeLanguage: 'C',
      gradeLiterature: 'B',
      year: '2004',
      country: 'United Kingdom'
    },
    science: {
      id: 'science',
      type: 'GCSE',
      exam: 'Double (or combined) award',
      gradeDouble: 'A*A*',
      year: '2004',
      country: 'United Kingdom'
    }
  },
  otherQualifications: {
    X1C3E: {
      id: 'X1C3E',
      type: 'A level',
      subject: 'English',
      grade: 'B',
      year: '2006'
    },
    Z4N6P: {
      id: 'Z4N6P',
      type: 'A level',
      subject: 'History',
      grade: 'C',
      year: '2006'
    },
    Y5L4P: {
      id: 'Y5L4P',
      type: 'A level',
      subject: 'Drama',
      grade: 'A',
      year: '2006'
    }
  },
  otherQualificationsDisclose: 'Yes',
  subjectKnowledge: 'I have a passion for literature and drama, and have studied these at A-level. I enjoy reading and regularly going to the theatre. I have also self-published 2 short stories.\n\nI believe I would be able to inspire children with a lifelong passion for reading.',
  interviewNeedsDisclose: 'Yes',
  interviewNeeds: 'I am out of the country between 12 March and 15 April.',
  personalStatement: 'I’ve wanted to become a teacher since being inspired by passionate and brilliant teachers during my school years. There enthusiasm to get the best out of me and to be the best that I can has led me to applying to become a teacher.\n\nI studed English at GCSE and A level and gained not only high academic grades but also a love for the theatre that I want to pass on to the next generation.\n\nWhile volunteering as a teaching assistant I saw the skills needed to be a great teacher one of which is leadership. I am an adept leader and have shown this in several roles. I volunteered in two schools to get experience in different settings and assisted teachers in Key Stages 1 and 2.\n\nI enjoy reading and learning about contemporary ethics and society, considering how I can use this to benefit the students I teach. While in schools I have seen the rewards and challenges presented to teachers and think I have the qualities to make a difference.',
  workHistoryDisclose: 'Yes',
  workHistory: {
    n7901: {
      id: 'n7901',
      category: 'job',
      role: 'Undergraduate teaching assistant',
      org: 'University of Edinburgh',
      type: 'Full time',
      description: 'Leveraged exceptional communication skills to improve student performance in the Department of Physics and Astronomy. Provided comprehensive support for Introductory astronomy, analog electronics, and experimental physics courses.\n\nTutored students and answered questions during lectures and lab sessions. Instructed students, assessed grades, and assisted with observation projects at the planetarium and the Paul P. Feder Observatory.',
      workedWithChildren: 'Yes',
      startDate: '2010-01-01',
      endDate: '2013-05-01'
    },
    n8dh6: {
      id: 'n8dh6',
      category: 'job',
      role: 'Summer intern',
      type: 'Part time',
      org: 'Association of Variable Star Observers',
      description: 'Maintained the APASS and the NAPASS database and kept it up to date with new observed data using the UNIX shell scripting. Ran photometry and astrometry programs (based on UNIX shell scripting) written by Dr. Arne Henden to calibrate observed APASS and NAPASS.',
      workedWithChildren: 'No',
      startDate: '2013-06-01',
      endDate: '2013-08-01'
    },
    n99sp: {
      id: 'n99sp',
      category: 'job',
      role: 'Graduate teaching assistant',
      org: 'Creighton University',
      type: 'Full time',
      description: 'Taught the lab sections of General Physics 1 & General Physics 2. Assessed and graded the lab journals and exams. Guided students to solve physics problems on their own.',
      workedWithChildren: 'Yes',
      startDate: '2013-08-01',
      endDate: '2016-11-01'
    },
    na7w4: {
      id: 'na7w4',
      category: 'job',
      role: 'Resident assistant (winter vacation)',
      org: 'Strathclyde University',
      type: 'Full time',
      description: 'Assisted residents by answering their queries and resolving issues during the winter break at the Andrew Ure Hall.',
      workedWithChildren: 'No',
      startDate: '2016-12-01',
      endDate: '2017-01-01'
    },
    naz06: {
      id: 'naz06',
      category: 'job',
      role: 'Private tutor',
      org: 'Tutorful',
      type: 'Part time',
      description: 'Taught Mathematics and Physics content covered in the Scottish National 5, the Higher and the Advanced Higher curricula. Assessed, graded and tracked individual’s progress in the above-mentioned subjects. Guided students to perform better in the exam by offering them mock exams and giving adequate scientific feedback.',
      workedWithChildren: 'Yes',
      startDate: '2017-09-01',
      endDate: 'now'
    }
  },
  unpaidExperienceDisclose: 'No',
  unpaidExperience: {}
}
