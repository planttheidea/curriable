export const enum Placeholder {
  Value = '<<\u200bCURRIABLE PLACEHOLDER\u200b>>',
}

export const __ = Placeholder.Value;

/**
 * Whether the value passed is a placeholder.
 */
export function isPlaceholder(value: any): value is Placeholder {
  return value === __;
}
