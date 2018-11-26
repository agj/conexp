
const R = require('ramda');
const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');

const conexp = (funs) => (expr) => {
	const tokens = lexer(expr);
	const parsed = parser(tokens);
	const doit = (stack, [cur, ...remaining]) =>
		cur !== void 0
			? _.isIdentifier(cur)
				? doit([], funs[_.getValue(cur)](stack).concat(remaining))
				: doit(R.append(cur, stack), remaining)
			: stack;
	const result = doit([], parsed);
	return result;
};

conexp.value = _.getValue;
conexp.func = _.simpleFunction;

conexp.isNumber = _.isNumber;
conexp.isString = _.isString;
conexp.isBoolean = _.isBoolean;
conexp.isQuotation = _.isQuotation;
conexp.isIdentifier = _.isIdentifier;
conexp.isSyntax = _.isSyntax;

conexp.toIdentifier = _.toIdentifier;
conexp.toSyntax = _.toSyntax;


module.exports = conexp;

