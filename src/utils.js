/**
 * @constant {Symbol} __ the value to be used as a placeholder
 */
export const __ = typeof Symbol === 'function' ? Symbol('curriable placeholder') : 0xedd1;

/**
 * @function getArgs
 *
 * @description
 * get the complete args with previous placeholders being filled in
 *
 * @param {Arguments} originalArgs the arguments from the previous run
 * @param {Arguments} nextArgs the arguments from the next run
 * @returns {Array<*>} the complete list of args
 */
export const getArgs = (originalArgs, nextArgs) => {
  let argsToPass = new Array(originalArgs.length),
      nextArgsIndex = 0;

  for (let index = 0; index < originalArgs.length; index++) {
    argsToPass[index] =
      originalArgs[index] === __ && nextArgsIndex < nextArgs.length ? nextArgs[nextArgsIndex++] : originalArgs[index];
  }

  if (nextArgsIndex < nextArgs.length) {
    for (; nextArgsIndex < nextArgs.length; nextArgsIndex++) {
      argsToPass.push(nextArgs[nextArgsIndex]);
    }
  }

  return argsToPass;
};

/**
 * @function hasPlaceholder
 *
 * @description
 * determine if any of the arguments are placeholders
 *
 * @param {Arguments} args the args passed to the function
 * @param {number} arity the arity of the function
 * @returns {boolean} are any of the args placeholders
 */
export const hasPlaceholder = (args, arity) => {
  for (let index = 0; index < arity; index++) {
    if (args[index] === __) {
      return true;
    }
  }

  return false;
};
