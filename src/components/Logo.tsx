import Image from "next/image";

export function Logo({
  fill,
  className,
  url,
}: {
  size?: number;
  fill?: boolean;

  className?: string;
  url?: string;
}) {
  return (
    <Image
      fill={true}
      className={className}
      src={url || "/logo.jpg"}
      alt="Logo"
    />
  );
}
