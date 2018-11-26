
conexp — Concatenative Expressions
==================================

[![Build Status](https://travis-ci.org/agj/conexp.svg?branch=master)](https://travis-ci.org/agj/conexp)
[![Dependency Status](https://david-dm.org/agj/conexp.svg)](https://david-dm.org/agj/conexp)


A simple tool to create tiny, single-purpose languages that provide some programmatic functionality in your software. I call them “concatenative expressions”. For use with Javascript and [Node][node].

Think regular expressions, a language for the single purpose of matching strings. That is the sort of language you can create with conexp, defining functions that use the minimal [postfix syntax](#the-syntax) provided.

By default works asynchronously (using promises), but also comes with a synchronous mode.

[node]: https://nodejs.org/
[wiki-concat]: https://en.wikipedia.org/wiki/Concatenative_programming_language
[postfix]: https://en.wikipedia.org/wiki/Reverse_Polish_notation
[concat-org]: http://www.concatenative.org/wiki/view/Front%20Page
[purdy]: https://evincarofautumn.blogspot.cl/2012/02/why-concatenative-programming-matters.html
[kerby]: http://tunes.org/~iepos/joy.html



## Example

```js
const conexp = require('conexp');
const func = conexp.func;

// First let's define some functions for a calculator language.

const add =      func((a, b) => [a + b]);
const subtract = func((a, b) => [a - b]);
const multiply = func((a, b) => [a * b]);
const divide =   func((a, b) => [a / b]);

// Then let's generate it.

const evaluate = conexp({ '+': add, '-': subtract, '*': multiply, '/': divide });

// Now let's use it to calculate some arithmetic.

evaluate('1 2 +');          //=> Promise([3])
evaluate('10 4 - 3 /');     //=> Promise([3])
```

When evaluating code, a promise is returned. For synchronous evaluation, we can require `'conexp/sync'` instead, like this:

```js
const conexp = require('conexp/sync');
// ...
evaluate('1 2 +'); //=> [3]
```



## Installation

With [Node][node] installed, type into the command line:

```sh
npm install conexp
```



## The syntax

The language evaluates [**postfix notation**][postfix] expressions. Consider these equivalent functions and operators that take two arguments:

| other                | postfix            |
| -------------------- | ------------------ |
| `someFunction(a, b)` | `a b someFunction` |
| `a + b`              | `a b +`            |

That is, in postfix notation **the functions and operators come _after_ the arguments.**

Let's interpret the previous [_Example_](#example) section's last line's expression (`10 4 - 3 /`) and analyze it step by step using a replacement strategy. **Evaluation is always done left to right**, performing any necessary replacements that functions dictate. Consider two functions, `-` (subtraction) and `/` (division).

```
10 4 - 3 /    The original expression.
6 3 /         We applied `-` against `10` and `4`, i.e. 10 - 4 = 6.
2             We applied `/` against `6` and `3`, i.e. 6 ÷ 3 = 2.
```

So `2` is our result. Note that since evaluation order is unambiguous using this syntax, parentheses are not needed, and not used.

### Quotations

Quotations are a feature that can be thought of as both lists and anonymous functions. They are sub-expressions enclosed in `[ ]`, which are not evaluated until necessary.

```
[ = 10 ] [  ] [  ] ifte
```

### Where this came from

The syntax that conexp uses is an elementary example of what is known as [_concatenative programming_][wiki-concat], and based on they Joy programming language by Manfred von Thun. In essence, the above is most that you'll need to know—it's quite simple. However, if you wanna delve deeper into the esoterica behind the concatenative approach, you may read [John Purdy's _Why concatenative programming matters_][purdy], browse the [concatenative.org wiki][concat-org], or read [Brent Kerby's _The theory of concatenative combinators_][kerby].



## How to use

Import the module in either asynchronous or synchronous modes:

```js
// Asynchronous mode (using promises)
const conexp = require('conexp');
// Or, synchronous mode
const conexp = require('conexp/sync');
```

Define all the functions usable within your language in a plain object `functions`, as key/value pairs. [Details on how to specify your functions below.](#defining-functions)

```js
const functions = {
	'+': conexp.func((a, b) => [a + b]),
	// etc.
};
```

Pass this object to the `conexp` function.

```js
const evaluate = conexp(functions);
```

The result of calling the `conexp` function is a function `evaluate` that takes in a string `expression`, and, naturally, evaluates said expression.

```js
const result = evaluate(expression);
```

The `expression` should be formatted according to [the syntax as described in this document](#the-syntax). `result` will in this case be a promise that resolves into an array of values. Or if using the synchronous mode, `result` will just be said array.



## Defining functions

Functions take a `stack`, which is a list of everything to the left of the function, and must return an updated stack (or a promise thereof). But the simplest way to define functions is by wrapping them with the **`conexp.func`** utility function. All you need to do is create functions that **take any number of arguments**, and in turn either **return an array** containing any number of return values, or a **promise** that resolves into such an array (when in asynchronous mode).

The arguments it receives are _popped_ from the right end of the stack, and the values it returns are _pushed_ back into it. In the [_Example_](#example) section we see functions defined for several arithmetic operations. Here you have a few other types of possible functions:

```js
const conexp = require('conexp');
const func = conexp.func;

const log = func((a) => { // Outputs its argument to the console.
    console.log(a);
    return []; // Always return an array, even if empty.
});
const dup =  func((a) => [a, a]);    // Duplicates an argument.

const evaluate = conexp({ log, dup });

evaluate('"Hello world!" log'); //=> Promise([])
                                // and will output the string to the console.
evaluate('7 dup dup');  //=> Promise([7, 7, 7])
```

### Use `metaFunc` to go deeper

Some times you want to do more complex stuff in your function. For this, you may want access to reading and defining tokens as they are represented internally.

**A token is the internal data structure that represents elements of the program.**



## API

### `conexp(functions)`

Generates a language using the function definitions specified in `functions` ([see how to define them](#defining-functions)). Returns the `evaluate(expression)` function for the language, which takes a string `expression` and returns an array of values.

### `conexp.func(func)`

Allows function `func` to take arguments however many arguments it needs and return an array of values, or a promise. [See how to use it.](#defining-functions)

### `conexp.value(token)`

Returns the raw name of an identifier or a syntax token `token`. For instance, for a identifier token of a function `dup` it will return the string `"dup"`.

### `conexp.is*(token)`

Comprises: `isNumber`, `isString`, `isBoolean`, `isSyntax`, `isIdentifier`, `isQuotation`.

These functions return a boolean value indicating whether `token` is of the particular type.

### `conexp.to*(value)`

Comprises: `toIdentifier`, `toSyntax`.

These functions construct a token of the particular type, that represents the `value`. For instance, `toIdentifier("dup")` will construct an identifier token that maps to the function `dup`.



## Included functions

A small library of functions is provided for convenience. Just require it as follows:

```js
const functions = require('conexp/functions');
```

### `id`

> `a id` → `a`

Returns the same value.

### `dup`

> `a dup` → `a a`

Duplicates a value.

### `drop`

> `a drop` → ` `

Removes a value from the stack.

### `swap`

> `a b swap` → `b a`

Swaps two values in place.

### `quote`

> `a quote` → `[ a ]`

Wraps one value in a quotation.

### `dequote`

> `[ a ] dequote` → `a`

Puts the contents of a quotation into the stack.



## Values and quotations

The following are valid values:

- Strings such as: `'hi'`, `"it's OK"`
- Numbers such as `5`, `1.3`, `-800.17`
- Booleans: `true` or `false`
- Identifiers that map to functions.

In addition, to delay execution of code there is the functionality called **quotations**.


