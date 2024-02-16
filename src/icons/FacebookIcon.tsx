import Image from "next/image";

export default function FacebookIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  // Set the filter based on the provided color prop
  const filter =
    "brightness(0) saturate(100%) invert(29%) sepia(87%) saturate(2816%) hue-rotate(211deg) brightness(99%) contrast(111%)";

  return (
    <div className={className} style={{ width: size, height: size, filter }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={30}
        viewBox="0 0 320 512"
      >
        <path
          fill="#0866ff"
          d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8z"
        />
      </svg>
    </div>
  );
}
