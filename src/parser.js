
const _ = require('./general');

const parseStep = ({ parsed, remaining: [current, ...remaining] }) => {
	if (current === undefined || _.isSyntax(current) && _.getValue(current) === ']') {
		return { parsed, remaining };
	} else {
		if (_.isSyntax(current) && _.getValue(current) === '[') {
			const quotation = parseStep({ parsed: [], remaining });
			return parseStep({
				parsed:    [...parsed, quotation.parsed],
				remaining: quotation.remaining,
			});
		} else {
			return parseStep({
				parsed:    [...parsed, current],
				remaining: remaining,
			});
		}
	}
};

const parser = (tokens) =>
	parseStep({ parsed: [], remaining: tokens })
	.parsed;

module.exports = parser;
