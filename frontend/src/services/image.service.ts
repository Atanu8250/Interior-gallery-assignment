/**
 * Image service
 * - Provides typed helpers to call the backend image endpoints.
 * - Keep network logic here so UI code can remain focused on rendering.
 */
import { buildUrl } from "@/helpers/api.helper";
import type { Image, ImageFeedData, ImageFeedParams, RelatedImagesParams } from "@/types/image";
import type { ApiResponse } from "@/types/api";


/**
 * Fetch a paginated feed of images.
 * @param params query params (limit, cursor, tag)
 * @param init optional fetch init (headers, signal)
 */
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

/**
 * Fetch a single image by id.
 * @param id image id
 * @param init optional fetch init
 */
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

/**
 * Fetch related images for a given image id.
 * Used by the detail page to populate the "similar images" feed.
 */
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
