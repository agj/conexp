
const test = require('blue-tape');

const conexp = require('../sync');
const conexpAsync = require('../');
const functions = require('../functions');


const testFunction = (description, definitions, program, result) => {
	test(description + " (sync)", (assert) => {
		assert.plan(1);
		const evaluate = conexp(definitions);
		assert.deepEquals(
			evaluate(program),
			result);
	});
	test(description + " (async)", async (assert) => {
		const evaluate = conexpAsync(definitions);
		return assert.deepEquals(
			await evaluate(program),
			result);
	});
};


test("Functions: Number matches.", assert => {
	assert.plan(1);
	assert.equals(Object.keys(functions).length, 6);
});

testFunction("Functions: id", { id: functions.id },
	`true id 5 id`,
	[true, 5]);

testFunction("Functions: dup.", { dup: functions.dup },
	`true dup 5 dup`,
	[true, true, 5, 5]);

testFunction("Functions: drop.", { drop: functions.drop },
	`1 2 drop 3`,
	[1, 3]);

testFunction("Functions: swap.", { swap: functions.swap },
	`1 2 swap`,
	[2, 1]);

testFunction("Functions: quote.", { quote: functions.quote },
	`1 1 quote`,
	[1, [1]]);

testFunction("Functions: dequote.", { dequote: functions.dequote },
	`[ 1 ] [ 1 ] dequote`,
	[[1], 1]);


