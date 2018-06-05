
const R = require('ramda');
const _ = require('./general');

module.exports = funs => expr => {
	const tokens = _.getTokens(expr);
	return tokens.reduce(
		async (p, cur) => {
			const result = await Promise.all(_.step(funs, await p, cur));
			return R.apply(R.concat, result);
		},
		Promise.resolve([]));
};
