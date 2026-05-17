import { ImageFeedParams } from "@/types/image";


const getBaseUrl = () => {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing backend URL. Set BACKEND_URL in your environment.");
  }

  return rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")
    ? rawBaseUrl
    : `http://${rawBaseUrl}`;
};

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
