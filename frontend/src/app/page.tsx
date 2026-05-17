
/**
 * Home page
 * - Server component that fetches the initial feed and available tags
 * - Delegates rendering and client interactions to `GalleryGrid`.
 */
import styles from "@/styles/page.module.css";

import { getImages } from "@/services/image.service";
import { getTags } from "@/services/tag.service";

import {Image as ImageType} from "@/types/image";
import {Tag as TagType} from "@/types/tag";

import GalleryGrid from "@/components/GalleryGrid";

type HomeProps = {
  searchParams: Promise<{
    tag: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { tag } = await searchParams;
  const activeTag = typeof tag === "string" ? tag : "";

  const feedImagesData = await getImages({
    limit: 12,
    ...(activeTag ? { tag: activeTag } : {}),
  });
  const tagsData = await getTags();

  const images:Array<ImageType> = feedImagesData.data?.images || [];
  const tags:Array<TagType> = tagsData.data?.tags || [];
  const nextCursor = feedImagesData.data?.nextCursor;
  const hasMore = feedImagesData.data?.hasMore ?? false;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <GalleryGrid
          initialImages={images}
          tags={tags}
          initialCursor={nextCursor}
          initialHasMore={hasMore}
          initialTag={activeTag}
        />
      </main>
    </div>
  );
}
