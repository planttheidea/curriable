import type { Placeholder } from './placeholder.js';

type TupleOf<S extends number, V = undefined, A extends unknown[] = []> = S extends A['length']
  ? A
  : TupleOf<S, V, [...A, V]>;

export type TupleLength<A extends unknown[]> = A extends unknown
  ? number extends A['length']
    ? never
    : A['length']
  : never;

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
    ? Placeholder.Value extends AHead
      ? [EHead, ...RemainingParameters<ATail, ETail>]
      : RemainingParameters<ATail, ETail>
    : []
  : ExpectedParams;

export type NormalizeFn<Fn extends (...args: any[]) => any, Arity extends number> = Fn extends (
  ...args: infer Args
) => infer Result
  ? number extends Parameters<Fn>['length']
    ? (...args: TupleOf<Arity, Args[number]>) => Result
    : Fn
  : Fn;

export type CurriedFn<Fn extends (...args: any[]) => any, Arity extends number> = <
  AppliedParams extends RequiredFirstParam<Fn, Arity>,
>(
  ...args: AppliedParams
) => RemainingParameters<AppliedParams, Initial<Parameters<Fn>, Arity>> extends [unknown, ...unknown[]]
  ? CurriedFn<
      (...args: RemainingParameters<AppliedParams, DefaultableParams<Parameters<Fn>, Arity>>) => ReturnType<Fn>,
      Arity
    >
  : ReturnType<Fn>;

export type Curried<Fn extends (...args: any[]) => any, Arity extends number = TupleLength<Parameters<Fn>>> = CurriedFn<
  Fn,
  Arity
> & {
  arity: Arity;
  fn: Fn;
};
