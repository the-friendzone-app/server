'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = require('../index.js');
const Meetup = require('../models/meetup');
const User = require('../models/user');

const { meetups } = require('../seed/meetups');

const { TEST_DATABASE_URL } = require('../config');
const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

describe('The Friend Zone meetups Router', function () { 
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
        Meetup.deleteMany(),
        User.deleteMany(),
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Meetup.insertMany(meetups),
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return Promise.all([
      Meetup.deleteMany(),
      User.deleteMany(),
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /meetups', function () {
    it('should return the correct number of meetups', function () {
      return Promise.all([
        Meetup.find(),
        chai.request(app)
          .get('/meetups')
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

  describe('POST /meetups', function () {
    it('should create a new meetup when provided valid data', function () {
      const newMeetup = {
        name: 'test name',
        description: 'test description',
        location: 'test location',
        startTime: 'test start time',
        endTime: 'test end time',
        createdBy: 'user',
      };
      let body;
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.keys('id', 'name', 'createdAt', 'updatedAt', 'attendees', 'createdBy', 'description', 'endTime', 'location', 'startTime');
          return Meetup.findOne({ _id: body.id });
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.name).to.equal(data.name);
          expect(body.location).to.equal(data.location);
          expect(body.description).to.equal(data.description);
          expect(body.startTime).to.equal(data.startTime);
          expect(body.endTime).to.equal(data.endTime);
          expect(body.createdBy).to.equal(data.createdBy);
          expect(new Date(body.createdAt)).to.eql(data.createdAt);
          expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should return an error when missing the "name" field', function () {
      const newMeetup = {
        name: null,
        description: 'test description',
        location: 'test location',
        startTime: 'test start time',
        endTime: 'test end time',
        createdBy: 'user',
      };
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `name` in request body');
        });
    });

    it('should return an error when missing the "location" field', function () {
      const newMeetup = {
        name: 'test name',
        location: null,
        description: 'test description',
        startTime: 'test start time',
        endTime: 'test end time',
        createdBy: 'user',
      };
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `location` in request body');
        });
    });

    it('should return an error when missing the "description" field', function () {
      const newMeetup = {
        name: 'test name',
        location: 'test location',
        description: null,
        startTime: 'test start time',
        endTime: 'test end time',
        createdBy: 'user',
      };
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `description` in request body');
        });
    });

    it('should return an error when missing the "startTime" field', function () {
      const newMeetup = {
        name: 'test name',
        location: 'test location',
        description: 'test description',
        startTime: null,
        endTime: 'test end time',
        createdBy: 'user',
      };
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `startTime` in request body');
        });
    });

    it('should return an error when missing the "endTime" field', function () {
      const newMeetup = {
        name: 'test name',
        location: 'test location',
        description: 'test description',
        startTime: 'test start time',
        endTime: null,
        createdBy: 'user',
      };
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `endTime` in request body');
        });
    });

    it('should return an error when missing the "createdBy" field', function () {
      const newMeetup = {
        name: 'test name',
        location: 'test location',
        description: 'test description',
        startTime: 'test start time',
        endTime: 'test end time',
        createdBy: null,
      };
      return chai.request(app)
        .post('/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(newMeetup)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `createdBy` in request body');
        });
    });

  });

});