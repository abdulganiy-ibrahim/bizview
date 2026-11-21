"use client";

import { getNetworkErrorMessage } from "@/lib/network/networkMessages";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { useState, type FormEvent } from "react";
import {
  emptyValues,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/utils/productFormUtils";

// Re-exported so existing imports from this file keep working
export type {
  ProductFormErrors,
  ProductFormValues,
  ProductPayload,
} from "@/utils/productFormUtils";


type UseProductFormOptions<TPayload> = {
  initialValues?: Partial<ProductFormValues>;
  /** Checks the values and returns an error message per field */
  validate: (values: ProductFormValues) => ProductFormErrors;
  /** Turns the typed text into what the backend expects */
  buildPayload: (values: ProductFormValues) => TPayload;
  /** The form-specific server call. Throw an Error to show its message in the form. */
  onSubmit: (payload: TPayload) => Promise<void>;
};

export function useProductForm<TPayload>({
  initialValues,
  validate,
  buildPayload,
  onSubmit,
}: UseProductFormOptions<TPayload>) {
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update one field and clear its error
  const setValue = (field: keyof ProductFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await onSubmit(buildPayload(values));
    } catch (error) {
      // 1. the connection  2. the API answered with an error  3. an Error thrown by onSubmit
      setServerError(
        getNetworkErrorMessage(error) ??
          getApiErrorMessage(error) ??
          (error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, serverError, isSubmitting, setValue, handleSubmit };
}

export type ProductFormState = ReturnType<typeof useProductForm>;