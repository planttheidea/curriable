# curriable

Curry any function with placeholder support

## Table of contents

- [curriable](#curriable)
  - [Table of contents](#table-of-contents)
  - [Summary](#summary)
  - [Usage](#usage)
    - [API](#api)
      - [curry](#curry)
      - [uncurry](#uncurry)
      - [isPlaceholder](#isplaceholder)
    - [Rest parameters](#rest-parameters)
    - [Default parameters](#default-parameters)
    - [Generics](#generics)
  - [Benchmarks](#benchmarks)
    - [Passing each parameter in curried calls](#passing-each-parameter-in-curried-calls)
    - [Passing all parameters in one call](#passing-all-parameters-in-one-call)
    - [Using placeholder parameters in curried calls](#using-placeholder-parameters-in-curried-calls)

## Summary

`curriable` provides a `curry` method that is [highly performant](#benchmarks) with a small footprint (_582 bytes
minified+gzipped_). You can call the method with any combination of parameters (one at a time, all at once, or any
number in between), and placeholders are supported.

If `fn` is the curried function and `_` is the placeholder value, the following are all equivalent:

- `fn(1)(2)(3)`
- `fn(1)(2, 3)`
- `fn(1, 2)(3)`
- `fn(1, 2, 3)`
- `fn(_, 2, 3)(1)`
- `fn(_, _, 3)(1)(2)`
- `fn(_, _, 3)(1, 2)`
- `fn(_, 2)(1)(3)`
- `fn(_, 2)(1, 3)`
- `fn(_, 2)(_, 3)(1)`

## Usage

You can use the default import:

```ts
import curry from 'curriable';

const fn = curry((a, b, c) => [a, b, c]);

console.log(fn('a', curry.__, 'c')('b')); // ["a", "b", "c"]

const original = curry.uncurry(fn);

console.log(original('a')); // ["a", undefined, undefined]
```

Or the named imports:

```ts
import { __, curry, uncurry } from 'curriable';

const fn = curry((a, b, c) => [a, b, c]);

console.log(fn('a', __, 'c')('b')); // ["a", "b", "c"]

const original = uncurry(fn);

console.log(original('a')); // ["a", undefined, undefined]
```

### API

#### curry

Curry the `fn` provided for any combination of arguments passed, until all required arguments have been passed.

```ts
import { curry } from 'curriable';

function curry<Fn extends (...args: any[]) => any>(
    fn: Fn,
    arity: number = fn.length
) => Curried<Fn>;
```

`arity` defaults to be the length provided by `fn.length`, but be aware this can cause unusual behavior with default
parameters or use of rest parameters.
[See the documentation on Function.length for more details](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length).

#### uncurry

```ts
import { uncurry } from 'curriable';

Get the underlying standard method that was curried using `curry`.

function uncurry<Fn extends (...args: any[]) => any>(
    fn: Curried<Fn>
) => Fn;
```

#### isPlaceholder

```ts
import { isPlaceholder } from 'curriable';

Is the value passed a `curriable` placeholder.

function isPlaceholder(value: any): value is Placeholder
```

### Rest parameters

```ts
console.log((...args) => args.length); // 0 arity computed
```

When using rest with curried functions, you should pass a second parameter to explicitly declare the correct `arity`:

```ts
const fn = (...args) => [a, b, c];
const curried = curry(fn, 3);

console.log(curried('a')('b')('c')); // ["a", "b", "c"]
```

### Default parameters

```ts
console.log(function (a, b = 1, c) {}.length); // 1 arity computed
```

Default parameters are very rare use-case with curried functions, but it is possible to trigger them if you declare an
explicit `arity` and explicitly pass `undefined` for that parameter:

```ts
const fn = (a, b, c = 1) => [a, b, c];
const curried = curry(fn, 3);

console.log(curried('a')('b')(undefined)); // ["a", "b", 1]
```

Yes, this is weird, but it is very difficult (impossible?) to distinguish between a parameter being undefined through
not being called yet in the curry chain vs being undefined by not being provided an explicit value. Explicitly passing
`undefined` provides that distinction.

Another option is to keep the arity limited and pass the value as an extra argument to the final curried method:

```ts
const fn = (a, b, c = 1) => [a, b, c];
const curried = curry(fn);

console.log(curried('a')('b', 5)); // ["a", "b", 5]
```

### Generics

`curriable` will produce a new function that can extra the arguments and return value from the function passed, however
a known gap in TS is that doing so will widen any types narrowed by the use of generics.

```ts
const fn = <T extends number | string>(t: T, exact: boolean): T;
const curried = curry(fn);
const foo = curried('foo')(true); // `foo` is `number|string` instead of just `string`
```

This is intrinsic to TS as a language, so unfortunately it cannot be avoided.

## Benchmarks

All values provided are the number of operations per second (ops/sec) calculated by the
[Benchmark suite](https://benchmarkjs.com/). The same function was curried and tested passing each parameter
individually, passing all at once, and using placeholders.

Benchmarks were performed on an i7 8-core Arch Linux laptop with 16GB of memory using NodeJS version `10.15.0`.

### Passing each parameter in curried calls

| Library       | Operations / second |
| ------------- | ------------------- |
| **curriable** | **4,052,206**       |
| ramda         | 2,423,105           |
| lodash        | 241,736             |

### Passing all parameters in one call

| Library       | Operations / second |
| ------------- | ------------------- |
| **curriable** | **18,106,685**      |
| ramda         | 10,718,796          |
| lodash        | 9,052,257           |

### Using placeholder parameters in curried calls

| Library       | Operations / second |
| ------------- | ------------------- |
| **curriable** | **4,821,329**       |
| ramda         | 2,963,699           |
| lodash        | 336,687             |
