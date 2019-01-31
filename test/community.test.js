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

const {communities, topics, comments} = require('../seed/seed-dataCommunity');
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

  describe('POST with /topic routes', function() {
    it('should return an array of topics within a specifically requested community /community/topic', function (){
      const communityId= '100000000000000000000001';
      return Promise.all([
        Topic.find({community: communityId}),
        chai.request(app).post('/community/topic').set('Authorization', `Bearer ${token}`).send({communityId})
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return with an error without a specifically requested community /community/topic', function (){
      return Promise.all([
        Topic.find({}),
        chai.request(app).post('/community/topic').set('Authorization', `Bearer ${token}`)
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(data).to.be.a('array');
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.own.property('message'); 
        });
    });

    it('should create a new topic with the submitted text in the appropriate community /community/topic/post', function (){
      const newTopic = {
        community: '100000000000000000000001', 
        topicName: 'Test Topic Name',
        description: 'Test Description',
        creator: '000000000000000000000001',
        comments:[],
        tags:[]
      };
      return Promise.all([
        Topic.create(newTopic).then(()=> Topic.find({})),
        chai.request(app).post('/community/topic/post').set('Authorization', `Bearer ${token}`).send(newTopic)
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body).to.have.own.property('community', '100000000000000000000001');
          expect(res.body).to.have.own.property('topicName', 'Test Topic Name');
          expect(res.body).to.have.own.property('description', 'Test Description');
          expect(res.body).to.be.an('object');
          expect(data).to.be.an('array').with.length(4);
          expect(data.filter(topic => topic.community.toString() === '100000000000000000000001')).to.have.length(3);
        });
    });

    it('should not create a new topic without a topic name /community/topic/post', function (){
      const newTopic = {
        community: '100000000000000000000001', 
        topicName: '',
        description: 'Test Description',
        creator: '000000000000000000000001',
        comments:[],
        tags:[]
      };
      return Promise.all([
        Topic.find({}),
        chai.request(app).post('/community/topic/post').set('Authorization', `Bearer ${token}`).send(newTopic)
      ])
        .then(function([data,res]) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('message'); 
        });
    });

    it('should not create a new topic without a description /community/topic/post', function (){
      const newTopic = {
        community: '100000000000000000000001', 
        topicName: 'Test Topic Name',
        description: '',
        creator: '000000000000000000000001',
        comments:[],
        tags:[]
      };
      return Promise.all([
        Topic.find({}),
        chai.request(app).post('/community/topic/post').set('Authorization', `Bearer ${token}`).send(newTopic)
      ])
        .then(function([data,res]) {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('message'); 
          expect(data).to.be.an('array').with.length(3);
          expect(data.filter(topic => topic.topicName === 'Test Topic Name')).to.be.length(0);
        });
    });

  });
  describe('/POST /comments routes', function () {
    it('should return an array of comments within a specific topic /community/comments', function (){
      const communityId= '100000000000000000000001';
      const topicId= '200000000000000000000001';
      return Promise.all([
        Thread.find({community: communityId, 'topic': topicId}),
        chai.request(app).post('/community/comments').set('Authorization', `Bearer ${token}`).send({topicId})
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return an error without specifying topic /community/comments', function (){
      const communityId= '100000000000000000000001';
      const topicId= '200000000000000000000001';
      const brokenttopicId= '';
      return Promise.all([
        Thread.find({community: communityId, 'topic': topicId}),
        chai.request(app).post('/community/comments').set('Authorization', `Bearer ${token}`).send({brokenttopicId})
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message');
        });
    });

    it('should create a comment associated with the specific topic without replyTo /community/comments/post', function (){
      
      const topicId = '200000000000000000000001';
      const newComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: 'Test Comment',
        user: '000000000000000000000001'
      };
      
      return Promise.all([
        Thread.find({'topic': topicId}),
        chai.request(app).post('/community/comments/post').set('Authorization', `Bearer ${token}`).send(newComment)
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
        });
    });

    it('should create a comment associated with the specific topic with replyTo /community/comments/post', function (){
      
      const topicId = '200000000000000000000001';
      const newComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: 'Test Comment',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };
      
      return Promise.all([
        Thread.find({'topic': topicId}),
        chai.request(app).post('/community/comments/post').set('Authorization', `Bearer ${token}`).send(newComment)
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
        });
    });

    it('should  not create a comment without comment content /community/comments/post', function (){
      
      const topicId = '200000000000000000000001';
      const newComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: '',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };
      
      return Promise.all([
        Thread.find({'topic': topicId}),
        chai.request(app).post('/community/comments/post').set('Authorization', `Bearer ${token}`).send(newComment)
      ])
        .then(function([data,res]) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.own.property('message');
        });
    });
  });

  describe('/PUT /comments routes', function() {
    it('should update comment with new comment content /community/comments/edit', function (){
      
      const newComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: 'test comment',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };

      const editedComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: 'newly updated test comment',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };


      return Thread.create(newComment)
        .then((result)=>{
          editedComment._id = result.id;
          return Promise.all([
            Thread.find({_id: editedComment._id}),
            chai.request(app).put('/community/comments/edit').set('Authorization', `Bearer ${token}`).send(editedComment)
          ])
            .then(function([data,res]) {
              expect(res).to.be.json;
              expect(res).to.have.status(201);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.own.property('comment','newly updated test comment');
              expect(res.body).to.have.own.property('user','000000000000000000000001');
            });
        });
    });

    it('should not update comment with no comment content and return an error /community/comments/edit', function (){
      
      const topicId = '200000000000000000000001';
      
      const newComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: 'test comment',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };

      const editedComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: '',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };


      return Thread.create(newComment)
        .then((result)=>{
          editedComment._id = result.id;
          return Promise.all([
            Thread.find({_id: editedComment._id}),
            chai.request(app).put('/community/comments/edit').set('Authorization', `Bearer ${token}`).send(editedComment)
          ])
            .then(function([data,res]) {
              expect(res).to.be.json;
              expect(res).to.have.status(400);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.own.property('message');
            });
        });
    });

    it('should replace comment with deleted comment filler /community/comments/delete', function (){
      
      const topicId = '200000000000000000000001';
      
      const newComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        comment: 'test comment',
        user: '000000000000000000000001',
        replyTo: '300000000000000000000001'
      };

      const deleteComment = {
        community: '100000000000000000000001', 
        topic: '200000000000000000000001', 
        user: '000000000000000000000000',
        replyTo: '300000000000000000000001'
      };


      return Thread.create(newComment)
        .then((result)=>{
          deleteComment._id = result.id;
          return Promise.all([
            Thread.find({_id: deleteComment._id}),
            chai.request(app).put('/community/comments/delete').set('Authorization', `Bearer ${token}`).send(deleteComment)
          ])
            .then(function([data,res]) {
              expect(res).to.be.json;
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.own.property('comment','[[  This comment has been deleted  :(  ]]');
              expect(res.body).to.have.own.property('user','000000000000000000000000');
            });
        });
    });
  });
  

});