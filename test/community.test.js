'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app= require('../index.js');
const Community = require('../models/community/community');
const Topic = require('../models/community/topic');
const Thread = require('../models/community/comments');
const User = require('../models/user');

const {communities, topics, comments} = require('../seed-dataCommunity');
const {users} = require('../seed/data');

const {TEST_DATABASE_URL} = require('../config');
const {JWT_SECRET} = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

describe('The Friend Zone Community Router', function () {
  let users = [{
    _id:'000000000000000000000001',
    username: 'example',
    password: '$2a$10$XaJlI7ja3uNVmJzilSdZM.lBrJrJTin8sP6EgTcE/9y46KTIpOfEy'
  }];

  let user;
  let token;

  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => Promise.all([
        Community.deleteMany(),
        Topic.deleteMany(),
        User.deleteMany(),
        Thread.deleteMany()
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Community.insertMany(communities),
      Topic.insertMany(topics),
      Thread.insertMany(comments)
    ])
      .then(([users]) => {
        user=users[0];
        token = jwt.sign({ user }, JWT_SECRET, {subject: user.username});
      });
  });

  afterEach(function () {
    return Promise.all([
      Community.deleteMany(),
      Topic.deleteMany(),
      User.deleteMany(),
      Thread.deleteMany()
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /community', function() {
    it('should return with all the current listed communities(forums)', function(){
      return Promise.all([
        Community.find({}),
        chai.request(app).get('/community').set('Authorization', `Bearer ${token}`)
      ])
        .then(function([data,res]) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

});
