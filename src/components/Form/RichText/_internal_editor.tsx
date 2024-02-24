// private & client
"use client";
import {
  Input as HeadlessInput,
  type InputProps as HeadlessInputProps,
} from "@headlessui/react";
import { useFormContext } from "../Form";
import { useField } from "../Field";
import clsx from "clsx";
import { Span } from "../Span";
import { Controller } from "react-hook-form";
import { useRef } from "react";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

if (typeof window !== "undefined") {
  require("tinymce/tinymce");
  require("tinymce/");
  require("tinymce/models/dom/model");
  require("tinymce/themes/silver");
  require("tinymce/icons/default");
  require("tinymce/plugins/advlist");
  require("tinymce/plugins/anchor");
  require("tinymce/plugins/autolink");
  require("tinymce/plugins/autoresize");
  require("tinymce/plugins/autosave");
  require("tinymce/plugins/charmap");
  require("tinymce/plugins/code");
  require("tinymce/plugins/codesample");
  require("tinymce/plugins/directionality");
  require("tinymce/plugins/emoticons");
  require("tinymce/plugins/fullscreen");
  require("tinymce/plugins/help");
  require("tinymce/plugins/image");
  require("tinymce/plugins/importcss");
  require("tinymce/plugins/insertdatetime");
  require("tinymce/plugins/link");
  require("tinymce/plugins/lists");
  require("tinymce/plugins/media");
  require("tinymce/plugins/nonbreaking");
  require("tinymce/plugins/pagebreak");
  require("tinymce/plugins/preview");
  require("tinymce/plugins/quickbars");
  require("tinymce/plugins/save");
  require("tinymce/plugins/searchreplace");
  require("tinymce/plugins/table");
  require("tinymce/plugins/template");
  require("tinymce/plugins/visualblocks");
  require("tinymce/plugins/visualchars");
  require("tinymce/plugins/wordcount");
  require("tinymce/plugins/emoticons/js/emojis");
  require("tinymce/plugins/help/js/i18n/keynav/pt_BR");
  require("./tiny/pt_BR");
}

// Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/content/default/content.css";

export default function _Internal_Editor({
  className,
  onChange,
  loading,
  ...props
}: {
  loading?: boolean;
} & HeadlessInputProps) {
  const form = useFormContext();
  const { name, error } = useField();
  const editorRef = useRef(null);

  return (
    <Span className={clsx(className)}>
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ...field } }) => {
          return (
            <>
              <Editor
                tinymceScriptSrc={"assets/libs/tinymce/tinymce.min.js"}
                onInit={(evt, editor) => ((editorRef.current as any) = editor)}
                value={value}
                onEditorChange={fieldOnChange}
                init={{
                  skin: false,
                  promotion: false,
                  language: "pt_BR",
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "preview",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  height: 400,
                  menubar: true,
                  content_css: false,
                }}
              />
            </>
          );
        }}
      />
    </Span>
  );
}
