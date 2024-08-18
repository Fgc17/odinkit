// client
"use client";

import { Exception } from "../api/Exception";
import { ErrorResponse, SuccessResponse } from "../api/ActionResponse";
import { useId } from "react";
import useSWRMutation from "swr/mutation";

type FetcherResponse<T> = Promise<T>;

interface UseActionParams<
  ArgumentType,
  DataReturnType,
  PrepareType,
  RequestParserReturnType,
  ResponseParserReturnType,
> {
  defaultData?: ResponseParserReturnType;
  redirect?: boolean | "unknown";
  formData?: boolean;
  prepare?: (arg: PrepareType) => Promise<ArgumentType> | ArgumentType;
  onError?: (error: Exception) => void;
  onSuccess?: (res: SuccessResponse<ResponseParserReturnType>) => void;
  responseParser?: (arg: DataReturnType) => ResponseParserReturnType;
  requestParser?: (
    arg: ArgumentType
  ) => Promise<RequestParserReturnType> | RequestParserReturnType;
  action: (
    arg: RequestParserReturnType | ArgumentType
  ) => Promise<SuccessResponse<DataReturnType> | ErrorResponse | void>;
}

export function useAction<
  ArgumentType,
  DataReturnType,
  PrepareType = ArgumentType,
  RequestParserReturnType = ArgumentType,
  ResponseParserReturnType = DataReturnType,
>({
  defaultData,
  redirect,
  action,
  prepare,
  onSuccess,
  onError,
  requestParser,
  responseParser,
}: UseActionParams<
  ArgumentType,
  DataReturnType,
  PrepareType,
  RequestParserReturnType,
  ResponseParserReturnType
>) {
  const id = useId();

  async function fetcher(
    arg: PrepareType
  ): FetcherResponse<SuccessResponse<ResponseParserReturnType>> {
    const preparedArg = prepare
      ? await prepare(arg)
      : (arg as any as ArgumentType);

    const formattedArg = requestParser
      ? await requestParser(preparedArg)
      : preparedArg;

    return await action(formattedArg).then((res) => {
      if (res && "error" in res) {
        const { error, ...exception } = res;
        throw exception;
      }

      if (redirect === true || (redirect === "unknown" && !res))
        return {
          data: null as ResponseParserReturnType,
          message: `Redirecionando...`,
        };

      if (!res)
        throw new Exception({
          message: "Resposta indefinida.",
        });

      if (!res.data)
        throw new Exception({
          message: "Resposta sem dados.",
        });

      const parsedData = (
        responseParser ? responseParser(res.data) : res.data
      ) as ResponseParserReturnType;

      return {
        data: parsedData,
        pagination: res.pagination,
        message: res.message,
      };
    });
  }

  const mutation = useSWRMutation<
    SuccessResponse<ResponseParserReturnType>,
    Exception,
    string,
    PrepareType
  >(id, async (url: string, { arg }) => await fetcher(arg), {
    throwOnError: false,
    onSuccess: (data) => onSuccess && onSuccess(data),
    onError: (error) => onError && onError(error),
  });

  const actionResult = {
    ...mutation,
    data: (mutation?.data?.data || defaultData) as ResponseParserReturnType,
    pagination: mutation?.data?.pagination,
  };

  return actionResult;
}
