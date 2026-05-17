import { buildUrl } from "@/helpers/api.helper";
import type { ApiResponse } from "@/types/api";
import { Tag, TagFetch } from "@/types/tag";

export const getTags = async (
  init?: RequestInit,
): Promise<ApiResponse<TagFetch>> => {
  const response = await fetch(buildUrl("/api/v1/tags"), {
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse<TagFetch>>;
};
