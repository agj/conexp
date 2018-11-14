
const R = require('ramda');
const _ = require('./general');

const reString = /^(["'])((.|\n)*)\1$/m;

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
		isNumber(v)  ? _.toNumberToken(toNumber(v)) :
		isString(v)  ? _.toStringToken(toString(v)) :
		isBoolean(v) ? _.toBooleanToken(toBoolean(v)) :
		isSyntax(v)  ? _.toSyntaxToken(v) :
		               _.toIdentifierToken(v)
	);

module.exports = lexer;
