
const types = require('./types');

const parseStep = ({ parsed, remaining: [current, ...remaining] }) => {
	if (current === undefined || current.type === types.syntax && current.value === ']') {
		return { parsed, remaining };
	} else {
		if (current.type === types.syntax && current.value === '[') {
			const quotation = parse(remaining);
			return parseStep({
				parsed:    [...parsed, { type: types.quotation, value: quotation.parsed }],
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
