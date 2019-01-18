'use strict';

const communities = {
  _id: '100000000000000000000001',
  topics: ['200000000000000000000002'],
  mainTitle: 'Movies',
  description: 'Discussions around movies',
};

const topics ={
  _id: '200000000000000000000002',
  community: '100000000000000000000001',
  topicName: 'Horror Movies',
  creatorUser: '5c41024b9306a4ab74228fb3',
  description: 'DISCUSSIONS ABOUT HORROR!',
  comments: ['300000000000000000000003']
};

const comments ={
  _id: '300000000000000000000003',
  topic: '200000000000000000000002',
  community: '100000000000000000000001',
  user: '5c41024b9306a4ab74228fb3',
  comment: 'THIS IS MY RANT ABOUT MOVIES!!!!!!!!!'
};
module.exports = {communities, topics, comments};