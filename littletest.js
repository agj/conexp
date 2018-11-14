
const R = require('ramda');
const conexp = require('./sync');

const log = R.tap(console.log);


const evaluate = conexp({
	'+': conexp.func((a, b) => [a + b]),
	'deq': conexp.metaFunc((quote) => quote.value),
});

console.log(evaluate('[ 0.5 2 + ] deq'));
console.log(evaluate(`[ "yeah" ] [ "yeah" ] deq`));

