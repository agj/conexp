
const R = require('ramda');

const log = R.tap(console.log);

const error = (msg) => { throw msg };

const types = {
	number:     'number',
	string:     'string',
	boolean:    'boolean',
	syntax:     'syntax',
	identifier: 'identifier',
	quotation:  'quotation',
};

const to = (type) => (value) => ({ type, value });
const is = (type) => (token) => token.type === type;
const getValue = (token) => isIdentifier(token) || isSyntax(token) ? token.value : error(`Not a token with raw value: ${ token }`);

const toIdentifier = to(types.identifier);
const toSyntax = to(types.syntax);

const isNumber =     (v) => typeof v === 'number';
const isString =     (v) => typeof v === 'string';
const isBoolean =    (v) => typeof v === 'boolean';
const isQuotation =  (v) => Array.isArray(v);
const isIdentifier = is(types.identifier);
const isSyntax =     is(types.syntax);

const simpleFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack)));
};
const simpleAsyncFunction = (f) => {
	const nargs = f.length;
	return async (stack) =>
		R.dropLast(nargs, stack)
		.concat(await f(...R.takeLast(nargs, stack)));
};


module.exports = {
	toSyntax,
	toIdentifier,

	isNumber,
	isString,
	isBoolean,
	isSyntax,
	isIdentifier,
	isQuotation,

	getValue,
	simpleFunction,
	simpleAsyncFunction,
};
