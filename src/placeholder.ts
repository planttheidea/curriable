export const enum Placeholder {
  Value = '<<\u200bCURRIABLE PLACEHOLDER\u200b>>',
}

export const __ = Placeholder.Value;

/**
 * Whether the value passed is the curriable placeholder.
 */
export function isPlaceholder<Value>(value: Value): Value extends Placeholder.Value ? true : false {
  return (value === __) as Value extends Placeholder.Value ? true : false;
}
