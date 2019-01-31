'use strict';

const meetups = [
  {
    _id: '100000000000000000000001',
    name: 'Test meetup name 1',
    location: 'Test location 1',
    description: 'Test description 1',
    startTime: '2019-01-28T05:00:00.000Z',
    endTime: '2019-01-28T09:30:00.000Z',
    createdBy: 'example',
  },
  {
    _id: '100000000000000000000002',
    name: 'Test meetup name 2',
    location: 'Test location 2',
    description: 'Test description 2',
    startTime: '2019-01-28T05:00:00.000Z',
    endTime: '2019-01-28T09:30:00.000Z',
    createdBy: 'example',
  },
];

const users = [
  {
    _id: '000000000000000000000001',
    username: 'example',
    password: '$2a$10$XaJlI7ja3uNVmJzilSdZM.lBrJrJTin8sP6EgTcE/9y46KTIpOfEy'
  }
];

const meetupAttendence = [
  {
    username: 'test',
    meetupId: '5c473d619c530431c49b9999'
  },
  {
    username: 'test',
    meetupId: '5c473d619c530431c49b9992'
  },
  {
    username: 'test1',
    meetupId: '5c473d619c530431c49b9999'
  },
];

const userLocation = [
  {
    userId: '5c5100cd55ae8e4eb0a6dbd6',
    latitude: '34.0609876',
    location: 'Koreatown, Los Angeles, CA, USA',
    longitude: '-118.3023579',
  },
  {
    latitude: '21.285002',
    location: 'Waikīkī, HI 96815, USA',
    longitude: '-157.835698',
    userId: '5c48919e567cee6edc5bef00',
  }
];

module.exports = { meetups, users, meetupAttendence, userLocation };