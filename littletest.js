
const R = require('ramda');
const conexp = require('./sync');

const log = R.tap(console.log);
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


const evaluate = conexp({
	// '+': (stack) => {
	// 	const [a, b] = R.takeLast(2, stack);
	// 	return R.append(a.value + b.value, R.dropLast(2, stack));
	// },
	'+': simpleFunction((a, b) => [a + b]),
	'deq': simpleMetaFunction((quote) => quote.value),
});

console.log(evaluate('0.5 2 +'));
console.log(evaluate(`[ "yeah" ] [ "yeah" ] deq`));

