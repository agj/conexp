
const test = require('blue-tape');

const conexp = require('../sync');
const functions = require('../functions');
const { func, metaFunc } = conexp;


const add = func((a, b) => [a + b]);
const subtract = func((a, b) => [a - b]);
const multiply = func((a, b) => [a * b]);
const divide = func((a, b) => [a / b]);

const uppercase = func(a => [a.toUpperCase()]);


require('./parsing');
require('./functions');

