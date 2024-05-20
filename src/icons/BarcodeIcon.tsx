export default function BarcodeIcon({
  className,
  color = "#0866ff",
  size = 24,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M1 19V5h2v14zm3 0V5h2v14zm3 0V5h1v14zm3 0V5h2v14zm3 0V5h3v14zm4 0V5h1v14zm3 0V5h3v14z"
        />
      </svg>
    </div>
  );
}
