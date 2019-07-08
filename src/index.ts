// utils
import { __, getCurried } from './utils';

export { __ };

/**
 * @function curry
 *
 * @description
 * get the method passed as a curriable method based on its parameters
 *
 * @param fn the method to make curriable
 * @param arityOverride the hard-coded arity of the curried method
 * @returns the fn passed as a curried function
 */
export function curry<Fn extends Handler>(fn: Fn): Curried<Fn>;
export function curry<Fn extends Handler>(fn: Fn, arityOverride: number): Handler;
export function curry<Fn extends Handler>(fn: Fn, arityOverride?: number) {
  const arity = typeof arityOverride === 'number' ? arityOverride : fn.length;
  const curried = getCurried(fn, arity) as Curried<Fn>;

  curried.arity = arity;
  curried.fn = fn;

  return curried;
}

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
export function uncurry<Fn extends Handler>(curried: Curried<Fn>): Fn {
  return curried.fn;
}

curry.uncurry = uncurry;

export default curry;
