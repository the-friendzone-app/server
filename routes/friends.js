'use strict';

const express = require('express');
const passport = require('passport');

const Friendship = require('../models/friendship');


const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {
    session: false,
    failWithError: true
});
router.use(jwtAuth);

router.get('/friends-list', jwtAuth, (req,res,next)=> {
Friendship.find({
    $and: [
        { $or: [{ user_id1: req.user.id }, { user_id2: req.user.id }] },
        { approved: true }
    ]
})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        next(err);
    })
});
module.exports = router;