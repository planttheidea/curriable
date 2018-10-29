export const __: Placeholder =
  typeof Symbol === 'function' ? Symbol('curriable placeholder') : 0xedd1;

/**
 * @function getArgs
 *
 * @description
 * get the complete args with previous placeholders being filled in
 *
 * @param originalArgs the arguments from the previous run
 * @param nextArgs the arguments from the next run
 * @returns the complete list of args
 */
export const getArgs = (
  originalArgs: IArguments,
  nextArgs: IArguments,
): any[] => {
  const length: number = originalArgs.length;
  const nextLength: number = nextArgs.length;
  const args: any[] = new Array(length);

  let nextArgsIndex: number = 0;

  for (let index: number = 0; index < length; index++) {
    args[index] =
      originalArgs[index] === __ && nextArgsIndex < nextLength
        ? nextArgs[nextArgsIndex++]
        : originalArgs[index];
  }

  if (nextArgsIndex < nextLength) {
    for (; nextArgsIndex < nextLength; nextArgsIndex++) {
      args.push(nextArgs[nextArgsIndex]);
    }
  }

  return args;
};

/**
 * @function hasPlaceholder
 *
 * @description
 * determine if any of the arguments are placeholders
 *
 * @param args the args passed to the function
 * @param arity the arity of the function
 * @returns are any of the args placeholders
 */
export const hasPlaceholder = (args: IArguments, arity: number): boolean => {
  for (let index: number = 0; index < arity; index++) {
    if (args[index] === __) {
      return true;
    }
  }

  return false;
};
