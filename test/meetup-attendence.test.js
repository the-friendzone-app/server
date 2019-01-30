'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = require('../index.js');
const MeetupAttendence = require('../models/meetup-attendence');
const User = require('../models/user');

const { meetupAttendence } = require('../seed/meetups');

const { TEST_DATABASE_URL } = require('../config');
const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

describe('The Friend Zone meetup-attendence Router', function () { 
  let users = [{
    _id: '000000000000000000000001',
    username: 'example',
    password: '$2a$10$XaJlI7ja3uNVmJzilSdZM.lBrJrJTin8sP6EgTcE/9y46KTIpOfEy'
  }];

  let user;
  let token;

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true })
      .then(() => Promise.all([
        MeetupAttendence.deleteMany(),
        User.deleteMany(),
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      MeetupAttendence.insertMany(meetupAttendence),
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return Promise.all([
      MeetupAttendence.deleteMany(),
      User.deleteMany(),
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /meetup-attendence', function () {
    it('should return the correct number of meetup-attendences', function () {
      return Promise.all([
        MeetupAttendence.find(),
        chai.request(app)
          .get('/meetup-attendence')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  describe('POST /meetup-attendence', function () {
    it('should post the username and meetupId that the user has joined when provided valid data', function () {
      const newMeetupAttendence = { username: 'test', meetupId: '5c473d619c530431c49b9992' };
      let body;
      return chai.request(app)
        .post('/meetup-attendence')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetupAttendence)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.keys('username', 'meetupId', 'updatedAt', 'createdAt', 'id');
          expect(body.username).to.be.a('string');
          expect(body.meetupId).to.be.a('string');
          expect(body.updatedAt).to.be.a('string');
          expect(body.createdAt).to.be.a('string');
          return MeetupAttendence.findOne({ _id: body.id });
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.username).to.equal(data.username);
          expect(body.meetupId).to.equal(data.meetupId);
          expect(new Date(body.createdAt)).to.eql(data.createdAt);
          expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should return an error when missing the "username" field', function () {
      const newMeetupAttendence = { username: '', meetupId: '5c473d619c530431c49b9992' };
      return chai.request(app)
        .post('/meetup-attendence')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetupAttendence)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `username` in request body');
        });
    });

    it('should return an error when missing the "meetupId" field', function () {
      const newMeetupAttendence = { username: 'test', meetupId: '' };
      return chai.request(app)
        .post('/meetup-attendence')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetupAttendence)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `meetupId` in request body');
        });
    });

  });
});