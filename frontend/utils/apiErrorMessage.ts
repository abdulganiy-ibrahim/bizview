import { isAxiosError } from "axios";

// Finds the first useful message in an error body. Handles:
// plain text, { message }, ASP.NET ProblemDetails ({ detail, title })
// and ASP.NET validation errors ({ errors: { Field: ["message"] } }).
function readMessageFromBody(data: unknown): string | undefined {
  if (typeof data === "string") {
    // Short plain text only. A long body is probably an HTML error page.
    const text = data.trim();
    return text && text.length < 200 && !text.startsWith("<") ? text : undefined;
  }

  if (!data || typeof data !== "object") return undefined;
  const body = data as Record<string, unknown>;

  if (body.errors && typeof body.errors === "object") {
    const firstError = Object.values(body.errors as Record<string, unknown>).flat()[0];
    if (typeof firstError === "string") return firstError;
  }

  for (const key of ["message", "detail", "title"]) {
    const value = body[key];
    if (typeof value === "string" && value) return value;
  }

  return undefined;
}

const STATUS_MESSAGES: Record<number, string> = {
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  429: "Too many requests. Please wait a moment and try again.",
  502: "The service is temporarily unavailable. Please try again in a moment.",
  503: "The service is temporarily unavailable. Please try again in a moment.",
  504: "The service is temporarily unavailable. Please try again in a moment.",
};

// Turns an API error that got a response into a message for the user.
// Returns null for anything else (no response at all, or not an axios error).
export function getApiErrorMessage(error: unknown): string | null {
  if (!isAxiosError(error) || !error.response) return null;

  const { status, data } = error.response;

  return (
    STATUS_MESSAGES[status] ??
    readMessageFromBody(data) ??
    (status >= 500
      ? "The server ran into a problem. Please try again."
      : "Something went wrong. Please try again.")
  );
}