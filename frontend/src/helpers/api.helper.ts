/**
 * API helpers
 * - Builds absolute URLs for backend endpoints using server and browser base URLs.
 */
import { ImageFeedParams } from "@/types/image";


const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_BACKEND_URL || window.location.origin;
  }
  const rawBaseUrl = process.env.BACKEND_INTERNAL_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing backend URL. Set BACKEND_INTERNAL_URL (or NEXT_PUBLIC_BACKEND_URL) in your environment.");
  }

  return rawBaseUrl;
};

/**
 * Build a fully qualified URL for a backend endpoint.
 * - Filters out undefined/null/empty query params.
 */
export const buildUrl = (endpoint: string, params?: ImageFeedParams) => {
  // removes a trailing slash (/) from a URL string
  const url = new URL(endpoint, `${getBaseUrl().replace(/\/$/, "")}/`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};
