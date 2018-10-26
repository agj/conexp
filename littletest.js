
const conexp = require('./sync');

const evaluate = conexp({
	ifte: ([...rest, check, yes, no]) => {
		ap(rest, check)
	},
});

console.log(evaluate('[ true ] [ "yes" ] [ "no" ] if'));

