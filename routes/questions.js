'use strict';

const express = require('express');
const passport = require('passport');

const Questions = require('../models/question');

// const jsonParser = bodyParser.json

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});

router.use(jwtAuth);
// Fetch Intro Quiz
router.get('/intro-quiz', jwtAuth, (req,res,next)=>{
    Questions.find({category: 'intro', active: true})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    })
})
//Fetch Dynamic personality-poll categories
router.get('/personality-polls/:category', jwtAuth, (req,res,next)=> {
    Questions.find({category: req.params.category})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    })
})
//get all active poll questions
router.get('/personality-polls/', jwtAuth, (req,res,next)=> {
    Questions.find({sctive: true})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    })
})
// router.post('/personality-polls')

//Post for new questions comes via seeding DB


module.exports = router;

