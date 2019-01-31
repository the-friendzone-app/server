'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = require('../index.js');
const UserLocation = require('../models/user-location');
const User = require('../models/user');

const { userLocation } = require('../seed/meetups');

const { TEST_DATABASE_URL } = require('../config');
const { JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

describe('The Friend Zone user-location Router', function () {
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
        UserLocation.deleteMany(),
        User.deleteMany(),
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      UserLocation.insertMany(userLocation),
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return Promise.all([
      UserLocation.deleteMany(),
      User.deleteMany(),
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /user-location', function () {
    it('should return the correct user-locations', function () {
      const userId = '5c5100cd55ae8e4eb0a6dbd6';
      return Promise.all([
        UserLocation.find(),
        chai.request(app)
          .get('/user-location')
          .set('Authorization', `Bearer ${token}`)
          .send(userId)
      ])
        .then(([data, res]) => {
          console.log('res', res.body)
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          // expect(res.body).to.have.length(data.length);
        });
    });
  });

  describe('PUT /user-location', function () {
    it('should post the username and latitude that the user has joined when provided valid data', function () {
      const newUserLocation = {
        userId: 'test userId',
        latitude: 'test lat',
        location: 'test loc',
        longitude: 'test long',
      };
      let body;
      return chai.request(app)
        .put('/user-location')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserLocation)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.keys('userId', 'latitude', 'longitude', 'location', 'createdAt', 'updatedAt', 'id');
          expect(body.userId).to.be.a('string');
          expect(body.latitude).to.be.a('string');
          expect(body.longitude).to.be.a('string');
          expect(body.location).to.be.a('string');
          return UserLocation.findOne({ _id: body.id });
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.userId).to.equal(data.userId);
          expect(body.latitude).to.equal(data.latitude);
          expect(new Date(body.createdAt)).to.eql(data.createdAt);
          expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should return an error when missing the "userId" field', function () {
      const newUserLocation = {
        userId: '',
        latitude: 'test lat',
        location: 'test loc',
        longitude: 'test long',
      };
      return chai.request(app)
        .put('/user-location')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserLocation)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `userId` in request body');
        });
    });

    it('should return an error when missing the "latitude" field', function () {
      const newUserLocation = {
        userId: 'test userId',
        latitude: '',
        location: 'test loc',
        longitude: 'test long',
      };
      return chai.request(app)
        .put('/user-location')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserLocation)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `latitude` in request body');
        });
    });

    it('should return an error when missing the "location" field', function () {
      const newUserLocation = {
        userId: 'test userId',
        latitude: 'test lat',
        location: '',
        longitude: 'test long',
      };
      return chai.request(app)
        .put('/user-location')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserLocation)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `location` in request body');
        });
    });

    it('should return an error when missing the "longitude" field', function () {
      const newUserLocation = {
        userId: 'test userId',
        latitude: 'test lat',
        location: 'test location',
        longitude: '',
      };
      return chai.request(app)
        .put('/user-location')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserLocation)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `longitude` in request body');
        });
    });

  });
});