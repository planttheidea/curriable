"use strict";

const assert = require("assert");

const _ = require("lodash");
const fs = require("fs");

const Benchmark = require("benchmark");
const Table = require("cli-table2");
const ora = require("ora");

const lodash = _.curry;
const lodash__ = lodash.placeholder;
const { __: ramda__, curry: ramda } = require("ramda");
const { __: curriable__, curry: curriable } = require("../dist/curriable");

const showResults = benchmarkResults => {
  const table = new Table({
    head: ["Name", "Ops / sec", "Relative margin of error", "Sample size"]
  });

  benchmarkResults.forEach(result => {
    const name = result.target.name;
    const opsPerSecond = result.target.hz.toLocaleString("en-US", {
      maximumFractionDigits: 0
    });
    const relativeMarginOferror = `± ${result.target.stats.rme.toFixed(2)}%`;
    const sampleSize = result.target.stats.sample.length;

    table.push([name, opsPerSecond, relativeMarginOferror, sampleSize]);
  });

  console.log(table.toString()); // eslint-disable-line no-console
};

const sortDescResults = benchmarkResults => {
  return benchmarkResults.sort((a, b) => {
    return a.target.hz < b.target.hz ? 1 : -1;
  });
};

const spinner = ora("Running benchmark");

let cliResults = [],
  csvResults = {};

const onCycle = event => {
  cliResults.push(event);

  const { currentTarget, target } = event;

  if (!csvResults[currentTarget.name]) {
    csvResults[currentTarget.name] = {};
  }

  csvResults[currentTarget.name][target.name] = ~~event.target.hz;

  ora(target.name).succeed();
};

const onComplete = () => {
  spinner.stop();

  const orderedBenchmarkResults = sortDescResults(cliResults);

  showResults(orderedBenchmarkResults);
};

const fn = (a, b, c, d) => {
  return [a, b, c, d];
};

const curryCurriable = curriable(fn);
const curryLodash = lodash(fn);
const curryRamda = ramda(fn);

const a = "a";
const b = "b";
const c = "c";
const d = "d";

const runCurriedParamsSuite = () => {
  return new Promise(resolve => {
    new Benchmark.Suite({
      name: "curried parameters",
      onComplete() {
        onComplete();
        resolve();
      },
      onCycle,
      onStart() {
        console.log(""); // eslint-disable-line no-console
        console.log(`Starting cycles for curried parameters...`); // eslint-disable-line no-console

        cliResults = [];

        spinner.start();
      },
      queued: true
    })
      .add("curriable", () => {
        curryCurriable(a)(b)(c)(d);
      })
      .add("lodash", () => {
        curryLodash(a)(b)(c)(d);
      })
      .add("ramda", () => {
        curryRamda(a)(b)(c)(d);
      })
      .run({ async: true });
  });
};

const runAllParamsSuite = () => {
  return new Promise(resolve => {
    new Benchmark.Suite({
      name: "all parameters",
      onComplete() {
        onComplete();
        resolve();
      },
      onCycle,
      onStart() {
        console.log(""); // eslint-disable-line no-console
        console.log(`Starting cycles for all parameters...`); // eslint-disable-line no-console

        cliResults = [];

        spinner.start();
      },
      queued: true
    })
      .add("curriable", () => {
        curryCurriable(a, b, c, d);
      })
      .add("lodash", () => {
        curryLodash(a, b, c, d);
      })
      .add("ramda", () => {
        curryRamda(a, b, c, d);
      })
      .run({ async: true });
  });
};

const runPlaceholderParamsSuite = () => {
  return new Promise(resolve => {
    new Benchmark.Suite({
      name: "all parameters",
      onComplete() {
        onComplete();
        resolve();
      },
      onCycle,
      onStart() {
        console.log(""); // eslint-disable-line no-console
        console.log(`Starting cycles for placeholder parameters...`); // eslint-disable-line no-console

        cliResults = [];

        spinner.start();
      },
      queued: true
    })
      .add("curriable", () => {
        curryCurriable(a, curriable__, c, curriable__)(b)(d);
      })
      .add("lodash", () => {
        curryLodash(a, lodash__, c, lodash__)(b)(d);
      })
      .add("ramda", () => {
        curryRamda(a, ramda__, c, ramda__)(b)(d);
      })
      .run({ async: true });
  });
};

const testMethod = ({ method, name, placeholder }) => {
  const expectedResult = [a, b, c, d];

  try {
    assert.deepEqual(method(a)(b)(c)(d), expectedResult);
    assert.deepEqual(method(a, b, c, d), expectedResult);
    assert.deepEqual(
      method(a, placeholder, c, placeholder)(b)(d),
      expectedResult
    );

    console.log(`${name} passed all checks.`);
  } catch (error) {
    console.error(error);
  }
};

console.log("");

new Promise(resolve => {
  [
    { method: curryCurriable, name: "curriable", placeholder: curriable__ },
    { method: curryLodash, name: "lodash", placeholder: lodash__ },
    { method: curryRamda, name: "ramda", placeholder: ramda__ }
  ].forEach(testMethod);

  resolve();
})
  .then(runCurriedParamsSuite)
  .then(runAllParamsSuite)
  .then(runPlaceholderParamsSuite);
