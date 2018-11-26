
const _ = require('./src/general');
const func = _.simpleFunction;
const metaFunc = _.simpleMetaFunction;

module.exports = {
	id:   func((a) => [a]),
	dup:  func((a) => [a, a]),
	drop: func(a => []),
	swap: func((a, b) => [b, a]),

	quote: func((a) => [[a]]),
	dequote: metaFunc((quote) => quote.value),

	// eq: func((a, b) => [a === b]),
	// gt: func((a, b) => [a > b]),
	// gte: func((a, b) => [a >= b]),
	// lt: func((a, b) => [a < b]),
	// lte: func((a, b) => [a <= b]),
	// not: func((a) => [!a]),

	// ifte: metaFunc((p, yes, no) => [p ? yes : no]),
};
