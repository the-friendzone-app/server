'use strict';
const users = [
  {
    '_id': '333333333333333333333301',
    'username': 'samwise',
    'password': '$2a$10$LbiweBXBNRqH6hvrO5Zgl.8lnwnSD6.nGqrWUcs0LuzZ.NTwN2j4u',
    'profile': {
      selfType: 'both',
      preferenceType: 'both'
    },
    'verified': false,
    'introQuizCompleted': false,
    'hashedUsername': 'Sophisticated-Crumpet51261',
    'userVerificationCode': '4535odjt',
    'friends': [
      '333333333333333333333302'
    ],
    'friended': [
      {
        '_id': '333333333333333333333302',
        'chatroom': '433333333333333333333301'
      }
    ]
  },
  {
    '_id': '333333333333333333333302',
    'username': 'frodo',
    'password': '$2a$10$LbiweBXBNRqH6hvrO5Zgl.8lnwnSD6.nGqrWUcs0LuzZ.NTwN2j4u',
    'profile': {
      selfType: 'talker',
      preferenceType: 'talker'
    },
    'verified': false,
    'introQuizCompleted': false,
    'hashedUsername': 'Tiny-Socks70004',
    'userVerificationCode': '9sdsadsa',
    'friends': [
      '333333333333333333333301',
      '333333333333333333333303'
    ],
    'friended': [
      {
        '_id': '333333333333333333333301',
        'chatroom': '433333333333333333333302'
      },
      {
        '_id': '333333333333333333333303',
        'chatroom': '433333333333333333333303'
      }
    ]
  },
  {
    '_id': '333333333333333333333303',
    'username': 'gollum',
    'password': '$2a$10$LbiweBXBNRqH6hvrO5Zgl.8lnwnSD6.nGqrWUcs0LuzZ.NTwN2j4u',
    'profile': {
      selfType: 'listener',
      preferenceType: 'listener'
    },
    'verified': false,
    'introQuizCompleted': false,
    'hashedUsername': 'Clever-Dolphin84559',
    'userVerificationCode': '9sdsadsa',
    'friends': [
      '333333333333333333333302'
    ],
    'friended': [
      {
        '_id': '333333333333333333333302',
        'chatroom': '433333333333333333333304'
      }
    ]
  }
];

const chat = [
  {
    '_id': '433333333333333333333301',
    'friended': '333333333333333333333302',
    'messages': [
      {
        'room': '433333333333333333333301',
        'handle': 'samwise',
        'message': 'Hi Hello how are you?'
      }
    ]
  },
  {
    '_id': '433333333333333333333302',
    'friended': '333333333333333333333301',
    'messages': [
      {
        'room': '433333333333333333333302',
        'handle': 'frodo',
        'message': 'Hi Hello how are you?'
      }
    ]
  },
  {
    '_id': '433333333333333333333303',
    'friended': '333333333333333333333303',
    'messages': [
      {
        'room': '433333333333333333333303',
        'handle': 'frodo',
        'message': 'Hi Hello how are you?'
      }
    ]
  },
  {
    '_id': '433333333333333333333304',
    'friended': '333333333333333333333302',
    'messages': [
      {
        'room': '433333333333333333333304',
        'handle': 'gollum',
        'message': 'Hi Hello how are you?'
      }
    ]
  }

];

const questions = [
  {
    question: '1What would you do if your friend lied to you?',
    options: [
      {
        text: '1option number 1',
        pros: '1pro of option number 1',
        cons: '1con of option number 1'
      },
      {
        text: '1option number 2',
        pros: '1pro of option number 2',
        cons: '1con of option number 2'
      },
      {
        text: '1option number 3',
        pros: '1pro of option number 3',
        cons: '1con of option number 3'
      }
    ],
    category: 'intro',
    active: true
  },
  {
    question: '2What would you do if your friend hit you',
    options: [
      {
        text: '2option number 1',
        pros: '2pro of option number 1',
        cons: '2con of option number 1'
      },
      {
        text: '2option number 2',
        pros: '2pro of option number 2',
        cons: '2con of option number 2'
      },
      {
        text: '2option number 3',
        pros: '2pro of option number 3',
        cons: '2con of option number 3'
      }
    ],
    category: 'intro',
    active: true
  },
  {
    question: '3What would you do if your friend stole from you',
    options: [
      {
        text: '3option number 1',
        pros: '3pro of option number 1',
        cons: '3con of option number 1'
      },
      {
        text: '3option number 2',
        pros: '3pro of option number 2',
        cons: '3con of option number 2'
      },
      {
        text: '3option number 3',
        pros: '3pro of option number 3',
        cons: '3con of option number 3'
      }
    ],
    category: 'intro',
    active: true
  },
  {
    question: '4What would you do if your friend tried to kiss you',
    options: [
      {
        text: '4option number 1',
        pros: '4pro of option number 1',
        cons: '4con of option number 1'
      },
      {
        text: '4option number 2',
        pros: '4pro of option number 2',
        cons: '4con of option number 2'
      },
      {
        text: '4option number 3',
        pros: '4pro of option number 3',
        cons: '4con of option number 3'
      }
    ],
    category: 'mvp1',
    active: true
  },
  {
    question: '5What would you do if your friend bought you an expensive gift',
    options: [
      {
        text: '5option number 1',
        pros: '5pro of option number 1',
        cons: '5con of option number 1'
      },
      {
        text: '5option number 2',
        pros: '5pro of option number 2',
        cons: '5con of option number 2'
      },
      {
        text: '5option number 3',
        pros: '5pro of option number 3',
        cons: '5con of option number 3'
      }
    ],
    category: 'mvp2',
    active: true
  },
  {
    question: '6What would you do if your friend told you they were gay',
    options: [
      {
        text: '6option number 1',
        pros: '6pro of option number 1',
        cons: '6con of option number 1'
      },
      {
        text: '6option number 2',
        pros: '6pro of option number 2',
        cons: '6con of option number 2'
      },
      {
        text: '6option number 3',
        pros: '6pro of option number 3',
        cons: '6con of option number 3'
      }
    ],
    category: 'mvp3',
    active: true
  },
  {
    question: 'InactiveQuestion Test',
    options: [
      {
        text: '7option number 1',
        pros: '7pro of option number 1',
        cons: '7con of option number 1'
      },
      {
        text: '7option number 2',
        pros: '7pro of option number 2',
        cons: '7con of option number 2'
      },
      {
        text: '7option number 3',
        pros: '7pro of option number 3',
        cons: '7con of option number 3'
      }
    ],
    category: 'mvp4',
    active: false
  },
];

module.exports = { questions, users, chat };