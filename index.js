
const R = require('ramda');


const reString = /^(["'])((.|\n)*)\1$/m;

const isNumber = R.test(/^\d+$/);
const isFunction = (funs, val) => R.has(val, funs);
const isString = R.test(reString);

const toNumber = val => parseInt(val);
const toFunction = (funs, name) => funs[name];
const toString = R.replace(reString, '$2');

const applyFunction = (fun, stack) =>
	R.concat(
		R.dropLast(fun.length, stack),
		fun(...R.takeLast(fun.length, stack)));
const badToken = token => { throw "Token is not valid: " + token };


module.exports = funs => expr => {
	const tokens = expr.match(/(["'])(\\?.|\n)*?\1|\S+/g);
	return tokens.reduce(
		(stack, cur) =>
			isNumber(cur) ? R.concat(stack, [toNumber(cur)])
			: isString(cur) ? R.concat(stack, [toString(cur)])
			: isFunction(funs, cur) ? applyFunction(toFunction(funs, cur), stack)
			: badToken(cur),
		[]);
};
