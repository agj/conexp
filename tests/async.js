
const test = require('blue-tape');

const conexp = require('../');
const functions = require('../functions');

const delay = conexp.func((ms) =>
	new Promise((resolve) => setTimeout(() => resolve([]), ms)));
const quote = conexp.func((a) => [[a]]);


test("Async: Correctly handles promise-returning functions.", async assert => {
	assert.plan(1);
	const evaluate = conexp({ delay });
	return assert.deepEquals(
		await evaluate('"ok" 5 delay'),
		['ok']);
});

// test("Async: Reject on unrecognized tokens.", async assert => {
// 	assert.plan(1);
// 	const evaluate = conexp({ add: _.add });
// 	return assert.shouldFail(
// 		evaluate('2 3 add nonexistant'));
// });

test("Functions: quote.", assert => {
	assert.plan(1);
	const evaluate = conexp({ quote });
	assert.deepEquals(
		evaluate(`1 1 quote`),
		[1, [1]]);
});

// test("Functions: dequote.", assert => {
// 	assert.plan(1);
// 	const evaluate = conexp({ dequote: functions.dequote });
// 	assert.deepEquals(
// 		evaluate(`[ 1 ] [ 1 ] dequote`),
// 		[[1], 1]);
// });
