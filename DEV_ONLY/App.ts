import { __, curry, uncurry } from '../src';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0px';
document.body.style.padding = '0px';

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);

// import '../benchmarks';

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

console.log(curriedLimitedFn('foo', 'bar'));
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

const restFn = (...args: any[]) => args;

const curriedRestFn = curry(restFn, 3);

console.log(curriedRestFn('foo')('bar')('baz'));

console.groupEnd();

console.group('uncurried');

console.log(uncurriedFn('foo'));
console.log(uncurriedFn('foo', 'bar'));
console.log(uncurriedFn('foo', 'bar', 'baz'));
console.log(uncurriedFn('foo', 'bar', 'baz', 'quz'));

console.groupEnd();
