import {__, curry} from '../src';

const fn = (foo, bar) => {
  return [foo, bar];
};

const curriedFn = curry(fn);

console.log(curriedFn('foo', 'bar'));
console.log(curriedFn('foo')('bar'));
console.log(curriedFn('foo', __)('bar'));
console.log(curriedFn(__)('foo')('bar'));
console.log(curriedFn(__, __)(__)('foo')(__)('bar'));

const limitedFn = (foo, bar, baz) => {
  return [foo, bar, baz];
};

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

const restFn = (...args) => {
  return args;
};

const curriedRestFn = curry(restFn, 3);

console.log(curriedRestFn('foo')('bar')('baz'));

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);
