import { __, curry, uncurry } from '../src/index.js';
// import '../benchmarks/index.js';

const fn = (foo: string, bar: string, baz: string): string[] => [foo, bar, baz];

const curriedFn = curry(fn);
const uncurriedFn = uncurry(curriedFn);

console.group('standard');

console.log(curriedFn('foo', 'bar', 'baz'));
console.log(curriedFn('foo')('bar')('baz'));
console.log(curriedFn('foo', __)('bar', 'baz'));
console.log(curriedFn(__)('foo', 'bar')('baz'));
console.log(curriedFn(__, __)(__)('foo')(__)('bar')('baz'));
console.log(curriedFn(__, 'bar')(__, 'baz')('foo'));

console.groupEnd();

console.group('limited arity');

const curriedLimitedFn = curry(fn, 2);
const result = curriedLimitedFn('foo', 'bar');

console.log(result);
console.log(curriedLimitedFn('foo', 'bar', 'baz'));
console.log(curriedLimitedFn('foo')('bar'));
console.log(curriedLimitedFn('foo')('bar', 'baz'));
console.log(curriedLimitedFn('foo', __)('bar'));
console.log(curriedLimitedFn('foo', __)('bar', 'baz'));
console.log(curriedLimitedFn(__)('foo')('bar'));
console.log(curriedLimitedFn(__)('foo')('bar', 'baz'));
console.log(curriedLimitedFn(__, __)(__)('foo')(__)('bar'));
console.log(curriedLimitedFn(__, __)(__)('foo')(__)('bar', 'baz'));

console.groupEnd();

console.group('rest arity');

const restFn = (...args: any[]) => [[args[0]]] as const;

const curriedRestFn = curry(restFn, 3);
const curriedRestResult = curriedRestFn('foo')('bar');

console.log(curriedRestFn('foo')('bar'));
console.log(curriedRestResult('baz'));

console.groupEnd();

console.group('uncurried');

const uncurriedRestFn = uncurry(curriedRestFn);

console.log(uncurriedFn('foo', 'bar', 'baz'));
console.log(uncurriedRestFn('foo', 'bar', 'baz'));

console.groupEnd();
