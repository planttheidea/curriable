import {__, curry, uncurry} from '../src';

console.group('standard');

const fn = (foo, bar, baz) => [foo, bar, baz];

const curriedFn = curry(fn);
const uncurriedFn = uncurry(curriedFn);

console.log(curriedFn('foo', 'bar', 'baz'));
console.log(curriedFn('foo')('bar')('baz'));
console.log(curriedFn('foo', __)('bar', 'baz'));
console.log(curriedFn(__)('foo', 'bar')('baz'));
console.log(curriedFn(__, __)(__)('foo')(__)('bar')('baz'));
console.log(curriedFn(__, 'bar')(__, 'baz')('foo'));

console.groupEnd('standard');

console.group('limited arity');

const limitedFn = (foo, bar, baz) => [foo, bar, baz];

const curriedLimitedFn = curry(limitedFn, 2);

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

console.groupEnd('limited arity');

console.group('rest arity');

const restFn = (...args) => args;

const curriedRestFn = curry(restFn, 3);

console.log(curriedRestFn('foo')('bar')('baz'));

console.groupEnd('rest arity');

console.group('uncurried');

console.log(uncurriedFn('foo'));
console.log(uncurriedFn('foo', 'bar'));
console.log(uncurriedFn('foo', 'bar', 'baz'));
console.log(uncurriedFn('foo', 'bar', 'baz', 'quz'));

console.groupEnd('uncurried');

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);
