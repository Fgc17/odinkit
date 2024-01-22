export function If<T>({
  if: condition,
  then,
  else: _else,
}: {
  if: T;
  then: React.ReactNode;
  else?: React.ReactNode;
}) {
  return <>{Boolean(condition) ? then : _else}</>;
}
