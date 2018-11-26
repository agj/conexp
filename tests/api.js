
const test = require('blue-tape');

const conexp = require('../sync');
const conexpAsync = require('../');


const add = (a, b) => [a + b];

const testAPI = (name, args, result) => {
	test(`API: ${ name } (sync)`, (assert) => {
		assert.plan(1);
		assert.deepEquals(
			conexp[name](...args),
			result);
	});
	test(`API: ${ name } (async)`, async (assert) => {
		assert.plan(1);
		assert.deepEquals(
			conexpAsync[name](...args),
			result);
	});
};


testAPI('isNumber',
	[5],
	true);

testAPI('isString',
	["hi"],
	true);

testAPI('isBoolean',
	[true],
	true);

testAPI('isQuotation',
	[["bla", true]],
	true);

testAPI('isIdentifier',
	[{ type: 'identifier', value: 'bla' }],
	true);

testAPI('isSyntax',
	[{ type: 'syntax', value: '[' }],
	true);

testAPI('toIdentifier',
	['bla'],
	{ type: 'identifier', value: 'bla' });

testAPI('toSyntax',
	['['],
	{ type: 'syntax', value: '[' });

testAPI('value',
	[conexp.toIdentifier('bla')],
	'bla');

test("API: func (sync)", assert => {
	assert.plan(1);
	assert.deepEquals(
		conexp.func(add)([5, 1, 2]),
		[5, 3]);
});

test("API: func (async)", async assert => {
	assert.deepEquals(
		await conexpAsync.func(add)([5, 1, 2]),
		[5, 3]);
});
