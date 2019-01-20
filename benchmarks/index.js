"use strict";

const assert = require("assert");

const _ = require("lodash");
const fs = require("fs");

const { createSuite } = require("benchee");
const Table = require("cli-table2");

const lodash = _.curry;
const lodash__ = lodash.placeholder;
const { __: ramda__, curry: ramda } = require("ramda");
const { __: curriable__, curry: curriable } = require("../dist/curriable");

const fn = (a, b, c, d) => [a, b, c, d];

const a = "a";
const b = "b";
const c = "c";
const d = "d";

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

testMethod({
  method: curriable(fn),
  name: "curriable",
  placeholder: curriable__
});

testMethod({
  method: lodash(fn),
  name: "lodash",
  placeholder: lodash__
});

testMethod({
  method: ramda(fn),
  name: "ramda",
  placeholder: ramda__
});

const getResults = results => {
  const table = new Table({
    head: ["Name", "Ops / sec"]
  });

  results.forEach(({ name, stats }) => {
    table.push([name, stats.ops.toLocaleString()]);
  });

  return table.toString();
};

const suite = createSuite({
  onGroupComplete({ group, results }) {
    console.log("");
    console.log(`...finished group ${group}.`);
    console.log("");
    console.log(getResults(results));
    console.log("");
  },
  onGroupStart(group) {
    console.log("");
    console.log(`Starting benchmarks for group ${group}...`);
    console.log("");
  },
  minTime: 3000,
  onResult({ name, stats }) {
    console.log(
      `Benchmark completed for ${name}: ${stats.ops.toLocaleString()} ops/sec`
    );
  }
});

/* ------------ CURRIED PARAMETERS ------------ */

const curriedParameters = {
  curriable: curriable(fn),
  lodash: lodash(fn),
  ramda: ramda(fn)
};

for (let name in curriedParameters) {
  const fn = curriedParameters[name];

  suite.add(name, "curried parameters", () => {
    fn(a)(b)(c)(d);
  });
}

/* ------------ ALL PARAMETERS ------------ */

const allParameters = {
  curriable: curriable(fn),
  lodash: lodash(fn),
  ramda: ramda(fn)
};

for (let name in allParameters) {
  const fn = allParameters[name];

  suite.add(name, "all parameters", () => {
    fn(a, b, c, d);
  });
}

/* ------------ PLACEHOLDER PARAMETERS ------------ */

const placeholderParameters = {
  curriable: curriable(fn),
  lodash: lodash(fn),
  ramda: ramda(fn)
};

const placeholders = {
  curriable: curriable__,
  lodash: lodash__,
  ramda: ramda__
};

for (let name in placeholderParameters) {
  const fn = placeholderParameters[name];
  const placeholder = placeholders[name];

  suite.add(name, "placeholder parameters", () => {
    fn(a, placeholder, c, placeholder)(b)(d);
  });
}

suite.run();
