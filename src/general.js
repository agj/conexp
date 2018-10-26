
const R = require('ramda');

const log = R.tap(console.log);

const reString = /^(["'])((.|\n)*)\1$/m;

const isQuotation = Array.isArray;
const isFunction = (funs, val) => R.has(val, funs);
const toFunction = (funs, name) => funs[name];

const applyFunction = (fun, stack) =>
	[R.dropLast(fun.length, stack),
	 fun(...R.takeLast(fun.length, stack))];
// const applyQuotation = (quot, stack) =>
const badToken = token => { throw "Token is not valid: " + token };


const step = R.curry((funs, stack, token, nextTokens) =>
	isQuotation(token)        ? [stack, [token]]
	: isNumber(token)         ? [stack, [toNumber(token)]]
	: isString(token)         ? [stack, [toString(token)]]
	: isBoolean(token)        ? [stack, [toBoolean(token)]]
	: isFunction(funs, token) ? applyFunction(toFunction(funs, token), stack)
	: badToken(token));


module.exports = {
	getTokens,
	parse,
	step,
};
