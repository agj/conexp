
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

const getValue = (token) => isQuotationToken(token) ? token.value.map(getValue) : token.value;
const to = (type) => (value) => ({ type, value });
const is = (type) => (token) => token.type === type;

const toNumberToken = to(types.number);
const toStringToken = to(types.string);
const toBooleanToken = to(types.boolean);
const toQuotationToken = to(types.quotation);
const toSyntaxToken = to(types.syntax);
const toIdentifierToken = to(types.identifier);

const isNumberToken = is(types.number);
const isStringToken = is(types.string);
const isBooleanToken = is(types.boolean);
const isSyntaxToken = is(types.syntax);
const isIdentifierToken = is(types.identifier);
const isQuotationToken = is(types.quotation);

const toToken = (value) =>
	typeof value === 'boolean'  ? toBooleanToken(value)
	: typeof value === 'number' ? toNumberToken(value)
	: typeof value === 'string' ? toStringToken(value)
	: Array.isArray(value)      ? toQuotationToken(value.map(toToken))
	: error(`Value cannot be converted to token: ${ value }`);

const simpleFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack).map(R.prop('value')))
		        .map(toToken));
};
const simpleMetaFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack)));
};
const simpleAsyncFunction = (f) => {
	const nargs = f.length;
	return async (stack) =>
		R.dropLast(nargs, stack)
		.concat((await f(...R.takeLast(nargs, stack).map(R.prop('value'))))
		        .map(toToken));
};


module.exports = {
	toToken,
	toNumberToken,
	toStringToken,
	toBooleanToken,
	toQuotationToken,
	toSyntaxToken,
	toIdentifierToken,

	isNumberToken,
	isStringToken,
	isBooleanToken,
	isSyntaxToken,
	isIdentifierToken,
	isQuotationToken,

	getValue,
	simpleFunction,
	simpleMetaFunction,
	simpleAsyncFunction,
};
