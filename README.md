
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

Internally it's a bit more involved. But by wrapping your function with the **`conexp.func`** utility function, all you need to do is create functions that **take any number of arguments**, and in turn either **return an array** containing any number of return values, or a **promise** that resolves into such an array (when in asynchronous mode).

The arguments it receives are _popped_ from the stack, and the values it returns are _pushed_ into it. In the _Example_ section we see functions defined for several arithmetic operations. Here you have a few other types of possible functions:

```js
const conexp = require('conexp');
const func = conexp.func;

// Output.
const log = func((a) => {
    console.log(a);
    return []; // Always return an array, even if empty.
});

// Combinators.
const dup =  func((a) => [a, a]);    // Takes one argument, returns it duplicated.
const swap = func((a, b) => [b, a]); // Takes two arguments and swaps them in order.
const drop = func((a) => []);        // Takes an argument and makes it disappear.

const evaluate = conexp({ log, dup, swap, drop });

evaluate('"Hello world!" log'); //=> Promise([])
                                // and will output the string to the console.
evaluate('1 2 swap drop dup');  //=> Promise([2, 2])
```

### Use `metaFunc` to go deeper

Some times you want to do more complex stuff in your function. For this, you may want access to reading and defining tokens as they are represented internally.

**A token is the internal data structure that represents elements of the program.**



## The syntax

The language evaluates [**postfix notation**][postfix] expressions. In this notation, a function that takes two arguments, represented in javascript as `someFunction(a, b)` would be represented instead as `a b someFunction`. A typical sum like `1 + 2` would instead be `1 2 +`. That is, in our case, **the functions or operators come _after_ the arguments.**

Execution order is from left to right. It is performed by keeping a **stack** (basically a list) into which we push and pull values. Plain values are _pushed_ into the stack. Functions _pull_ values from it to read, and then push new ones.

Let's take the previous _Example_ section's last line's expression and start analyzing it step by step. This is the expression:

`10 4 - 3 /`

Since execution order is unambiguous using this syntax, parentheses are not needed, and not used.

The first two tokens `10 4` push two values into the stack, namely `10` and `4`. So our stack and remainder of the expression look like this:

`10 4` ← `- 3 /`  
(To the left the stack, to the right the remainder of the program)

Next we have the function `-`. This, by its definition in the javascript code above, takes two values and returns one. This means that it _pops_ the last two values from the stack and operates on them, and then _pushes_ the result, 10 - 4 = `6`, into the stack.

`6` ← `3 /`

Where `10 4` used to be now there's a `6`, the result of their subtraction. Next, we push one more value, `3`.

`6 3` ← `/`

And lastly we have `/`, which again operates on the stack: it evaluates 6 ÷ 3 = `2`.

`2` ←

The result of evaluating the entire expression is an array containing the single value `2`.

The syntax used is an elementary example of what is known as [_concatenative programming_][wiki-concat]. In essence, the above is most that you'll need to know—it's quite simple. However, if you wanna delve deeper into the esoterica behind the concatenative approach, you may read [John Purdy's _Why concatenative programming matters_][purdy], browse the [concatenative.org wiki][concat-org], or read [Brent Kerby's _The theory of concatenative combinators_][kerby].



## API

### `conexp(functions)`

### `conexp.func(func)`

### `conexp.metaFunc(func)`

### `conexp.value(token)`

Returns the raw value of `token`.

### `conexp.is*Token(token)`

Comprises: `isNumberToken`, `isStringToken`, `isBooleanToken`, `isSyntaxToken`, `isIdentifierToken`, `isQuotationToken`.

These functions return a boolean value indicating whether `token` is of the particular type.

### `conexp.to*Token(rawValue)`

Comprises: `toNumberToken`, `toStringToken`, `toBooleanToken`, `toSyntaxToken`, `toIdentifierToken`, `toQuotationToken`.

These functions construct a token of the particular type that represents the `rawValue`.



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


