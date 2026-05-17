/**
 * Image domain types
 * - These mirror the backend response shapes used by the frontend.
 * - Note: `uploaderSnapshot` is the recommended display object for UI fields.
 */
export type Image = {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  tags: string[];
  // union kept for compatibility with backend. Prefer `uploaderSnapshot` for rendering.
  uploaderId: string | UploaderDetails;
  uploaderSnapshot: UploaderSnapshot;
  createdAt: string;
  updatedAt: string;
};

type UploaderDetails = {
  name: string,
  avatar: string,
  bio: string,
}

export type UploaderSnapshot = {
	_id: string;
	name: string;
	avatar: string;
};

export type ImageFeedData = {
  images: Image[];
  nextCursor?: string;
  hasMore: boolean;
};

export type ImageFeedParams = {
  limit?: number;
  cursor?: string;
  tag?: string;
};

export type RelatedImagesParams = {
  limit?: number;
  cursor?: string;
};

