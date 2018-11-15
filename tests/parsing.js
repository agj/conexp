
const test = require('blue-tape');

const conexp = require('../sync');


test("Parse numbers.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate(`1 200 1.50 3. .5 -1 -200 -1.50 -3. -.5`),
		[1, 200, 1.50, 3, 0.5, -1, -200, -1.50, -3, -0.5]);
});

test("Parse strings.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate(`"double" 'single' "it's mixed" '"a"'`),
		['double', 'single', "it's mixed", '"a"']);
});

test("Parse booleans.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate(`true false`),
		[true, false]);
});

test("Parse functions.", assert => {
	assert.plan(1);
	const evaluate = conexp({ noop: stack => stack });
	assert.deepEquals(
		evaluate('1 2 3 noop'),
		[1, 2, 3]);
});

test("Parse quotations.", assert => {
	assert.plan(1);
	const evaluate = conexp({  });
	assert.deepEquals(
		evaluate('"a" [ "b" [ "c" ] ] "d"'),
		['a', ['b', ['c']], 'd']);
});

test("Ignore whitespace.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate('    1   \t  "one?" \n\n "two!" 2  3    "and...\nthree"\n'),
		[1, 'one?', 'two!', 2, 3, 'and...\nthree']);
});

test("Throw on unrecognized identifiers.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.throws(() => evaluate('2 3 add nonexistant'));
});
