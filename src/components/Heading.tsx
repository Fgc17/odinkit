export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold leading-6 text-gray-900">
      {children}
    </h3>
  );
}
