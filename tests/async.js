
const test = require('blue-tape');

const conexp = require('../');
const functions = require('../functions');

const delay = conexp.func((ms) =>
	new Promise((resolve) => setTimeout(() => resolve([]), ms)));
// const quote = conexp.func((a) => [[a]]);
const add = conexp.func((a, b) => [a + b]);


test("Async: Correctly handles promise-returning functions.", async assert => {
	const evaluate = conexp({ delay });
	return assert.deepEquals(
		await evaluate('"ok" 5 delay'),
		['ok']);
});

test("Async: Reject on unrecognized tokens.", async assert => {
	const evaluate = conexp({});
	return assert.shouldFail(
		evaluate('2 3 nonexistant'));
});

