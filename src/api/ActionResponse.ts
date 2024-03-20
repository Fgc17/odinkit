import { redirect as _redirect } from "next/navigation";
import { PaginationDto } from "./dto/read";
import { Exception, ExceptionProps } from "./Exception";

export type SuccessResponse<T> = {
  data?: T;
  pagination?: PaginationDto;
  message?: string | string[];
};

export type ExtractSuccessResponse<T extends (...args: any) => any> =
  Awaited<ReturnType<T>> extends ActionResponseType<infer U>
    ? U extends { data: infer D }
      ? D
      : U
    : never;

export type ErrorResponse = Exception & {
  error: true;
};

export type ActionResponseType<T> = SuccessResponse<T> | ErrorResponse | void;

export class ActionResponse {
  public static success<T>({
    data,
    pagination,
    message = "Operação realizada com sucesso",
    redirect,
  }: SuccessResponse<T> & {
    redirect?: string;
  }): SuccessResponse<T> | void {
    if (redirect) _redirect(redirect);

    return { data, pagination, message };
  }

  public static error(exception: ExceptionProps | unknown): ErrorResponse {
    return {
      ...new Exception(exception as ExceptionProps),
      error: true,
    };
  }
}
