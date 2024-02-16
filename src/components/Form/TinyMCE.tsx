// client
"use client";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "../Spinners";

export const TinyMCE = dynamic(() => import("./TinyMCE/Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center">
      <LoadingSpinner />
    </div>
  ),
});
