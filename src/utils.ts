/**
 * @constant __ placeholder used when parameters are skipped
 */
export const __: Placeholder =
  typeof Symbol === 'function' ? Symbol('curriable placeholder') : 0xedd1;

/**
 * @function recursiveCurry
 *
 * @description
 * recursively curry over the arguments until all have been resolved
 *
 * @param fn the function to curry
 * @param arity the length of the function to curry until
 * @param args the existing arguments
 * @returns the result of the function call
 */
export const recursiveCurry: Function = (
  fn: Function,
  arity: number,
  args: any[],
): any =>
  function () {
    const length: number = args.length;

    const newArgs: IArguments = arguments;
    const newArgsLength: number = newArgs.length;

    const combined: any[] = [];

    let newArgsIndex: number = 0;
    let remaining: number = arity;
    let value: any;

    for (let index: number = 0; index < length; index++) {
      value = combined[index] =
        args[index] === __ && newArgsIndex < newArgsLength
          ? newArgs[newArgsIndex++]
          : args[index];

      if (value !== __) {
        --remaining;
      }
    }

    if (newArgsIndex < newArgsLength) {
      for (; newArgsIndex < newArgsLength; newArgsIndex++) {
        value = newArgs[newArgsIndex];

        combined.push(value);

        if (value !== __ && newArgsIndex < arity) {
          --remaining;
        }
      }
    }

    return remaining > 0
      ? recursiveCurry(fn, arity, combined)
      : fn.apply(this, combined);
  };
