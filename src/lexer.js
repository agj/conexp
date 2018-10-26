
const R = require('ramda');
const types = require('./types');

const isNumber = R.test(/^-?(\d+\.?\d*|\d*\.?\d+)$/);
const isString = R.test(reString);
const isBoolean = R.test(/^(true|false)$/);
const isSyntax = R.contains(R.__, ['[', ']']);

const toNumber = parseFloat;
const toString = R.replace(reString, '$2');
const toBoolean = R.equals('true');

const split = R.match(/(["'])(\\?.|\n)*?\1|\S+/g);

const lexer = (code) =>
	split(code)
	.map((v) =>
		isNumber(v)  ? { type: types.number,     value: toNumber(v) } :
		isString(v)  ? { type: types.string,     value: toString(v) } :
		isBoolean(v) ? { type: types.boolean,    value: toBoolean(v) } :
		isSyntax(v)  ? { type: types.syntax,     value: v } :
		               { type: types.identifier, value: v }
	);

module.exports = lexer;
