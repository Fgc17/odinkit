type EditorSettingsType = {
  promotion?: boolean;
  language?: string;
  plugins?: string[];
  toolbar?: string;
  content_style?: string;
  height?: number;
  menubar?: boolean;
};

export const editorSettings = {
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
    "image",
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
    "image media link uploadFileButton | bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  height: 400,
  menubar: true,
  content_css: false,
};
