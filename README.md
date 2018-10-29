# curriable

Curry any function with placeholder support

## Table of contents

- [Summary](#summary)
- [Usage](#usage)
  - [Signature](#signature)
  - [Rest parameters](#rest-parameters)
  - [Default parameters](#default-parameters)
  - [uncurry](#uncurry)
- [Benchmarks](#benchmarks)
  - [Passing each parameter in curried calls](#passing-each-parameter-in-curried-calls)
  - [Passing all parameters in one call](#passing-all-parameters-in-one-call)
  - [Using placeholder parameters in curried calls](#using-placeholder-parameters-in-curried-calls)
- [Development](#development)

## Summary

`curriable` provides a `curry` method that is [highly performant](#benchmarks) with a small footprint (_473 bytes minified+gzipped_). You can call the method with any combination of parameters (one at a time, all at once, or any number in between), and placeholders are supported.

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

```javascript
import curry from "curriable";

const fn = curry((a, b, c) => [a, b, c]);

console.log(fn("a", curry.__, "c")("b")); // ["a", "b", "c"]

const original = curry.uncurry(fn);

console.log(original("a")); // ["a", undefined, undefined]
```

Or the named imports:

```javascript
import { __, curry, uncurry } from "curriable";

const fn = curry((a, b, c) => [a, b, c]);

console.log(fn("a", __, "c")("b")); // ["a", "b", "c"]

const original = uncurry(fn);

console.log(original("a")); // ["a", undefined, undefined]
```

#### Signature

The `curry` method has the following signature:

```javascript
function curry(fn: function, arity: number = fn.length) => function;
```

`arity` defaults to be the length provided by `fn.length`, but be aware this can cause unusual behavior with default parameters or use of rest parameters. [See the documentation on Function.length for more details](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length).

#### Rest parameters

```javascript
console.log(function(...args) {}.length); // 0 arity computed
```

When using rest with curried functions, you should pass a second parameter to explicitly declare the correct `arity`:

```javascript
const fn = (...args) => [a, b, c];
const curried = curry(fn, 3);

console.log(curried("a")("b")("c")); // ["a", "b", "c"]
```

#### Default parameters

```javascript
console.log(function(a, b = 1, c) {}.length); // 1 arity computed
```

Default parameters are very rare use-case with curried functions, but it is possible to trigger them if you declare an explicit `arity` and explicitly pass `undefined` for that parameter:

```javascript
const fn = (a, b = 1, c) => [a, b, c];
const curried = curry(fn, 3);

console.log(curried("a")(undefined)("c")); // ["a", 1, "c"]
```

Yes, this is weird, but it is very difficult (impossible?) to distinguish between a parameter being undefined through not being called yet in the curry chain vs being undefined by not being provided an explicit value. Explicitly passing `undefined` provides that distinction.

#### uncurry

The function `uncurry` is also available on both the default export and as a named export, and this function will return the original (uncurried) `fn` passed to `curry`.

```javascript
const curried = curry((a, b, c) => [a, b, c]);

console.log(curried("a")); // function() {}

const uncurried = uncurry(fn);

console.log(uncurried("a")); // ["a", undefined, undefined]
```

## Benchmarks

All values provided are the number of operations per second (ops/sec) calculated by the [Benchmark suite](https://benchmarkjs.com/). The same function was curried and tested passing each parameter individually, passing all at once, and using placeholders.

Benchmarks were performed on an i7 8-core Arch Linux laptop with 16GB of memory using NodeJS version `8.9.4`.

#### Passing each parameter in curried calls

| Library       | Operations / second | Relative margin of error |
| ------------- | ------------------- | ------------------------ |
| **curriable** | **1,632,076**       | **1.43%**                |
| ramda         | 1,041,570           | 1.15%                    |
| lodash        | 138,685             | 0.88%                    |

#### Passing all parameters in one call

| Library       | Operations / second | Relative margin of error |
| ------------- | ------------------- | ------------------------ |
| **curriable** | **21,517,188**      | **1.36%**                |
| ramda         | 10,064,677          | 0.97%                    |
| lodash        | 8,031,747           | 1.18%                    |

#### Using placeholder parameters in curried calls

| Library       | Operations / second | Relative margin of error |
| ------------- | ------------------- | ------------------------ |
| **curriable** | **2,577,105**       | **1.02%**                |
| ramda         | 1,309,428           | 1.02%                    |
| lodash        | 204,268             | 0.77%                    |

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `benchmark` => run the benchmark suite pitting `curriable` against other libraries in common use-cases
- `build` => run `rollup` to build `dist` files
- `build:types` => create the `index.d.ts` types file
- `clean` => run `rimraf` on the `lib` folder
- `dev` => run webpack dev server to run example app (playground!)
- `lint` => runs `tslint` against all files in the `src` folder
- `lint:fix` => runs `lint``, fixing any errors if possible
- `prepublish` => runs `prepublish:compile`
- `prepublish:compile` => run `lint`, `flow`, `test:coverage`, `transpile:lib`, `transpile:es`, and `dist`
- `test` => run `jest` test functions
- `test:coverage` => run `test`, but with coverage checker
- `test:watch` => run `test`, but with persistent watcher
