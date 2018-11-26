
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

conexp.isNumber = _.isNumber;
conexp.isString = _.isString;
conexp.isBoolean = _.isBoolean;
conexp.isQuotation = _.isQuotation;
conexp.isIdentifier = _.isIdentifier;
conexp.isSyntax = _.isSyntax;

conexp.toIdentifier = _.toIdentifier;
conexp.toSyntax = _.toSyntax;


module.exports = conexp;
