
const R = require('ramda');
const _ = require('./general');

module.exports = funs => expr => {
	const tokens = _.getTokens(expr);
	return tokens.reduce(
		R.pipe(_.step(funs),
		       R.apply(R.concat)),
		[]);
};
