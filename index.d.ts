type Placeholder = Symbol | number;

interface CurriedFunction {
  (...args: any[]): any;

  arity: number;
  fn: Function;
}

export const __: Placeholder;

export function curry(fn: Function, arity?: number): CurriedFunction;

declare interface curry {
  arity: number;
  fn: Function;
}

export function uncurry(fn: CurriedFunction): Function;

export default curry;
