// client
"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { For } from "./For";

export function Carousel({ slides }: { slides: React.ReactNode[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 4000 })]
  );

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <For each={slides} identifier="slides">
            {(slide) => <div className="embla__slide">{slide}</div>}
          </For>
        </div>
      </div>
    </div>
  );
}
