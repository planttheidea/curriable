// utils
import { __, recursiveCurry } from './utils';

export { __ };

/**
 * @function curry
 *
 * @description
 * get the method passed as a curriable method based on its parameters
 *
 * @param fn the method to make curriable
 * @param arity the arity of the curried method
 * @returns the fn passed as a curried function
 */
export const curry = (
  fn: Function,
  arity: number = fn.length,
): CurriedFunction => {
  const curried = recursiveCurry(fn, arity, []);

  curried.arity = arity;
  curried.fn = fn;

  return curried;
};

curry.__ = __;

/**
 * @function uncurry
 *
 * @description
 * return a function that is the non-curried version of the fn passed
 *
 * @param curried the curried function to uncurry
 * @returns the original fn
 */
export const uncurry = (curried: CurriedFunction): Function => curried.fn;

curry.uncurry = uncurry;

export default curry;
