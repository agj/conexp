
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


module.exports = conexp;

