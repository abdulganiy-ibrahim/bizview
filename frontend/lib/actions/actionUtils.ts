import { isAxiosError } from "axios";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";

// What every server action returns, so the UI always knows if it worked
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string };

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

// Turns any error into a message for the user.
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    console.error("[server action] request failed:", {
      code: error.code, // e.g. ECONNREFUSED when the backend can't be reached
      status: error.response?.status,
      method: error.config?.method?.toUpperCase(),
      url: `${error.config?.baseURL ?? ""}${error.config?.url ?? ""}`,
      body: error.response?.data,
    });

    // No response at all: the backend could not be reached
    if (!error.response) return "Could not reach the server. Please try again.";

    return getApiErrorMessage(error) ?? FALLBACK_MESSAGE;
  }

  console.error("[server action] unexpected error:", error);
  return FALLBACK_MESSAGE;
}