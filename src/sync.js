
const R = require('ramda');
// const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');
const types = require('./types');

// const step = R.curry((funs, stack, token, nextTokens) =>
// 	isQuotation(token)        ? [stack, [token]]
// 	: isNumber(token)         ? [stack, [toNumber(token)]]
// 	: isString(token)         ? [stack, [toString(token)]]
// 	: isBoolean(token)        ? [stack, [toBoolean(token)]]
// 	: isFunction(funs, token) ? applyFunction(toFunction(funs, token), stack)
// 	: badToken(token));

// module.exports = funs => expr => {
// 	const tokens = lexer(expr);
// 	const parsed = parser(tokens);
// 	return parsed.reduce(
// 		R.pipe(step(funs), R.apply(R.concat)),
// 		[]);
// };



module.exports = funs => expr => {
	const tokens = lexer(expr);
	const parsed = parser(tokens);
	const doit = (stack, [cur, ...remaining]) =>
		cur
			? cur.type === types.identifier
				? doit(funs[cur.value](stack), remaining)
				: doit(R.append(cur, stack), remaining)
			: stack;
	return doit([], parsed);
};

