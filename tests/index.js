
const test = require('tape-catch');

const conexp = require('../');


const dup = a => [a, a];
const swap = (a, b) => [b, a];
const drop = a => [];

const add = (a, b) => [a + b];
const subtract = (a, b) => [a - b];
const multiply = (a, b) => [a * b];
const divide = (a, b) => [a / b];

const uppercase = a => [a.toUpperCase()];


test("Parse integers and strings.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate('1 "one?" "two!" 2 3 "and... three"'),
		[1, 'one?', 'two!', 2, 3, 'and... three']);
});

test("Ignore whitespace.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate('    1   \t  "one?" \n\n "two!" 2  3    "and...\nthree"\n'),
		[1, 'one?', 'two!', 2, 3, 'and...\nthree']);
})

test("Move integers around with functions.", assert => {
	assert.plan(1);
	const evaluate = conexp({ dup, swap, drop });
	assert.deepEquals(
		evaluate('1 2 3 swap drop dup'),
		[1, 3, 3]);
});

test("Operate on integers.", assert => {
	assert.plan(1);
	const evaluate = conexp({ add, subtract, multiply, divide, swap });
	assert.deepEquals(
		evaluate('32 4 3 2 1 subtract add multiply divide'),
		[2]);
});

test("Operate on strings.", assert => {
	assert.plan(1);
	const evaluate = conexp({ uppercase });
	assert.deepEquals(
		evaluate('"Some" "Random String" uppercase'),
		['Some', 'RANDOM STRING']);
});

test("Throw on unrecognized tokens.", assert => {
	assert.plan(1);
	const evaluate = conexp({ add });
	assert.throws(() => evaluate('2 3 add nonexistant'));
});

