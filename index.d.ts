declare const enum Placeholder {
  Value = '<<\u200BCURRIABLE PLACEHOLDER\u200B>>',
}
declare const __ = Placeholder.Value;

type TupleOf<S extends number, V = undefined, A extends unknown[] = []> = S extends A['length']
  ? A
  : TupleOf<S, V, [...A, V]>;
type TupleLength<A extends unknown[]> = A extends unknown ? (number extends A['length'] ? never : A['length']) : never;
type DefaultableParams<Params extends unknown[], Arity extends number, Defaultable extends unknown[] = []> =
  Initial<Params, Arity> extends [infer H, ...infer T]
    ? DefaultableParams<T, Arity, [...Defaultable, H | Placeholder]>
    : Defaultable;
type Initial<A extends unknown[], S extends number, I extends unknown[] = []> =
  S extends TupleLength<I> ? I : A extends [infer H, ...infer T] ? Initial<T, S, [...I, H]> : I;
type RequiredFirstParam<Fn extends (...args: any[]) => any, Arity extends number> =
  Initial<Parameters<Fn>, Arity> extends [infer Head, ...infer Tail]
    ? [Head | Placeholder.Value, ...Partial<Tail>]
    : [];
type RemainingParameters<AppliedParams extends unknown[], ExpectedParams extends unknown[]> = AppliedParams extends [
  infer AHead,
  ...infer ATail,
]
  ? ExpectedParams extends [infer EHead, ...infer ETail]
    ? AHead extends Placeholder.Value
      ? [EHead, ...RemainingParameters<ATail, ETail>]
      : RemainingParameters<ATail, ETail>
    : []
  : ExpectedParams;
type NormalizeFn<Fn extends (...args: any[]) => any, Arity extends number> = Fn extends (
  ...args: infer Args
) => infer Result
  ? number extends Parameters<Fn>['length']
    ? (...args: TupleOf<Arity, Args[number]>) => Result
    : Fn
  : Fn;
type CurriedFn<Fn extends (...args: any[]) => any, Arity extends number> = <
  AppliedParams extends RequiredFirstParam<Fn, Arity>,
>(
  ...args: [...AppliedParams, ...extraArgs: unknown[]]
) => RemainingParameters<AppliedParams, Initial<Parameters<Fn>, Arity>> extends [unknown, ...unknown[]]
  ? CurriedFn<
      (...args: RemainingParameters<AppliedParams, DefaultableParams<Parameters<Fn>, Arity>>) => ReturnType<Fn>,
      Arity
    >
  : ReturnType<Fn>;
type Curried<
  Fn extends (...args: any[]) => any,
  NormalizedFn extends (...args: any[]) => any,
  Arity extends number = TupleLength<Parameters<Fn>>,
> = CurriedFn<NormalizedFn, Arity> & {
  arity: Arity;
  fn: Fn;
};

/**
 * Get the method passed as a curriable method based on its parameters
 */
declare function curry<Fn extends (...args: any[]) => any, Arity extends number = Parameters<Fn>['length']>(
  fn: Fn,
  arityOverride?: Arity,
): number extends Arity ? never : Curried<Fn, NormalizeFn<Fn, Arity>, Arity>;
/**
 * Return a function that is the non-curried version of the fn passed.
 */
declare function uncurry<CurriedFn extends Curried<(...args: any[]) => any, (...args: any[]) => any, number>>(
  curried: CurriedFn,
): CurriedFn['fn'];

export { __, curry, uncurry };
