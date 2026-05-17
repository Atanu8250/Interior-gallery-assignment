export type Image = {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  tags: string[];
  uploaderId: string;
  uploaderSnapshot: UploaderSnapshot;
  createdAt: string;
  updatedAt: string;
};

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

