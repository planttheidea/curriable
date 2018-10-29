type Placeholder = Symbol | number;

interface CurriedFunction {
  (...args: any[]): any;

  arity: number;
  fn: Function;
}
