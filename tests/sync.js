
const test = require('blue-tape');

const conexp = require('../sync');
const _ = require('./functions');


test("Sync: Parse numbers.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate(`1 200 1.50 3. .5 -1 -200 -1.50 -3. -.5`),
		[1, 200, 1.50, 3, 0.5, -1, -200, -1.50, -3, -0.5]);
});

test("Sync: Parse strings.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate(`"double" 'single' "it's mixed" '"a"'`),
		['double', 'single', "it's mixed", '"a"']);
});

test("Sync: Parse booleans.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate(`true false`),
		[true, false]);
});

test("Sync: Ignore whitespace.", assert => {
	assert.plan(1);
	const evaluate = conexp({});
	assert.deepEquals(
		evaluate('    1   \t  "one?" \n\n "two!" 2  3    "and...\nthree"\n'),
		[1, 'one?', 'two!', 2, 3, 'and...\nthree']);
});

test("Sync: Move integers around with functions.", assert => {
	assert.plan(1);
	const evaluate = conexp({ dup: _.dup, swap: _.swap, drop: _.drop });
	assert.deepEquals(
		evaluate('1 2 3 swap drop dup'),
		[1, 3, 3]);
});

test("Sync: Operate on integers.", assert => {
	assert.plan(1);
	const evaluate = conexp({ add: _.add, subtract: _.subtract, multiply: _.multiply, divide: _.divide, swap: _.swap });
	assert.deepEquals(
		evaluate('32 4 3 2 1 subtract add multiply divide'),
		[2]);
});

test("Sync: Operate on strings.", assert => {
	assert.plan(1);
	const evaluate = conexp({ uppercase: _.uppercase });
	assert.deepEquals(
		evaluate('"Some" "Random String" uppercase'),
		['Some', 'RANDOM STRING']);
});

test("Sync: Throw on unrecognized tokens.", assert => {
	assert.plan(1);
	const evaluate = conexp({ add: _.add });
	assert.throws(() => evaluate('2 3 add nonexistant'));
});

test("Sync: Quotations.", assert => {
	assert.plan(1);
	const evaluate = conexp({  });
	assert.deepEquals(
		evaluate('"a" [ "b" ] "c"'),
		['a', ['"b"'], 'c']);
});

