'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app= require('../index.js');

const Questions = require('../models/question');
const Quiz = require('../models/quiz');
const User = require('../models/user');

const { questions } = require('../seed/questionsSeed');
const { quizQuestions } = require('../seed/quizSeed');

const {TEST_DATABASE_URL} = require('../config');
const {JWT_SECRET} = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

describe('The Friend Zone Questions Router', function () {
  let users = [{
    _id:'000000000000000000000001',
    username: 'example',
    email: 'example@example.com',
    password: '$2a$10$XaJlI7ja3uNVmJzilSdZM.lBrJrJTin8sP6EgTcE/9y46KTIpOfEy'
  }];

  let user;
  let token;

  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => Promise.all([
        Questions.deleteMany(),
        Quiz.deleteMany(),
        User.deleteMany(),
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Quiz.insertMany(quizQuestions),
      Questions.insertMany(questions),
    ])
      .then(([users]) => {
        user=users[0];
        token = jwt.sign({ user }, JWT_SECRET, {subject: user.username});
      });
  });

  afterEach(function () {
    return Promise.all([
      Questions.deleteMany(),
      Quiz.deleteMany(),
      User.deleteMany(),
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /questions routes', function(){
    it('returns the intro quiz /questions/intro-quiz', function(){
      return Promise.all([
        Quiz.find({category: 'intro', active: true}),
        chai.request(app).get('/questions/intro-quiz').set('Authorization', `Bearer ${token}`)
      ])
        .then(([data,res])=> {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.own.property('questions');
          expect(res.body).to.have.own.property('answered');
        });
    });

    it('submits current answer and returns the next intro question /user-answered/:questionId/:answer', function(){
      let questionId = '500000000000000000000001'; 
      const modifiedAnswer = 'I would close the chat'.replace(/ /gi, '%20');
      
      return Promise.all([
        Quiz.findOne({_id: questionId}),
        chai.request(app).get(`/questions/user-answered/${questionId}/${modifiedAnswer}`).set('Authorization', `Bearer ${token}`)
      ])
        .then(([data,res])=> {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body[0]).to.have.own.property('questionID');
          expect(res.body[0]).to.have.own.property('userAnswer');
        });
    });

    //needs work
    it('submits current answer, evaluates answer (Good), does not mark user /user-answered/:questionId/:answer', function(){
      let questionId = '500000000000000000000001';
      let userId = '000000000000000000000001'; 
      let chaiRes;
      const modifiedAnswer = 'I would close the chat'.replace(/ /gi, '%20');
      
      return chai.request(app).get(`/questions/user-answered/${questionId}/${modifiedAnswer}`).set('Authorization', `Bearer ${token}`)
        .then((res) => {
          chaiRes = res;
          return User.findOne({_id: userId });
        })
        .then((data)=> {
          expect(chaiRes).to.have.status(200);
          expect(chaiRes).to.be.json;
          expect(chaiRes.body).to.be.a('array');
          expect(chaiRes.body[0]).to.have.own.property('questionID');
          expect(chaiRes.body[0]).to.have.own.property('userAnswer');
          expect(data.marked).to.equal(false);
        });
    });

    //needs work
    it('submits current answer evaluates answer (Bad), and marks user /user-answered/:questionId/:answer', function(){
      let questionId = '500000000000000000000001';
      let userId = '000000000000000000000001'; 
      let chaiRes;
      const modifiedAnswer = 'I would tell them to kill themselves'.replace(/ /gi, '%20');
      
      return chai.request(app).get(`/questions/user-answered/${questionId}/${modifiedAnswer}`).set('Authorization', `Bearer ${token}`)
        .then((res) => {
          chaiRes = res;
          return User.findOne({_id: userId });
        })
        .then((data)=> {
          expect(chaiRes).to.have.status(200);
          expect(chaiRes).to.be.json;
          expect(chaiRes.body).to.be.a('array');
          expect(chaiRes.body[0]).to.have.own.property('questionID');
          expect(chaiRes.body[0]).to.have.own.property('userAnswer');
          expect(data.marked).to.equal(true);
        });
    });



    it('returns personality poll by category /personality-polls/:category', function(){
      let category = 'mvp1';
      
      return Promise.all([
        Questions.findOne({category}),
        chai.request(app).get(`/questions/personality-polls/${category}`).set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res])=> {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.own.property('questionText', 'What would you do if your friend stole from you?');
          expect(res.body).to.have.own.property('category', category);
          expect(res.body).to.have.own.property('active', true);
        });
    });

    it('returns an empty response if fake category /personality-polls/:category', function(){
      let category = 'givemethequiz';
      
      return Promise.all([
        Questions.findOne({category: category}),
        chai.request(app).get(`/questions/personality-polls/${category}`).set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res])=> {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.equal(null);
        });
    });

    it('returns all active poll questions /personality-polls', function(){
  
      return Promise.all([
        Questions.find({active: true}),
        chai.request(app).get('/questions/personality-polls').set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res])=> {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(data.length);
        });
    });

    it('returns user with "introQuizCompleted" updated to true /feedback', function(){
      let userId = '000000000000000000000001'; 
      let chaiRes;
      return chai.request(app).get('/questions/feedback').set('Authorization', `Bearer ${token}`)
        .then((res) => {
          chaiRes = res;
          return User.findOne({_id: userId});
        })
        .then((data)=> {
          expect(chaiRes).to.have.status(200);
          expect(chaiRes).to.be.json;
          expect(chaiRes.body).to.be.a('object');
          expect(chaiRes.body).to.have.own.property('introQuizCompleted', true);
        });
    });

  });
}); 