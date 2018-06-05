
const dup = a => [a, a];
const swap = (a, b) => [b, a];
const drop = a => [];

const add = (a, b) => [a + b];
const subtract = (a, b) => [a - b];
const multiply = (a, b) => [a * b];
const divide = (a, b) => [a / b];

const uppercase = a => [a.toUpperCase()];


module.exports = {
	dup,
	swap,
	drop,
	add,
	subtract,
	multiply,
	divide,
	uppercase,
};
