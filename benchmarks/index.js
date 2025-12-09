import assert from 'node:assert';
import fs from 'node:fs';
import Table from 'cli-table3';
import _ from 'lodash';
import { __ as ramda__, curry as ramda } from 'ramda';
import { Bench } from 'tinybench';
import { __ as curriable__, curry as curriable } from '../dist/es/index.mjs';

const lodash = _.curry;
const lodash__ = lodash.placeholder;

const fn = (a, b, c, d) => [a, b, c, d];

const a = 'a';
const b = 'b';
const c = 'c';
const d = 'd';

const testMethod = ({ method, name, placeholder }) => {
  const expectedResult = [a, b, c, d];

  try {
    assert.deepEqual(method(a)(b)(c)(d), expectedResult);
    assert.deepEqual(method(a, b, c, d), expectedResult);
    assert.deepEqual(method(a, placeholder, c, placeholder)(b)(d), expectedResult);

    console.log(`${name} passed all checks.`);
  } catch (error) {
    console.error(`${name} failed: ${error.message}`);
  }
};

console.log('');

testMethod({
  method: curriable(fn),
  name: 'curriable',
  placeholder: curriable__,
});

testMethod({
  method: lodash(fn),
  name: 'lodash',
  placeholder: lodash__,
});

testMethod({
  method: ramda(fn),
  name: 'ramda',
  placeholder: ramda__,
});

const getResults = (tasks) => {
  const results = _.orderBy(
    tasks.filter(({ result }) => result),
    ({ result }) => result.throughput?.mean ?? 0,
    ['desc'],
  );
  const table = new Table({
    head: ['Name', 'Ops / sec'],
  });

  results.forEach(({ name, result }) => {
    table.push([name, +result.throughput.mean.toFixed(6)]);
  });

  return table.toString();
};

const packages = {
  curriable: curriable,
  lodash: lodash,
  ramda: ramda,
};

const parameters = {
  curried: [[a], [b], [c], [d]],
  all: [[a, b, c, d]],
  placeholder: (placeholder) => [[a, placeholder, b, placeholder], [c], [d]],
};

const placeholders = {
  curriable: curriable__,
  lodash: lodash__,
  ramda: ramda__,
};

const BENCH_OPTIONS = { iterations: 1000, time: 500 };

async function runCurriedParameters() {
  for (const type in parameters) {
    const args = parameters[type];

    console.log('');
    console.log(`Testing ${type} arguments...`);

    const bench = new Bench(BENCH_OPTIONS);

    for (const name in packages) {
      const pkg = packages[name];
      const method = pkg(fn);

      if (type === 'placeholder') {
        const argsWithPlaceholder = args(placeholders[name]);

        bench.add(name, () => {
          let result;

          for (const arg of argsWithPlaceholder) {
            result = method(...arg);
          }
        });
      } else {
        bench.add(name, () => {
          let result;

          for (const arg of args) {
            result = method(...arg);
          }
        });
      }

      await bench.run();
    }

    console.log(getResults(bench.tasks));
    console.log(`Fastest was "${bench.tasks[0].name}".`);
  }
}

await runCurriedParameters();

// const suite = createSuite({
//   onGroupComplete({ group, results }) {
//     console.log('');
//     console.log(`...finished group ${group}.`);
//     console.log('');
//     console.log(getResults(results));
//     console.log('');
//   },
//   onGroupStart(group) {
//     console.log('');
//     console.log(`Starting benchmarks for group ${group}...`);
//     console.log('');
//   },
//   minTime: 3000,
//   onResult({ name, stats }) {
//     console.log(`Benchmark completed for ${name}: ${stats.ops.toLocaleString()} ops/sec`);
//   },
// });

// /* ------------ CURRIED PARAMETERS ------------ */

// const curriedParameters = {
//   curriable: curriable(fn),
//   lodash: lodash(fn),
//   ramda: ramda(fn),
// };

// for (let name in curriedParameters) {
//   const fn = curriedParameters[name];

//   suite.add(name, 'curried parameters', () => {
//     fn(a)(b)(c)(d);
//   });
// }

// /* ------------ ALL PARAMETERS ------------ */

// const allParameters = {
//   curriable: curriable(fn),
//   lodash: lodash(fn),
//   ramda: ramda(fn),
// };

// for (let name in allParameters) {
//   const fn = allParameters[name];

//   suite.add(name, 'all parameters', () => {
//     fn(a, b, c, d);
//   });
// }

// /* ------------ PLACEHOLDER PARAMETERS ------------ */

// const placeholderParameters = {
//   curriable: curriable(fn),
//   lodash: lodash(fn),
//   ramda: ramda(fn),
// };

// const placeholders = {
//   curriable: curriable__,
//   lodash: lodash__,
//   ramda: ramda__,
// };

// for (let name in placeholderParameters) {
//   const fn = placeholderParameters[name];
//   const placeholder = placeholders[name];

//   suite.add(name, 'placeholder parameters', () => {
//     fn(a, placeholder, c, placeholder)(b)(d);
//   });
// }

// suite.run();
