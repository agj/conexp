
const R = require('ramda');
const _ = require('./general');

module.exports = funs => expr => {
	const tokens = _.getTokens(expr);
	const { parsed } = _.parse(tokens);
	return parsed.reduce(
		R.pipe(_.step(funs),
		       R.apply(R.concat)),
		[]);
};
