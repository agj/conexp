
const R = require('ramda');
const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');

const conexp = (funs) => (expr) => {
	const tokens = lexer(expr);
	const parsed = parser(tokens);
	const doit = (stack, [cur, ...remaining]) =>
		cur
			? _.isIdentifierToken(cur)
				? doit([], funs[_.getValue(cur)](stack).concat(remaining))
				: doit(R.append(cur, stack), remaining)
			: stack;
	const result = doit([], parsed);
	return result.map(_.getValue);
};

conexp.value = _.getValue;
conexp.func = _.simpleFunction;
conexp.metaFunc = _.simpleMetaFunction;

conexp.isNumberToken = _.isNumberToken;
conexp.isStringToken = _.isStringToken;
conexp.isBooleanToken = _.isBooleanToken;
conexp.isSyntaxToken = _.isSyntaxToken;
conexp.isIdentifierToken = _.isIdentifierToken;
conexp.isQuotationToken = _.isQuotationToken;

conexp.toToken = _.toToken;
conexp.toSyntaxToken = _.toSyntaxToken;
conexp.toIdentifierToken = _.toIdentifierToken;


module.exports = conexp;

