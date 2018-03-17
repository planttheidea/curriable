// test
import test from 'ava';

// src
import * as utils from 'src/utils';

test('if getArgs determines the complete args to pass when there are no remaining args after the placeholder', (t) => {
  const originalArgs = [1, utils.__, 3];
  const futureArgs = [2];

  const result = utils.getArgs(originalArgs, [...futureArgs]);
  const expectedResult = originalArgs.map((arg) => {
    return arg !== utils.__ ? arg : futureArgs.shift();
  });

  t.deepEqual(result, expectedResult);
});

test('if getArgs determines the complete args to pass when there are remaining args after the placeholder', (t) => {
  const originalArgs = [1, utils.__, 3];
  const futureArgs = [2, 4];

  const result = utils.getArgs(originalArgs, [...futureArgs]);
  const expectedResult = originalArgs
    .map((arg) => {
      return arg !== utils.__ ? arg : futureArgs.shift();
    })
    .concat(futureArgs);

  t.deepEqual(result, expectedResult);
});

test('if hasPlaceholder returns true if args has a placeholder in it', (t) => {
  const args = [1, utils.__, 2];
  const arity = 3;

  t.true(utils.hasPlaceholder(args, arity));
});

test('if hasPlaceholder returns false if no placeholders exist', (t) => {
  const args = [1, 2, 3];
  const arity = 3;

  t.false(utils.hasPlaceholder(args, arity));
});
