export function If<T>({
  if: condition,
  then,
  else: _else = null,
}: {
  if: T;
  then: React.ReactNode;
  else?: React.ReactNode;
}) {
  return <>{Boolean(condition) ? then : _else}</>;
}
