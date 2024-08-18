import { FileFormat } from "./FileFormat";

export const getFileExtension = (file: File): FileFormat => {
  return file.name.split(".").pop() as FileFormat;
};

export const getFileMime = (file: File) => {
  return file.type.split("/")[0];
};

export const getFileSizeInMB = (file: File) => {
  return file.size / 1024 / 1024;
};
