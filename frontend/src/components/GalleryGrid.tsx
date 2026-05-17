"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Image as ImageType } from "@/types/image";
import type { Tag as TagType } from "@/types/tag";

import pageStyles from "@/styles/page.module.css";
import galleryStyles from "@/styles/galleryGrid.module.css";
import { toast } from "sonner";

import InteriorDesignCard from "./InteriorDesignCard";
import { getImages, getRelatedImages } from "@/services/image.service";
import SkeletonCard from "./Skeleton/SkeletonCard";

interface GalleryGridProps {
  initialImages: ImageType[];
  tags?: TagType[];
  initialCursor?: string;
  initialHasMore: boolean;
  initialTag?: string;
  relatedImageId?: string;
}

export default function GalleryGrid({
  initialImages,
  tags: allTags,
  initialCursor,
  initialHasMore,
  initialTag,
  relatedImageId,
}: GalleryGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedTag, setSelectedTag] = useState<string>(initialTag || "");
  const [images, setImages] = useState<ImageType[]>(initialImages);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const didHydrateRef = useRef(false);

  const fetchPage = async (params: { limit: number; cursor?: string; tag?: string }) => {
    if (relatedImageId) {
      return getRelatedImages(relatedImageId, { limit: params.limit, cursor: params.cursor });
    }

    return getImages(params);
  };

  const updateUrl = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const loadFirstPage = async (tag: string, showManualFilterToast = false) => {
    setIsRefreshing(true);
    setError(null);

    try {
      const request = fetchPage({ limit: 12, ...(tag ? { tag } : {}) });
      if (showManualFilterToast) {
        toast.promise(request, {
          loading: `Applying ${tag ?? ''} filter...`,
          success: "Filter applied",
          error: "Failed to apply filter",
        });
      }

      const response = await request;
      const data = response.data;

      setImages(data?.images || []);
      setCursor(data?.nextCursor);
      setHasMore(data?.hasMore ?? false);
    } catch {
      setError("Failed to refresh images.");
      setImages([]);
      setCursor(undefined);
      setHasMore(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || !cursor) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await fetchPage({
        limit: 12,
        cursor,
        ...(selectedTag ? { tag: selectedTag } : {}),
      });

      const data = response.data;
      const nextImages = data?.images || [];

      setImages((currentImages) => [...currentImages, ...nextImages]);
      setCursor(data?.nextCursor);
      setHasMore(data?.hasMore ?? false);
    } catch {
      setError("Failed to load more images.");
      toast.error("Failed to load more images.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (relatedImageId) {
      return;
    }

    const urlTag = searchParams.get("tag") || "";

    if (!didHydrateRef.current) {
      didHydrateRef.current = true;

      if (urlTag && urlTag !== selectedTag) {
        setSelectedTag(urlTag);
        void loadFirstPage(urlTag, false);
      }

      return;
    }

    if (urlTag !== selectedTag) {
      setSelectedTag(urlTag);
      void loadFirstPage(urlTag, false);
    }
  }, [searchParams, relatedImageId, selectedTag]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, isLoadingMore, selectedTag]);

  const onSelectTag = (tag: string) => {
    setSelectedTag(tag);
    updateUrl(tag);
    void loadFirstPage(tag, true);
  };

  return (
    <section className={pageStyles.gallery} aria-label="Interior gallery">
      {!relatedImageId ? (
        <div className={galleryStyles.filterContainer}>
          <p className={galleryStyles.filterLabel}>Filter by Tag:</p>
          <ul role="radiogroup" aria-label="Tag filter" className={galleryStyles.pillList}>
            <li className={galleryStyles.pillItem}>
              <button
                type="button"
                role="radio"
                aria-checked={selectedTag === ""}
                className={galleryStyles.pill}
                onClick={() => onSelectTag("")}
              >
                All
              </button>
            </li>
            {allTags?.map((tag) => (
              <li key={tag._id} className={galleryStyles.pillItem}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedTag === tag.slug}
                  className={galleryStyles.pill}
                  onClick={() => onSelectTag(tag.slug)}
                >
                  {tag.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className={pageStyles.masonryGrid} aria-label="Gallery results">
        {images.length > 0 ? (
          images.map((img) => (
            <InteriorDesignCard img={img} key={img._id} />
          ))
        ) : (
          <section className={pageStyles.noResults} aria-live="polite">
            <p>{isRefreshing ? "Loading images..." : "No images found for the selected tag."}</p>
          </section>
        )}
        
        {isLoadingMore && images.length > 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : null}
      </section>

      {error && <p className={pageStyles.noResults}>{error}</p>}

      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
    </section>
  );
}
