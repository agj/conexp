
const test = require('blue-tape');

const conexp = require('../');
const _ = require('./functions');

const delay = (msg, ms) => new Promise(resolve => setTimeout(() => resolve([msg]), ms));


test("Async: Parse integers and strings.", async assert => {
	assert.plan(1);
	const evaluate = conexp({});
	return assert.deepEquals(
		await evaluate('1 "one?" "two!" 2 3 "and... three"'),
		[1, 'one?', 'two!', 2, 3, 'and... three']);
});

test("Async: Correctly handles promise-returning functions.", async assert => {
	assert.plan(1);
	const evaluate = conexp({ delay });
	return assert.deepEquals(
		await evaluate('"ok" 5 delay'),
		["ok"]);
});

test("Async: Reject on unrecognized tokens.", async assert => {
	assert.plan(1);
	const evaluate = conexp({ add: _.add });
	return assert.shouldFail(
		evaluate('2 3 add nonexistant'));
});
