
const R = require('ramda');
const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');

const step = R.curry((funs, stack, token, nextTokens) =>
	isQuotation(token)        ? [stack, [token]]
	: isNumber(token)         ? [stack, [toNumber(token)]]
	: isString(token)         ? [stack, [toString(token)]]
	: isBoolean(token)        ? [stack, [toBoolean(token)]]
	: isFunction(funs, token) ? applyFunction(toFunction(funs, token), stack)
	: badToken(token));

module.exports = funs => expr => {
	const tokens = lexer(expr);
	const parsed = parser(tokens);
	return parsed.reduce(
		R.pipe(_.step(funs),
		       R.apply(R.concat)),
		[]);
};
