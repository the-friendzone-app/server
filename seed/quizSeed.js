'use strict';
const quizQuestions=[

{   
    _id: '500000000000000000000001',
    questionText: 'What would you do if someone you were chatting with triggered you?',
    option1: 'I would close the chat',
    option2: 'I would tell them I respectfully disagree',
    option3: 'I would ask them why they hold their particular opinion',
    option4: 'I would laugh it off and ignore it',
    option5: 'I would tell them to kill themselves',
    trapdoor: 'I would tell them to kill themselves',
    category: 'intro',
    active: true
},
{
    _id: '500000000000000000000002',
    questionText: 'What would you do if you went to a Friend Zone Meetup and you found one of the attendees to be attractive?',
    option1: 'I would try to get to know them better outside of the app',
    option2: 'I would ignore my feelings towards them',
    option3: 'I would find them in the app later and ask them out on a date',
    option4: 'I would keep things platonic since I found them on The Friend Zone',
    option5: 'I would avoid seeing them at any other meetup',
    trapdoor: 'I would find them in the app later and ask them out on a date',
    category: 'intro',
    active: true
   
},
{
    _id: '500000000000000000000003',
    questionText: 'What would you do if you found out private information about someone you were chatting with?',
    option1: 'Blackmail time, baby!',
    option2: 'Keep their information private and not mention it to anyone',
    option3: 'Ignore it, their business is their business',
    option4: 'Anonymously report to The Friend Zone Dev team so they they could prevent further harm',
    option5: 'Tell them what private information you found out so they could make sure it wouldn\'t leak to more people',
    trapdoor: 'Blackmail time, baby!',
    category: 'intro',
    active: true
    
},
]


module.exports = {quizQuestions};