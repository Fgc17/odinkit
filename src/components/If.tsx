import { ReactNode } from "react";

type Defined<T> = T extends null | undefined ? never : T;

export function If<
  T,
  DepKey extends string,
  DepValue extends ReactNode,
  DefinedDeps extends Record<DepKey, Defined<DepValue>>,
>({
  if: condition,
  then,
  else: _else = null,
  deps,
}: {
  if: T | ((deps: Record<DepKey, DepValue>) => T);
  then: React.ReactNode | ((deps: DefinedDeps) => React.ReactNode);
  else?: React.ReactNode | ((deps: DefinedDeps) => React.ReactNode);
  deps?: Record<DepKey, DepValue>;
}) {
  const _condition =
    typeof condition === "function"
      ? Boolean(
          (condition as Function)(deps as any as Record<DepKey, DepValue>)
        )
      : Boolean(condition);

  return (
    <>
      {_condition
        ? typeof then === "function"
          ? then(deps as any as DefinedDeps)
          : then
        : typeof _else === "function"
          ? _else(deps as any as DefinedDeps)
          : _else}
    </>
  );
}
