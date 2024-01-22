import clsx from "clsx";
import { ReactNode } from "react";

export function List(props: { data: ReactNode[]; className?: string }) {
  return (
    <ul role="list" className={clsx("list-disc", props.className)}>
      {props.data.map((element: ReactNode, index: number) => (
        <li key={index}>{element}</li>
      ))}
    </ul>
  );
}
