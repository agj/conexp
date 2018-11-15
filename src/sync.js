
const R = require('ramda');
const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');
const types = require('./types');

const conexp = funs => expr => {
	const tokens = lexer(expr);
	const parsed = parser(tokens);
	const doit = (stack, [cur, ...remaining]) =>
		cur
			? cur.type === types.identifier
				? doit([], funs[cur.value](stack).concat(remaining))
				: doit(R.append(cur, stack), remaining)
			: stack;
	return doit([], parsed);
};

conexp.func = _.simpleFunction;
conexp.metaFunc = _.simpleMetaFunction;

conexp.isNumber = _.isNumberToken;
conexp.isString = _.isStringToken;
conexp.isBoolean = _.isBooleanToken;
conexp.isSyntax = _.isSyntaxToken;
conexp.isIdentifier = _.isIdentifierToken;
conexp.isQuotation = _.isQuotationToken;

conexp.toNumber = _.toNumberToken;
conexp.toString = _.toStringToken;
conexp.toBoolean = _.toBooleanToken;
conexp.toSyntax = _.toSyntaxToken;
conexp.toIdentifier = _.toIdentifierToken;
conexp.toQuotation = _.toQuotationToken;


module.exports = conexp;

