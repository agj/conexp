
const R = require('ramda');
// const _ = require('./general');
const lexer = require('./lexer');
const parser = require('./parser');
const types = require('./types');

const error = (msg) => { throw msg };
const toToken = (value) =>
	typeof value === 'boolean'  ? { type: 'boolean', value }
	: typeof value === 'number' ? { type: 'number', value }
	: typeof value === 'string' ? { type: 'string', value }
	: Array.isArray(value)      ? { type: 'quotation', value }
	: error(`Wrong value for token.`);

const simpleMetaFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack)));
};
const simpleFunction = (f) => {
	const nargs = f.length;
	return (stack) =>
		R.dropLast(nargs, stack)
		.concat(f(...R.takeLast(nargs, stack).map(R.prop('value')))
		        .map(toToken));
};

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

conexp.func = simpleFunction;
conexp.metaFunc = simpleMetaFunction;


module.exports = conexp;

