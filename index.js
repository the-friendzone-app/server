'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const socket = require('socket.io');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const localStrategy = require('./passport/localStrategy');
const jwtStrategy = require('./passport/jwtStrategy');

const authRouter = require('./routes/auth');
const communityRouter = require('./routes/community');
const friendsRouter = require('./routes/friends');
const meetupsRouter = require('./routes/meetups');
const questionsRouter = require('./routes/questions');
const messagesRouter = require('./routes/messages');
const userRouter = require('./routes/user');
const meetupAttendenceRouter = require('./routes/meetup-attendence');
const userLocationRouter = require('./routes/user-location');
const eventbriteSearchRouter = require('./routes/eventbrite-search');
const eventbriteSearchCompleteRouter = require('./routes/eventbrite-search-complete');
const ignoreRouter = require('./routes/ignore');



const app = express();
const jwtAuth = passport.authenticate('jwt', { session: false });
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/auth', authRouter);
app.use('/community', communityRouter);
app.use('/friends', jwtAuth);
app.use('/friends', friendsRouter);
app.use('/meetups', meetupsRouter);
app.use('/questions', questionsRouter);
app.use('/users', userRouter);
app.use('/messages', jwtAuth);
app.use('/messages', messagesRouter);
app.use('/meetup-attendence', meetupAttendenceRouter);
app.use('/user-location', userLocationRouter);
app.use('/eventbrite-search', eventbriteSearchRouter);
app.use('/eventbrite-search-complete', eventbriteSearchCompleteRouter);
app.use('/ignore', jwtAuth);
app.use('/ignore', ignoreRouter);


// Custom 404 Not Found Error Handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: `Server Error: ${err}` });
  }
});

let server;

function runServer(port = PORT) {
  server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
  // console.log('server:', server);
  let io = socket(server);
  //getting info we recieved from client (author and mesage) and sending it to everyone else
  io.on('connection', (socket) => {
    // console.log(socket.id);
    socket.on('subscribe', chat => {
      socket.join(chat);
    });
    socket.on('CHAT', function (data) {
      io.sockets.in(data.room).emit('CHAT', data);
    });
  });
}


if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app;
