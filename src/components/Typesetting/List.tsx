import clsx from "clsx";

export function List({
  data,
  className,
  children,
}: {
  data: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const parsedData = JSON.parse(data);

  return (
    <ul role="list" className={clsx("list-disc", className)}>
      {(Array.isArray(parsedData) ? parsedData : [parsedData]).map(
        (element: string, index: number) => (
          <li key={index}>{element}</li>
        )
      )}
    </ul>
  );
}
