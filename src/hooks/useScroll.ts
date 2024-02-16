// client
"use client";
import { useEffect, useState } from "react";

export function useScroll({
  elementRef,
}: {
  elementRef: React.RefObject<HTMLElement>;
}) {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    if (!elementRef.current) return;
    const { top } = elementRef.current.getBoundingClientRect();
    const sticky = top <= 0; // Adjust this condition based on your requirements
    setIsSticky(sticky);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isSticky };
}
