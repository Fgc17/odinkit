import Image from "next/image";

export default function InstagramIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  // Set the filter based on the provided color prop
  const filter =
    "brightness(0) saturate(100%) invert(48%) sepia(93%) saturate(4329%) hue-rotate(326deg) brightness(93%) contrast(92%)";

  return (
    <div className={className} style={{ width: size, height: size, filter }}>
      <Image
        src="https://simpleicons.org/icons/instagram.svg"
        alt="Instagram"
        width={size}
        height={size}
        layout="fixed"
      />
    </div>
  );
}
