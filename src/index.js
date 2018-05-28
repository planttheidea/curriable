// utils
import {__, getArgs, hasPlaceholder} from './utils';

export {__};

/**
 * @function curry
 *
 * @description
 * get the method passed as a curriable method based on its parameters
 *
 * @param {function} fn the method to make curriable
 * @param {number} [arity=fn.length] the arity of the curried method
 * @returns {function(...Array<any>): any} the fn passed as a curried function
 */
export function curry(fn, arity = fn.length) {
  function curried() {
    const args = arguments;

    return args.length >= arity && !hasPlaceholder(args, arity)
      ? fn.apply(this, args)
      : function() {
        return curried.apply(this, getArgs(args, arguments));
      };
  }

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
 * @param {function} curried the curried function to uncurry
 * @returns {function} the original fn
 */
export function uncurry(curried) {
  return curried.fn;
}

curry.uncurry = uncurry;

export default curry;
