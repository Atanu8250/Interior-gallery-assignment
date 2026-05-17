import { buildUrl } from "@/helpers/api.helper";
import type { Image, ImageFeedData, ImageFeedParams, RelatedImagesParams } from "@/types/image";
import type { ApiResponse } from "@/types/api";


export const getImages = async (
  params?: ImageFeedParams,
  init?: RequestInit,
): Promise<ApiResponse<ImageFeedData>> => {
  const response = await fetch(buildUrl("/api/v1/images", params), {
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse<ImageFeedData>>;
};

export const getImageById = async (
  id: string,
  init?: RequestInit,
): Promise<ApiResponse<{ image: Image }>> => {
  const response = await fetch(buildUrl(`/api/v1/images/${encodeURIComponent(id)}`), {
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image ${id}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse<{ image: Image }>>;
};

export const getRelatedImages = async (
  id: string,
  params?: RelatedImagesParams,
  init?: RequestInit,
): Promise<ApiResponse<ImageFeedData>> => {
  const response = await fetch(buildUrl(`/api/v1/images/${encodeURIComponent(id)}/related`, params), {
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch related images for ${id}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse<ImageFeedData>>;
};
