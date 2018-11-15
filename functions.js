
const func = require('./src/general').simpleFunction;

module.exports = {
	id:   func((a) => [a]),
	dup:  func((a) => [a, a]),
	drop: func(a => []),
	swap: func((a, b) => [b, a]),
};
