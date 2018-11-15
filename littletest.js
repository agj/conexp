
const R = require('ramda');
const conexp = require('./sync');

const log = R.tap(console.log);


const evaluate = conexp({
	'+': conexp.func((a, b) => [a + b]),
	'dequote': conexp.metaFunc((quote) => quote.value),
	'quote': conexp.func((a) => [[a]]),
	'dup': conexp.func((a) => [a, a]),
	'swap': conexp.func((a, b) => [b, a]),
});

log(evaluate(`[ 0.5 2 + ] dequote`));
log(evaluate(`[ "quoted" ] [ "dequoted" ] dequote`));
log(evaluate(`"not quoted" "quoted" quote`));
