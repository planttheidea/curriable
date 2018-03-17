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
 * @returns {function(*): *} the fn passed as a curriable method
 */
export function curry(fn, arity = fn.length) {
  return function curried() {
    const originalArgs = arguments;

    return originalArgs.length >= arity && !hasPlaceholder(originalArgs, arity)
      ? fn.apply(this, originalArgs)
      : function() {
        return curried.apply(this, getArgs(originalArgs, arguments));
      };
  };
}

curry.__ = __;

export default curry;
