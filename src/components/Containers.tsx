import clsx from "clsx";

export function Container({
  children,
  className,
  outline = false,
}: {
  children: React.ReactNode;
  className?: string;
  outline?: boolean;
}) {
  return (
    <>
      <div
        className={clsx(
          "relative rounded-xl bg-white  forced-colors:outline",
          outline &&
            "shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)]",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
