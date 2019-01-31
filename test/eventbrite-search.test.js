'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = require('../index.js');
const EventbriteSearch = require('../models/eventbrite-search');
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
        EventbriteSearch.deleteMany(),
        User.deleteMany(),
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      EventbriteSearch.insertMany(meetupAttendence),
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return Promise.all([
      EventbriteSearch.deleteMany(),
      User.deleteMany(),
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('PUT /eventbrite-search', function () {
    it('should search the eventbrite api and return an array of results', function () {
      const newSearch = { 
        latitude: '34.0609876', 
        longitude: '-118.3023579', 
        search: '', 
        searchDistance: '', 
        price: '', 
        categories: '', 
        formats: '', 
        startTime: '', 
        endTime: '' };
      let body;
      return chai.request(app)
        .put('/eventbrite-search')
        .set('Authorization', `Bearer ${token}`)
        .send(newSearch)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.keys('userId', 'events', 'updatedAt', 'createdAt', 'id');
          expect(body.userId).to.be.a('string');
          expect(body.events).to.be.a('array');
          expect(body.updatedAt).to.be.a('string');
          expect(body.createdAt).to.be.a('string');
        });
    });

    it('should return an error when missing the "latitude" field', function () {
      const newSearch = { 
        latitude: '', 
        longitude: '-118.3023579', 
        search: '', 
        searchDistance: '', 
        price: '', 
        categories: '', 
        formats: '', 
        startTime: '', 
        endTime: '' };
      return chai.request(app)
        .put('/eventbrite-search')
        .set('Authorization', `Bearer ${token}`)
        .send(newSearch)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `latitude` in request body');
        });
    });

    it('should return an error when missing the "longitude" field', function () {
      const newSearch = { 
        latitude: '34.0609876', 
        longitude: '', 
        search: '', 
        searchDistance: '', 
        price: '', 
        categories: '', 
        formats: '', 
        startTime: '', 
        endTime: '' };
      return chai.request(app)
        .put('/eventbrite-search')
        .set('Authorization', `Bearer ${token}`)
        .send(newSearch)
        .then(function (res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `longitude` in request body');
        });
    });

  });
});