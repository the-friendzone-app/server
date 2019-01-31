'use strict';

const express = require('express');
const passport = require('passport');

const Questions = require('../models/question');
const Quiz = require('../models/quiz');
const User = require('../models/user');


const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});

router.use(jwtAuth);

// Fetch Intro Quiz
router.get('/intro-quiz', jwtAuth, (req, res, next) => {
  Quiz.find({
    category: 'intro',
    active: true
  })
    .then(results => {
      res.json({
        questions: results,
        answered: req.user.introQuizQuestions
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/user-answered/:questionId/:answer', jwtAuth, (req, res, next) => {

  Quiz.findOne({ _id: req.params.questionId })
    .then((result) => {
      if (req.params.answer === result.trapdoor) {
        return User.findOneAndUpdate({ _id: req.user._id }, { '$set': { 'marked': true, 'password': 'generator-chipanzee-party-arms' } }, { new: true })
          .then(user => {
            user.introQuizQuestions.push({
              questionID: req.params.questionId,
              userAnswer: req.params.answer
            });
            return user.save();
          })
          .then((newUser) => res.send(newUser.introQuizQuestions));
      } else {
        return User.findOne({
          _id: req.user._id
        })
          .then(user => {
            user.introQuizQuestions.push({
              questionID: req.params.questionId,
              userAnswer: req.params.answer
            });
            return user.save();
          })
          .then((newUser) => res.send(newUser.introQuizQuestions));
      }
    })
    .catch(err => {
      console.error(err);
      next(err);
    });

});


//Fetch Dynamic personality-poll categories
router.get('/personality-polls/:category', jwtAuth, (req, res, next) => {
    
  Questions.findOne({category: req.params.category})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//get all active poll questions
router.get('/personality-polls', jwtAuth, (req, res, next) => {
  Questions.find({
    active: true
  })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/feedback', jwtAuth, (req, res, next) => {

  User.findOneAndUpdate({ _id: req.user._id }, { '$set': { 'introQuizCompleted': true } }, { new: true })
    .then(user => {
      res.json(user);
      return user.save();
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
  
});


// planned for V2
//   router.get('/send-verification', jwtAuth, (req, res, next) => {
//     let { id } = req.params;
//       User.findById(id)
//           .then(user => {
//               res.json({
//                   verificationCode: user.verificationCode,
      
//               });
//           })
//           .catch(err => {
//               next(err);
//           })
//     });
    

// router.post('/', (req, res, next) => {
//     let array2 = [];
//     Object.keys(object).forEach(function(key,index){
//         let tempObj = {qID = object.key[0]}
//     });
// [{q1: "123,val"}{ q2: "456,val2"}]
//     const { IntroQuizValues } = req.body;
//     for(let i=0; i<)
//     const arr = IntroQuizValues.split("|");
//     const questionId = arr[0];
//     const userAnswer = arr[1];
//     const requiredInfo = ['questionId', 'userAnswer'];
//     const missingInfo = requiredInfo.find(field => !(field in req.body));
//     let currentUserQuestion, correctAnswer;
//     let err;
//     if (missingInfo) {
//       err = new Error(`${missingInfo} required in body`);
//       err.location = missingInfo;
//       err.code = 400;
//       throw err;
//     }
//    Quiz.findById(questionId)
//       .then(question => {
//         if (questionId !== id) {
//           const err = new Error('Question ids do not match');
//           err.code = 422;
//           throw err;
//         }
//         // return user.postAnswer(correctAnswer);
//       })
//       .then(() => {
//         res.json({

//         });
//       })
//       .catch(next);


module.exports = router;