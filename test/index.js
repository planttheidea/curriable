// test
import test from 'ava';

// src
import * as curriable from 'src/index';

test('if all required exports are present', (t) => {
  t.true(curriable.hasOwnProperty('default'));
  t.is(typeof curriable.default, 'function');
  t.is(curriable.default.name, 'curry');

  t.true(curriable.hasOwnProperty('__'));
  t.is(typeof curriable.__, 'symbol');
  t.is(curriable.__.toString(), 'Symbol(curriable placeholder)');

  t.true(curriable.hasOwnProperty('curry'));
  t.is(typeof curriable.curry, 'function');
  t.is(curriable.curry.name, 'curry');
  t.true(curriable.curry.hasOwnProperty('__'));
  t.is(curriable.curry.__, curriable.__);
});

test('if curry will make a function curriable', (t) => {
  const method = (a, b) => {
    return [a, b];
  };

  const curriedMethod = curriable.curry(method);

  t.is(typeof curriedMethod, 'function');

  const a = 'a';
  const b = 'b';

  const curriedResult = curriedMethod(a);

  t.is(typeof curriedMethod, 'function');

  const result = curriedResult(b);

  t.deepEqual(result, [a, b]);
});

test('if curry will make a function curriable based on a custom arity', (t) => {
  const method = (a, b, ...rest) => {
    return [a, b, ...rest];
  };

  const curriedMethod = curriable.curry(method, 4);

  t.is(typeof curriedMethod, 'function');

  const a = 'a';
  const b = 'b';
  const c = 'c';
  const d = 'd';

  const curriedAResult = curriedMethod(a);

  t.is(typeof curriedMethod, 'function');

  const curriedBResult = curriedAResult(b);

  t.is(typeof curriedBResult, 'function');

  const curriedCResult = curriedBResult(c);

  t.is(typeof curriedCResult, 'function');

  const curriedDResult = curriedCResult(d);

  t.deepEqual(curriedDResult, [a, b, c, d]);
});
