// client
"use client";

import { ErrorResponse, SuccessResponse } from "../api/ActionResponse";
import { useId } from "react";
import useSWRMutation from "swr/mutation";

type FetcherResponse<T> = Promise<T>;

interface UseActionParams<
  PrepareType,
  ArgumentType,
  DataReturnType,
  RequestParserReturnType,
  ResponseParserReturnType,
> {
  defaultData?: ResponseParserReturnType;
  redirect?: boolean;
  formData?: boolean;
  prepare?: (arg: PrepareType) => Promise<ArgumentType> | ArgumentType;
  onError?: (error: string) => void;
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
  PrepareType,
  ArgumentType,
  DataReturnType,
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
  PrepareType,
  ArgumentType,
  DataReturnType,
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

    return await action(formattedArg)
      .then((res) => {
        if (res && "error" in res) throw res.message;

        if (redirect)
          return {
            data: null as ResponseParserReturnType,
            message: `Redirecionando...`,
          };

        if (!res) throw "Resposta indefinida.";

        if (!res.data) throw "Resposta sem dados.";

        const parsedData = (
          responseParser ? responseParser(res.data) : res.data
        ) as ResponseParserReturnType;

        return {
          data: parsedData,
          pagination: res.pagination,
          message: res.message,
        };
      })
      .catch((err) => {
        onError && onError(err);
        return err;
      });
  }

  const mutation = useSWRMutation<
    SuccessResponse<ResponseParserReturnType>,
    string,
    string,
    PrepareType
  >(id, async (url: string, { arg }) => await fetcher(arg), {
    onSuccess: (data) => onSuccess && onSuccess(data),
    onError: (error) => null,
  });

  const actionResult = {
    ...mutation,
    data: (mutation?.data?.data || defaultData) as ResponseParserReturnType,
    pagination: mutation?.data?.pagination,
  };

  return actionResult;
}
