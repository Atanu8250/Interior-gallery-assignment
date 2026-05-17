"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { Image as ImageType } from "@/types/image";
import type { Tag as TagType } from "@/types/tag";

import pageStyles from "@/styles/page.module.css";
import galleryStyles from "@/styles/galleryGrid.module.css";

import InteriorDesignCard from "./InteriorDesignCard";
import { getImages, getRelatedImages } from "@/services/image.service";
import SkeletonCard from "./Skeleton/SkeletonCard";
import { isAbortError } from "@/utils/api";

/**
 * `GalleryGrid` — client component that renders an image grid with optional tag
 * filtering and infinite scroll. It supports two modes:
 * - Feed mode: shows the main images feed and tag filter (default)
 * - Related mode: shows images related to a particular image (no tag filter)
 *
 * Important behaviors:
 * - Uses `getImages` for feed mode and `getRelatedImages` for related mode.
 * - Uses an AbortController for manual filter clicks to avoid duplicate requests.
 * - Shows a toast.promise only for manual filter actions (not initial or infinite loads).
 */

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
  const [filterErr, setFilterErr] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pendingTagRef = useRef<string | null>(null);
  const didHydrateRef = useRef(false);
  const refreshRequestIdRef = useRef(0);
  const manualFilterAbortRef = useRef<AbortController | null>(null);

  const fetchPage = async (
    params: { limit: number; cursor?: string; tag?: string },
    init?: RequestInit,
  ) => {
    if (relatedImageId) {
      return getRelatedImages(relatedImageId, { limit: params.limit, cursor: params.cursor }, init);
    }

    return getImages(params, init);
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
    const requestId = ++refreshRequestIdRef.current;
    let requestInit: RequestInit | undefined;

    if (showManualFilterToast) {
      manualFilterAbortRef.current?.abort();
      const controller = new AbortController();
      manualFilterAbortRef.current = controller;
      requestInit = { signal: controller.signal };
    }

    setIsRefreshing(true);
    setFilterErr(null);

    try {
      const request = fetchPage({ limit: 12, ...(tag ? { tag } : {}) }, requestInit);
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
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }

      setFilterErr("Failed to refresh images.");
      setImages([]);
      setCursor(undefined);
      setHasMore(false);
    } finally {
      if (refreshRequestIdRef.current === requestId) {
        setIsRefreshing(false);
      }
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || !cursor) return;

    setIsLoadingMore(true);

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

    // Ignore the URL update that corresponds to our own manual click fetch
    if (pendingTagRef.current !== null && pendingTagRef.current === urlTag) {
      pendingTagRef.current = null;
      return;
    }

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
  }, [searchParams, relatedImageId]);

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

  useEffect(() => {
    return () => {
      manualFilterAbortRef.current?.abort();
    };
  }, []);

  const onSelectTag = (tag: string) => {
    setSelectedTag(tag);
    pendingTagRef.current = tag;
    updateUrl(tag);
    void loadFirstPage(tag, true);
  };

  const retryCurrentPage = () => {
    void loadFirstPage(selectedTag, true);
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
          images.map((img, idx) => (
            <InteriorDesignCard img={img} key={img._id} isAboveFold={idx < 10} />
          ))
        ) : isRefreshing ?
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          )) : (
            <section className={pageStyles.noResults} aria-live="polite">
              <p>"No images found for the selected tag."</p>
            </section>
          )}

        {isLoadingMore && images.length > 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : null}
      </section>

      {filterErr ? (
        <section className={pageStyles.noResults} aria-live="polite">
          <p>{filterErr}</p>
          <button type="button" className="errorButton" onClick={retryCurrentPage}>
            Try again
          </button>
        </section>
      ) : null}

      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
    </section>
  );
}
