'use strict';

const questions = [
    {
        questionText: '1What would you do if your friend lied to you?',
        option1: 'option1',
        option2: 'option2',
        option3: 'option3',
        category: 'intro',
        active: true
      
    },
    {
        questionText: '2What would you do if your friend hit you',
        option1: 'option1',
        option2: 'option2',
        option3: 'option3',
        category: 'intro',
        active: true
       
    },
    {
        questionText: '3What would you do if your friend stole from you',
        option1: 'option1',
        option2: 'option2',
        option3: 'option3',
        category: 'intro',
        active: true
        
    },
    {
        questionText: 'What would you do if your friend stole from you?',
        options: [
            {
                text: 'I\'d confront them about it',
                pros: '4pro of option number 1',
                cons: '4con of option number 1'
            },
            {
                text: 'I\'d plan a time to steal from them to make it even',
                pros: '4pro of option number 2',
                cons: '4con of option number 2'
            },
            {
                text: 'I\'d cut them out of my life completely.',
                pros: '4pro of option number 3',
                cons: '4con of option number 3'
            },
            {
                text: 'I would call the Police',
                pros: '4pro of option number 3',
                cons: '4con of option number 3'
            },
            {
                text: 'I would put them on blast on social media',
                pros: '4pro of option number 3',
                cons: '4con of option number 3'
            },
           
        ],
        category: 'mvp1',
        active: true
    },
    {
        questionText: 'What would you do if you and your friend had plans, and the canceled on you last minute?',
        options: [
            {
                text: '5option number 1',
                pros: '5pro of option number 1',
                cons: '5con of option number 1'
            },
            {
                text: '5option number 2',
                pros: '5pro of option number 2',
                cons: '5con of option number 2'
            },
            {
                text: '5option number 3',
                pros: '5pro of option number 3',
                cons: '5con of option number 3'
            }
        ],
        category: 'mvp2',
        active: true
    },
    {
        questionText: 'What would you do if your friend told you they were depressed?',
        options: [
            {
                text: '6option number 1',
                pros: '6pro of option number 1',
                cons: '6con of option number 1'
            },
            {
                text: '6option number 2',
                pros: '6pro of option number 2',
                cons: '6con of option number 2'
            },
            {
                text: '6option number 3',
                pros: '6pro of option number 3',
                cons: '6con of option number 3'
            }
        ],
        category: 'mvp3',
        active: true
    },
    {
        questionText: 'InactiveQuestion Test',
        options: [
            {
                text: '7option number 1',
                pros: '7pro of option number 1',
                cons: '7con of option number 1'
            },
            {
                text: '7option number 2',
                pros: '7pro of option number 2',
                cons: '7con of option number 2'
            },
            {
                text: '7option number 3',
                pros: '7pro of option number 3',
                cons: '7con of option number 3'
            }
        ],
        category: 'mvp4',
        active: false
    },
];

module.exports = {questions};