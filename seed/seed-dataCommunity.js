'use strict';

const communities = [
  {
    _id: '100000000000000000000001',
    topics: ['200000000000000000000001', '200000000000000000000002'],
    mainTitle: 'Movies',
    description: 'Discussions around movies',
  },
  {
    _id: '100000000000000000000002',
    topics: ['200000000000000000000003'],
    mainTitle: 'Music',
    description: 'Discussions around music',
  },
];

const topics =[
  {
    _id: '200000000000000000000001',
    community: '100000000000000000000001',
    topicName: 'Horror Movies',
    creator: '333333333333333333333303',
    description: 'DISCUSSIONS ABOUT HORROR!',
    comments: ['300000000000000000000001'],
  },
  {
    _id: '200000000000000000000002',
    community: '100000000000000000000001',
    topicName: 'Action Movies',
    creator: '333333333333333333333302',
    description: 'DISCUSSIONS ABOUT ACTION!',
    comments: ['300000000000000000000002']
  },
  {
    _id: '200000000000000000000003',
    community: '100000000000000000000002',
    topicName: 'Metal',
    creator: '333333333333333333333301',
    description: 'DISCUSSIONS ABOUT METAL!',
    comments: []
  }
];

const comments =[
  {
    _id: '300000000000000000000001',
    topic: '200000000000000000000001',
    community: '100000000000000000000001',
    user: '333333333333333333333302',
    comment: 'THIS IS MY RANT ABOUT HORROR MOVIES!!!!!!!!!'
  },
  {
    _id: '300000000000000000000002',
    topic: '200000000000000000000002',
    community: '100000000000000000000001',
    user: '333333333333333333333303',
    comment: 'THIS IS MY RANT ABOUT ACTION MOVIES!!!!!!!!!'
  },
];
module.exports = {communities, topics, comments};