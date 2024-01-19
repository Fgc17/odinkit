import clsx from "clsx";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={clsx(
          "relative rounded-xl  bg-white     shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] forced-colors:outline",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
