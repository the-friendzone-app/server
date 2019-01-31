'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../index');
const User = require('../models/user');
const Chat = require('../models/chat');
const Schat = require('../models/schat');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);

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
    'friended': [
      {
        '_id': '333333333333333333333302',
        'chatroom': '433333333333333333333301'
      }
    ],
    'suggested': [
      {
        '_id': '333333333333333333333302',
        'chatroom': '533333333333333333333301',
      },
      {
        '_id': '333333333333333333333303',
        'chatroom': '533333333333333333333303',
      }
    ]
  },
  {
    '_id': '333333333333333333333302',
    'username': 'frodo',
    'password': '$2a$10$LbiweBXBNRqH6hvrO5Zgl.8lnwnSD6.nGqrWUcs0LuzZ.NTwN2j4u',
    'profile': {
      selfType: 'talker',
      preferenceType: 'both'
    },
    'verified': false,
    'introQuizCompleted': false,
    'hashedUsername': 'Tiny-Socks70004',
    'userVerificationCode': '9sdsadsa',
    'friended': [
      {
        '_id': '333333333333333333333301',
        'chatroom': '433333333333333333333301'
      },
      {
        '_id': '333333333333333333333303',
        'chatroom': '433333333333333333333302'
      }
    ],
    'suggested': [
      {
        '_id': '333333333333333333333301',
        'chatroom': '533333333333333333333301',
      },
      {
        '_id': '333333333333333333333303',
        'chatroom': '533333333333333333333303',
      }
    ]
  },
  {
    '_id': '333333333333333333333303',
    'username': 'gollum',
    'password': '$2a$10$LbiweBXBNRqH6hvrO5Zgl.8lnwnSD6.nGqrWUcs0LuzZ.NTwN2j4u',
    'profile': {
      selfType: 'listener',
      preferenceType: 'talker'
    },
    'verified': false,
    'introQuizCompleted': false,
    'hashedUsername': 'Clever-Dolphin84559',
    'userVerificationCode': '9sdsadsa',
    'friended': [
      {
        '_id': '333333333333333333333302',
        'chatroom': '433333333333333333333302'
      }
    ],
    'suggested': [
      {
        '_id': '333333333333333333333302',
        'chatroom': '533333333333333333333302',
      },
      {
        '_id': '333333333333333333333301',
        'chatroom': '533333333333333333333303',
      }
    ]
  }
];

const chat = [
  {
    '_id': '433333333333333333333301',
    'friended': ['333333333333333333333301', '333333333333333333333302'],
    'messages': [
      {
        'room': '433333333333333333333301',
        'handle': 'Tiny-Socks70004',
        'message': 'Hi Hello how are you?'
      }
    ]
  },
  {
    '_id': '433333333333333333333302',
    'friended': ['333333333333333333333302', '333333333333333333333303'],
    'messages': [
      {
        'room': '433333333333333333333302',
        'handle': 'Sophisticated-Crumpet51261',
        'message': 'Hi Hello how are you?'
      }
    ]
  }
];

const schat = [
  {
    '_id': '533333333333333333333301',
    'suggested': ['333333333333333333333301', '333333333333333333333302'],
    'messages': [
      {
        'room': '533333333333333333333301',
        'handle': 'Tiny-Socks70004',
        'message': 'Hi Hello how are you?'
      }
    ]
  },
  {
    '_id': '533333333333333333333302',
    'suggested': ['333333333333333333333302', '333333333333333333333303'],
    'messages': [
      {
        'room': '533333333333333333333302',
        'handle': 'Sophisticated-Crumpet51261',
        'message': 'Hi Hello how are you?'
      }
    ]
  },
  {
    '_id': '533333333333333333333303',
    'suggested': ['333333333333333333333301', '333333333333333333333303'],
    'messages': [
      {
        'room': '533333333333333333333303',
        'handle': 'Clever-Dolphin84559',
        'message': 'Hi Hello how are you?'
      }
    ]
  }
];

describe('friends, chat and ignore endpoints', function () {
  let user;
  let auth;
  let user2;
  let auth2;
  let user3;
  let auth3;
  let chat;

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  after(function () {
    return mongoose.disconnect();
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Chat.insertMany(chat),
      Schat.insertMany(schat)
    ])
      .then(([users, chat]) => {
        chat = chat[0];
        user = users.find(user => user.username === 'samwise');
        auth = jwt.sign({ user: { username: user.username, id: user._id } }, JWT_SECRET, { subject: user.username });
        user2 = users.find(user => user.username === 'frodo');
        auth2 = jwt.sign({ user: { username: user2.username, id: user2._id } }, JWT_SECRET, { subject: user2.username });
        user3 = users.find(user => user.username === 'gollum');
        auth3 = jwt.sign({ user: { username: user3.username, id: user3._id } }, JWT_SECRET, { subject: user3.username });
      });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  describe('/friends/', function () {
    describe('GET /friends/friended/:id', function () {

      it('no access if no token', function () {
        return chai.request(app)
          .get(`/friends/friended/${user._id}`)
          .then(res => {
            expect(res).to.have.status(401);
          });
      });
      it('no access if invalid token', function () {
        const auth = jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          'AISJDOIASJHDIOSA',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );
        return chai
          .request(app)
          .get(`/friends/friended/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(401);
          });
      });
      it('should return friended friends including chatroom,username and hashedusername', function () {
        return chai
          .request(app)
          .get(`/friends/friended/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body.friended).to.be.an('array');
            res.body.friended.forEach(friend => {
              expect(friend).to.include.all.keys(
                '_id',
                'chatroom'
              );
              expect(friend._id).to.be.an('object');
              expect(friend._id).to.include.all.keys(
                '_id',
                'username',
                'hashedUsername'
              );
            });
          });
      });
    });
    describe('DELETE /friends/friended/:userId/:id', function () {
      it('should delete a chatroom', function () {
        // console.log(user._id);
        return chai
          .request(app)
          .delete(`/friends/friended/${user._id}/${user.friended[0].chatroom}`)
          .set('Authorization', `Bearer ${auth}`)
          .then(res => {
            expect(res).to.have.status(200);
            return Chat.findOne({ _id: user.friended[0].chatroom });
          })
          .then(chat => {
            expect(chat).to.be.a('null');
          });
      });
    });
    describe('GET /friends/schat/:id', function () {
      it('retrieve all schats', function () {
        return chai
          .request(app)
          .get(`/friends/schat/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body.suggested).to.be.an('array');
            res.body.suggested.forEach(suggest => {
              expect(suggest).to.include.all.keys(
                '_id',
                'chatroom'
              );
              expect(suggest._id).to.be.an('object');
              expect(suggest._id).to.include.all.keys(
                '_id',
                'username',
                'hashedUsername'
              );
            });
          });
      });
    });
    describe('PUT /suggested/:id', function () {
      it('suggested should match', function () {
        return chai
          .request(app)
          .put(`/friends/suggested/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(204);
            return User.findOne({ _id: user._id });
          })
          .then((user) => {
            expect(user.suggested[0]._id).to.eql(user2._id);
          });
      });
      it('hits user already suggested', function () {
        return chai
          .request(app)
          .put(`/friends/suggested/${user2._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(204);
            return User.findOne({ _id: user2._id });
          })
          .then((_user) => {
            expect(_user.suggested[0]._id).to.eql(user._id);
          });
      });
    });
    describe('PUT /addfriend/', function () {
      it('should add friends to each other', function () {
        return chai
          .request(app)
          .put(`/friends/addfriend/${user._id}/${user3._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then(res => {
            expect(res).to.have.status(204);
            return User.findOne({ _id: user._id });
          })
          .then(_user => {
            expect(_user.sentRequest).to.include(user3._id);
            return User.findOne({ _id: user3._id });
          })
          .then(_user => {
            expect(_user.recievedRequest).to.include(user._id);
          });
      });
      it('should console log user is already friend', function () {
        it('should add friends to each other', function () {
          return chai
            .request(app)
            .put(`/friends/addfriend/${user._id}/${user2._id}`)
            .set('Authorization', `Bearer ${auth}`)
            .then(res => {
              expect(res).to.have.status(204);
            })
            .then(_user => {
              return User.findOne({ _id: user2._id });
            })
            .then(_user => {
              expect(_user.friended).to.include(user._id);
            });
        });

      });
    });
  });

  describe('/ignore', function () {
    describe('PUT /ignore/:id', function () {
      it('no access if no token', function () {
        return chai.request(app)
          .get(`/ignore/${user._id}`)
          .then(res => {
            expect(res).to.have.status(401);
          });
      });
      it('no access if invalid token', function () {
        const auth = jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          'AISJDOIASJHDIOSA',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );
        return chai
          .request(app)
          .get(`/ignore/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(401);
          });
      });
      it('Should add ignored user to user', function () {
        const body = {
          ignoredUser: user2._id
        };
        return chai
          .request(app)
          .put(`/ignore/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .send(body)
          .then(res => {
            expect(res).to.have.status(204);
            return User.findOne({ _id: user._id });
          })
          .then(_user => {
            expect(_user.ignored).include(user2._id);
          });
      });
    });
  });
  describe('/messages', function () {
    describe('GET/suggested/:id', function () {
      it('no access if no token', function () {
        return chai.request(app)
          .get(`/messages/suggested/${user._id}`)
          .then(res => {
            expect(res).to.have.status(401);
          });
      });
      it('no access if invalid token', function () {
        const auth = jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          'AISJDOIASJHDIOSA',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );
        return chai
          .request(app)
          .get(`/messages/suggested/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(401);
          });
      });
      it('should give an error when user is not in that chat', function () {
        const token = jwt.sign(
          {
            user: {
              username: user.username,
              email: user.email,
              id: '000000000000000000000111'
            },
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: user.username,
            expiresIn: '7d'
          }
        );
        return chai
          .request(app)
          .get(`/api/messages/${chat._id}`)
          .set('Authorization', `Bearer ${token}`)
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).to.equal('You do not have access to this conversation');
          });
      });
    });
    describe('PUT/suggested/:id', function () {

    });
    describe('GET/:id', function () {
      it('no access if no token', function () {
        return chai.request(app)
          .get(`/messages/${user._id}`)
          .then(res => {
            expect(res).to.have.status(401);
          });
      });
      it('no access if invalid token', function () {
        const auth = jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          'AISJDOIASJHDIOSA',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );
        return chai
          .request(app)
          .get(`/messages/${user._id}`)
          .set('Authorization', `Bearer ${auth}`)
          .then((res) => {
            expect(res).to.have.status(401);
          });
      });
    });
    describe('GET/:id', function () {
    });
  });
});