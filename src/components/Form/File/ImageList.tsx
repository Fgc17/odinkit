import { useFormContext } from "react-hook-form";
import { useField } from "../Field";
import { useMemo } from "react";
import { For } from "@/components/For";

export function ImageList() {
  const form = useFormContext();

  const field = useField();

  const images = Array.from(form.watch(field.name));

  const decodedImages = useMemo(
    () => images.map((img: any) => URL.createObjectURL(img)),
    [images]
  );

  if (!images) return null;

  const removeImage = (index: number) => {
    const images = Array.from(form.getValues(field.name));
    images.splice(index, 1);
    form.setValue(field.name, images);
  };

  return (
    <div className="mt-3 flex gap-4">
      <For each={decodedImages} identifier="images">
        {(image, index) => (
          <div className="relative inline-block" key={`k-${index}`}>
            <img
              src={image}
              className="pointer-events-none h-24 w-full rounded-md"
              alt=""
              loading="lazy"
            />
            <div
              className="absolute left-0 top-0 h-6 w-6 rounded-full transition duration-150 ease-in-out hover:scale-125"
              onClick={() => {
                removeImage(index as number);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="6" fill="white" />
                <path
                  fill="#D0342C"
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16ZM7 9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7Z"
                />
              </svg>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
