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
import { editorSettings } from "./tiny/editorSettings";
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

type BlobInfo = {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
};

export default function _Internal_Editor({
  className,
  onChange,
  loading,
  uploadFn,
  fileUploadPath,
  ...props
}: {
  loading?: boolean;
  uploadFn?: ({
    files,
    folder,
  }: {
    files: { name: string; file: File }[];
    folder: string;
  }) => any;
  fileUploadPath?: string;
} & HeadlessInputProps) {
  const form = useFormContext();
  const { name, error } = useField();
  const editorRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const validateFileType = (file: File): boolean => {
    return allowedMimeTypes.includes(file.type);
  };

  const handleImageUpload = (file: BlobInfo) =>
    new Promise((resolve, reject) => {
      if (uploadFn && fileUploadPath) {
        const url = uploadFn({
          files: [
            {
              name: file.filename(),
              file: new File([file.blob()], file.filename()),
            },
          ],
          folder: "uploads/",
        })
          .then((fileArray: { key: string }[]) => {
            resolve(fileUploadPath + fileArray[0]?.key); // Resolve the promise with the URL
          })
          .catch((error: unknown) => {
            reject(error); // Reject the promise with the error
          });
      } else {
        throw new Error("imageUploadFn is required");
      }
    });

  const openCustomFileDialog = (editor: Editor["editor"]) => {
    const panel = editor?.windowManager.open({
      title: "Anexar Arquivos",
      body: {
        type: "panel",
        items: [
          {
            type: "htmlpanel",
            html: "<div style='width:100%; display:flex; justify-content: center; margin-top:10px'><input id='trigger-file-input' type='file' /></div>",
          },
        ],
      },
      buttons: [
        {
          text: "Enviar",
          type: "submit",
          primary: true,
        },
        {
          text: "Cancelar",
          type: "cancel",
        },
      ],

      onSubmit: (api: any) => {
        const fileInput = fileInputRef.current;
        if (!fileInput?.files?.length) return;
        const files = Array.from(fileInput?.files);
        panel?.close();
        handleFileUpload(files, editor, api);
      },
      onClose: () => {
        // Cleanup if necessary
      },
    });

    const element = document.getElementById(
      "trigger-file-input"
    ) as HTMLInputElement;
    fileInputRef.current = element;
    element.ondrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer?.files
        ? Array.from(event.dataTransfer?.files)
        : [];
      if (files.some((file) => !validateFileType(file))) {
        panel?.close();
        return editor?.notificationManager.open({
          text: "Algum dos arquivos não é suportado. (Apenas PDF, XLSX, PNG e JPG)",
          type: "error",
          timeout: 5000,
        });
      }
      element.files = event.dataTransfer?.files ?? null;
    };
  };

  const handleFileUpload = (
    files: File[] | undefined,
    editorHandler: Editor["editor"],
    api?: any
  ) => {
    if (!files || !editorHandler) return;
    if (files.some((file) => !validateFileType(file))) {
      return editorHandler.notificationManager.open({
        text: "Algum dos arquivos não é suportado. (Apenas PDF, XLSX, PNG e JPG)",
        type: "error",
        timeout: 3000,
      });
    }
    const notification = editorHandler.notificationManager.open({
      text: "Enviando arquivos, aguarde...",
      type: "info",
      timeout: 0, // Keep the notification open until manually closed
    });
    new Promise((resolve, reject) => {
      if (uploadFn && fileUploadPath) {
        const url = uploadFn({
          files: files.map((file) => ({
            file: file,
            name: file.name,
          })),
          folder: "uploads/",
        })
          .then((fileArray: { key: string }[]) => {
            api && api.close();
            notification?.close();
            editorHandler.notificationManager.open({
              text: "Arquivos enviados com sucesso!",
              type: "success",
              timeout: 3000,
            });
            return fileArray.forEach((file, index) =>
              editorHandler.insertContent(
                `<p><a href="${fileUploadPath + fileArray[0]?.key}" target="_blank">${files[index]?.name.split(".")[0]}</a></p>`
              )
            );
          })
          .catch((error: unknown) => {
            reject(error); // Reject the promise with the error
          });
      } else {
        throw new Error("imageUploadFn is required");
      }
    });
  };

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
                onInit={(evt, editorHandler) => {
                  if (!uploadFn || !fileUploadPath) return;
                  editorHandler.ui.registry.addIcon(
                    "uploadFile",
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#222f3e" d="M11 19h2v-4.175l1.6 1.6L16 15l-4-4l-4 4l1.425 1.4L11 14.825zm-5 3q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13V4H6v16h12V9zM6 4v5zv16z"/></svg>'
                  );
                  editorHandler.ui.registry.addButton("uploadFileButton", {
                    text: "Arquivo",
                    icon: "uploadFile",
                    tooltip: "Enviar PDFs, XLSX, PNGs e JPGs",
                    onAction: (e) => {
                      // Open the file picker
                      return openCustomFileDialog(editorHandler);
                    },
                  });
                  editorHandler.on("drop", (event) => {
                    event.preventDefault();
                    if (!event.dataTransfer?.files.length) return;
                    handleFileUpload(
                      Array.from(event.dataTransfer?.files),
                      editorHandler
                    );
                  });
                  return ((editorRef.current as any) = editorHandler);
                }}
                value={value}
                onEditorChange={fieldOnChange}
                init={{
                  ...editorSettings,
                  images_upload_handler: handleImageUpload,
                  skin_url: window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "/assets/libs/tinymce/skins/ui/oxide-dark"
                    : "",
                  content_css: window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "/assets/libs/tinymce/skins/content/dark/content.min.css"
                    : "",
                }}
              />
            </>
          );
        }}
      />
    </Span>
  );
}
