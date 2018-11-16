
const func = require('./src/general').simpleFunction;
const metaFunc = require('./src/general').simpleMetaFunction;

module.exports = {
	id:   func((a) => [a]),
	dup:  func((a) => [a, a]),
	drop: func(a => []),
	swap: func((a, b) => [b, a]),
	quote: func((a) => [[a]]),
	dequote: metaFunc((quote) => quote.value),
};
