
const _ = require('./general');

const parseStep = ({ parsed, remaining: [current, ...remaining] }) => {
	if (current === undefined || _.isSyntaxToken(current) && _.value(current) === ']') {
		return { parsed, remaining };
	} else {
		if (_.isSyntaxToken(current) && _.value(current) === '[') {
			const quotation = parseStep({ parsed: [], remaining });
			return parseStep({
				parsed:    [...parsed, _.toQuotationToken(quotation.parsed)],
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
