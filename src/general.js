
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

const value = (token) => token.value;
const to = (type) => (value) => ({ type, value });
const is = (type) => (token) => token.type === type;

const toNumberToken = to(types.number);
const toStringToken = to(types.string);
const toBooleanToken = to(types.boolean);
const toSyntaxToken = to(types.syntax);
const toIdentifierToken = to(types.identifier);
const toQuotationToken = to(types.quotation);

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
	: error(`Wrong value for token: ${ value }`);

const simpleMetaFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack)));
};
const simpleFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack).map(R.prop('value')))
		        .map(toToken));
};


module.exports = {
	toNumberToken,
	toStringToken,
	toBooleanToken,
	toSyntaxToken,
	toIdentifierToken,
	toQuotationToken,

	isNumberToken,
	isStringToken,
	isBooleanToken,
	isSyntaxToken,
	isIdentifierToken,
	isQuotationToken,

	value,
	simpleFunction,
	simpleMetaFunction,
};
