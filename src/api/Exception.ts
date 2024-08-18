export type ExceptionProps =
  | {
      message: string | string[] | Record<string, unknown>;
      field?: string;
    }
  | string;

export class Exception {
  message: string;
  field?: string;

  constructor(props: ExceptionProps) {
    this.message =
      typeof props === "string"
        ? props
        : typeof props.message === "string"
          ? props.message
          : JSON.stringify(props.message);

    this.field = typeof props === "string" ? undefined : props.field;
  }
}
