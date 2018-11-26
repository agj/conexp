
const R = require('ramda');
const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');

const conexp = (funs) => async (expr) => {
	const tokens = lexer(expr);
	const parsed = parser(tokens);
	const doit = async (stack, [cur, ...remaining]) =>
		cur
			? _.isIdentifier(cur)
				? doit([], (await funs[_.getValue(cur)](stack)).concat(remaining))
				: doit(R.append(cur, stack), remaining)
			: stack;
	const result = await doit([], parsed);
	return result;
};

conexp.value = _.getValue;
conexp.func = _.simpleAsyncFunction;


module.exports = conexp;
