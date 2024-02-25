// client
"use client";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "../../Spinners";

export const RichTextEditor = dynamic(() => import("./_internal_editor"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center">
      <LoadingSpinner />
    </div>
  ),
});
