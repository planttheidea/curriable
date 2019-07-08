type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;

type Tail<T extends any[]> = ((...t: T) => any) extends ((_: any, ...tail: infer TT) => any)
  ? TT
  : [];

type HasTail<T extends any[]> = T extends ([] | [any]) ? false : true;

type Last<T extends any[]> = {
  0: Last<Tail<T>>;
  1: Head<T>;
}[HasTail<T> extends true ? 0 : 1];

type Length<T extends any[]> = T['length'];

type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends ((
  ...args: infer U
) => any)
  ? U
  : T;

type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>;
  1: T;
}[Length<I> extends N ? 1 : 0];

type Cast<X, Y> = X extends Y ? X : Y;

type Pos<I extends any[]> = Length<I>;

type Next<I extends any[]> = Prepend<any, I>;

type Prev<I extends any[]> = Tail<I>;

type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = {
  0: Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>;
  1: R;
}[Pos<I> extends Length<T> ? 1 : 0];

type Concat<T1 extends any[], T2 extends any[]> = Reverse<
  Reverse<T1> extends infer R ? Cast<R, any[]> : never,
  T2
>;

type Append<E, T extends any[]> = Concat<T, [E]>;

type GapOf<T1 extends any[], T2 extends any[], TN extends any[], I extends any[]> = T1[Pos<
  I
>] extends Placeholder
  ? Append<T2[Pos<I>], TN>
  : TN;

type GapsOf<T1 extends any[], T2 extends any[], TN extends any[] = [], I extends any[] = []> = {
  0: GapsOf<T1, T2, GapOf<T1, T2, TN, I> extends infer G ? Cast<G, any[]> : never, Next<I>>;
  1: Concat<TN, Drop<Pos<I>, T2> extends infer D ? Cast<D, any[]> : never>;
}[Pos<I> extends Length<T1> ? 1 : 0];

type PartialGaps<T extends any[]> = { [K in keyof T]?: T[K] | Placeholder };

type CleanedGaps<T extends any[]> = { [K in keyof T]: NonNullable<T[K]> };

type Gaps<T extends any[]> = CleanedGaps<PartialGaps<T>>;

type Curry<F extends Handler> = <T extends any[]>(
  ...args: Cast<Cast<T, Gaps<Parameters<F>>>, any[]>
) => GapsOf<T, Parameters<F>> extends [any, ...any[]]
  ? Curry<
      (...args: GapsOf<T, Parameters<F>> extends infer G ? Cast<G, any[]> : never) => ReturnType<F>
    >
  : ReturnType<F>;

export type Placeholder = Symbol | number;

export const __: Placeholder;

export type Handler = (...args: any[]) => any;

export type Curried<Fn extends Handler> = Curry<Fn> & {
  arity: number;
  fn: Fn;
};

export function curry<Fn extends Handler>(fn: Fn): Curried<Fn>;
export function curry<Fn extends Handler>(fn: Fn, arityOverride: number): Handler;

export function isPlaceholder(value: any): value is Placeholder;

export function uncurry<Fn extends Handler>(curried: Curried<Fn>): Fn;

export default curry;
