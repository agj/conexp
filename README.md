
conexp
======

[![Build Status](https://travis-ci.org/agj/conexp.svg?branch=master)](https://travis-ci.org/agj/conexp)
[![Dependency Status](https://david-dm.org/agj/conexp.svg)](https://david-dm.org/agj/conexp)

Concatenative expressions, written in Javascript. An extremely simple syntax for defining embedded languages, for use with [Node][node].

[node]: https://nodejs.org/
[wiki_concat]: https://en.wikipedia.org/wiki/Concatenative_programming_language
[postfix]: https://en.wikipedia.org/wiki/Reverse_Polish_notation
[concat-org]: http://www.concatenative.org/wiki/view/Front%20Page
[purdy]: https://evincarofautumn.blogspot.cl/2012/02/why-concatenative-programming-matters.html
[kerby]: http://tunes.org/~iepos/joy.html

## Example

```js
const conexp = require('conexp');

// First let's define some functions for our language.
const add = (a, b) => [a + b];
const subtract = (a, b) => [a - b];
const multiply = (a, b) => [a * b];
const divide = (a, b) => [a / b];

// Then let's generate it.
const evaluate = conexp({ '+': add, '-': subtract, '*': multiply, '/': divide });

// Now to test it.
evaluate('1 2 +'); //=> [3]
evaluate('10 4 - 3 /'); //=> [3]
evaluate('10 5 4 2 / - *'); //=> [30]
```


## Installation

With [Node][node] installed, type into the command line:

```sh
npm install conexp
```


## The syntax

The language evaluates [**postfix-notation**][postfix] expressions. This is unlike Javascript functions, which come before (and wrap) their arguments, and unlike math operators (such as `+`,) which come in between their arguments. Indeed, in our case, the functions/operators come _after_ the arguments. Like `3 2 +` or `"Hello world" print`.

Execution order is from left to right. It is performed by keeping a **stack** (basically a list) into which we push and pull values. Plain values are _pushed_ into the stack.

Let's take the previous _Example_ section's last line's expression and start analyzing it step by step. This is the expression:

`10 5 4 2 / - *`

The first four tokens `10 5 4 2` push four values into the stack, namely `10`, `5`, `4`, and `2`. So our stack and remainder of the expression look like this:

`[ 10 5 4 2 ] / - *` (The stack is in `[]` brackets.)

Next we have the function `/`. This, by its definition in the javascript code above, takes two values and returns one. This means that it _pops_ the last two values from the stack and operates on them, and then _pushes_ the result, the division of 4 by 2 (that is, 2) into the stack.

`[ 10 5 2 ] - *`

Where `4 2` used to be now there's `2`, the result of their division. Next we have `-`, which does a similar thing: it evaluates the subtraction of 5 and 2, namely 3.

`[ 10 3 ] *`

And finally, the last operation.

`[ 30 ]`

Thus the result of evaluating the entire expression is an array containing the single value `30`.

The syntax used is an elementary example of what is known as [_concatenative programming_][wiki_concat]. In essence, the above is all there is and all you need to know—it's quite simple. However, if you wanna delve deeper into the esoterica behind the concatenative approach, you may read [John Purdy's _Why concatenative programming matters_][purdy], browse the [concatenative.org wiki][concat-org], or read [Brent Kerby's _The theory of concatenative combinators_][kerby].


## Defining functions

Functions may take any number of arguments, and **must** return an array containing any number of return values. The arguments it receives are _popped_ from the stack, and the values it returns are _pushed_ into it. In the _Example_ section we see functions defined for several arithmetic operations. Here you have a few other types of possible functions:

```js
const conexp = require('conexp');

// Output.
const log = a => {
    console.log(a);
    return [a];
};

// Combinators.
const dup = a => [a, a];
const swap = (a, b) => [b, a];
const drop = a => [];

const evaluate = conexp({ log, dup, swap, drop });

evaluate('"Hello world!" log'); //=> ['Hello world!']
                                // and will output the string to the console.
evaluate('1 2 swap drop dup'); //=> [2, 2]
```


## Generating and using the language

All you need to do is pass the `conexp` function an object `functions` containing all functions your language will contain. Each key/value pair in the object indicates a name/function relationship within the language that will be generated.

`conexp(functions)` → `function`

The result of calling the `conexp` function is an `evaluate` function that takes in an `expression` as a string and evaluates it, returning an array of values.

`evaluate(expression)` → `array`


## Current limitations

The syntax **does** support the following features:

- Strings enclosed in `"` or `'`.
- Positive integers and zero.
- Functions.

It **does not** yet support anything else, like:

- Other types of numbers, such as negative or floating point.
- Quotations (grouping tokens for later parsing, necessary for branching, etc.).
- Definitions.

I will get around to (some of) these in the future.

