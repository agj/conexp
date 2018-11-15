
const test = require('blue-tape');

const conexp = require('../sync');
const functions = require('../functions');
const { func, metaFunc } = conexp;
const f = require('./functions');


const add = func((a, b) => [a + b]);
const subtract = func((a, b) => [a - b]);
const multiply = func((a, b) => [a * b]);
const divide = func((a, b) => [a / b]);

const uppercase = func(a => [a.toUpperCase()]);


require('./parsing');


test("Sync: Move integers around with functions.", assert => {
	assert.plan(1);
	const evaluate = conexp({ dup: functions.dup, swap: functions.swap, drop: functions.drop });
	assert.deepEquals(
		evaluate('1 2 3 swap drop dup'),
		[1, 3, 3]);
});

test("Sync: Operate on integers.", assert => {
	assert.plan(1);
	const evaluate = conexp({ add: add, subtract: subtract, multiply: multiply, divide: divide, swap: functions.swap });
	assert.deepEquals(
		evaluate('32 4 3 2 1 subtract add multiply divide'),
		[2]);
});

test("Sync: Operate on strings.", assert => {
	assert.plan(1);
	const evaluate = conexp({ uppercase: uppercase });
	assert.deepEquals(
		evaluate('"Some" "Random String" uppercase'),
		['Some', 'RANDOM STRING']);
});



