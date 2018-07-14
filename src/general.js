
const R = require('ramda');

const log = R.tap(console.log);

const reString = /^(["'])((.|\n)*)\1$/m;

const isNumber = R.test(/^-?(\d+\.?\d*|\d*\.?\d+)$/);
const isFunction = (funs, val) => R.has(val, funs);
const isString = R.test(reString);
const isBoolean = R.test(/^(true|false)$/);

const toNumber = parseFloat;
const toFunction = (funs, name) => funs[name];
const toString = R.replace(reString, '$2');
const toBoolean = R.equals('true');

const applyFunction = (fun, stack) =>
	[R.dropLast(fun.length, stack),
	 fun(...R.takeLast(fun.length, stack))];
const badToken = token => { throw "Token is not valid: " + token };


const getTokens = R.match(/(["'])(\\?.|\n)*?\1|\S+/g);
const step = R.curry((funs, stack, token) =>
	isNumber(token)           ? [stack, [toNumber(token)]]
	: isString(token)         ? [stack, [toString(token)]]
	: isBoolean(token)        ? [stack, [toBoolean(token)]]
	: isFunction(funs, token) ? applyFunction(toFunction(funs, token), stack)
	// : token === '['           ?
	// : token === ']'           ?
	: badToken(token));


module.exports = {
	getTokens,
	step,
};
