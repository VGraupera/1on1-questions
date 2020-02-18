const assert = require('assert');

const questions = require('./');

const questionProps = Object.keys(questions[1]);

// making sure that the shape of the question object didn't change between patch and minors
assert.deepEqual(questionProps, [ 'id', 'question', 'category', 'created_at', 'updated_at' ])
