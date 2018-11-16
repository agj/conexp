
const test = require('blue-tape');

const conexp = require('../sync');
const functions = require('../functions');


test("Functions: Number matches.", assert => {
	assert.plan(1);
	assert.equals(Object.keys(functions).length, 6);
});

test("Functions: id.", assert => {
	assert.plan(1);
	const evaluate = conexp({ id: functions.id });
	assert.deepEquals(
		evaluate(`true id 5 id`),
		[true, 5]);
});

test("Functions: dup.", assert => {
	assert.plan(1);
	const evaluate = conexp({ dup: functions.dup });
	assert.deepEquals(
		evaluate(`true dup 5 dup`),
		[true, true, 5, 5]);
});

test("Functions: drop.", assert => {
	assert.plan(1);
	const evaluate = conexp({ drop: functions.drop });
	assert.deepEquals(
		evaluate(`1 2 drop 3`),
		[1, 3]);
});

test("Functions: swap.", assert => {
	assert.plan(1);
	const evaluate = conexp({ swap: functions.swap });
	assert.deepEquals(
		evaluate(`1 2 swap`),
		[2, 1]);
});

test("Functions: quote.", assert => {
	assert.plan(1);
	const evaluate = conexp({ quote: functions.quote });
	assert.deepEquals(
		evaluate(`1 1 quote`),
		[1, [1]]);
});

test("Functions: dequote.", assert => {
	assert.plan(1);
	const evaluate = conexp({ dequote: functions.dequote });
	assert.deepEquals(
		evaluate(`[ 1 ] [ 1 ] dequote`),
		[[1], 1]);
});


