import { AxiosError } from "axios";
import { useState } from "react";
import { FieldValues, UseFormSetError } from "react-hook-form";

export function useFetchMutation<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<unknown | null>(null);

  const mutateFn = async (
    fn: () => Promise<T>,
    successFn: (() => void) | undefined = undefined,
    hookFromSetError?: UseFormSetError<FieldValues>
  ) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      await fn();

      if (successFn) {
        successFn();
      }

      setIsError(false);
      setError(null);
      setIsSuccess(true);
    } catch (err:
      | AxiosError<{
          message: string;
          errors?: { field: string; message: string }[];
          status?: number;
          statusText?: string;
          data?: unknown;
        }>
      | unknown) {
      console.error("err :>> ", err);

      if ((err as AxiosError)?.response?.status === 400 && hookFromSetError) {
        const axiosError = err as AxiosError<{
          message: string;
          errors?: { field: string; message: string }[];
          status?: number;
          statusText?: string;
          data?: unknown;
        }>;

        axiosError.response?.data?.errors?.forEach((errItem) => {
          hookFromSetError(errItem?.field, { message: errItem?.message });
        });
      }

      setIsSuccess(false);
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, isSuccess, isError, mutateFn };
}
