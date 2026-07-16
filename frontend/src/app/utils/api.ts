export const API_URL = import.meta.env.VITE_API_URL;

const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function errorMessage(response: Response) {
  if (response.status === 413) return "The uploaded file is too large. Please choose a smaller file.";
  if (response.status >= 500) return "The analysis service is temporarily unavailable. Please try again shortly.";
  return "We couldn't analyze those files. Check them and try again.";
}

export async function postApi<T>(path: string, options: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError("The analysis service has not been configured. Please contact the site owner.");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal });
    if (!response.ok) throw new ApiError(errorMessage(response));
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The analysis took too long. Please try again.");
    }
    throw new ApiError("We couldn't reach the analysis service. Check your connection and try again.");
  } finally {
    window.clearTimeout(timeout);
  }
}
