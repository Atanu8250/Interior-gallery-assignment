import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import GalleryGrid from "@/components/GalleryGrid";
import UserAvatar from "@/components/UserAvatar";

import { getImageById, getRelatedImages } from "@/services/image.service";

import type { Image as ImageType } from "@/types/image";

import pageStyles from "@/styles/page.module.css";
import styles from "@/styles/imageDetails.module.css";
import { formatDate } from "@/utils/date";

type ImageDetailsPageProps = {
    params: Promise<{
        id: string
    }>;
};

export default async function ImageDetailsPage({ params }: ImageDetailsPageProps) {
    let image: ImageType | null = null;
    const { id } = await params;

    try {
        const response = await getImageById(id);
        image = response.data?.image ?? null;
    } catch {
        notFound();
    }

    if (!image) {
        notFound();
    }

    const tagOptions = image.tags

    const relatedImagesResponse = await getRelatedImages(image._id, {
        limit: 12,
    });

    const relatedImages = relatedImagesResponse.data?.images ?? [];
    const nextCursor = relatedImagesResponse.data?.nextCursor;
    const hasMore = relatedImagesResponse.data?.hasMore ?? false;

    return (
        <div className={pageStyles.page}>
            <main className={pageStyles.main}>
                <Link href="/" className={styles.backLink}>
                    Back to gallery
                </Link>

                <section className={styles.detailsSection} aria-labelledby="image-title">
                    <div className={styles.imageStage}>
                        <Image
                            src={image.imageUrl}
                            alt={image.title}
                            fill
                            priority
                            className={styles.heroImage}
                            sizes="(max-width: 1024px) 100vw, 56vw"
                        />
                    </div>

                    <div className={styles.detailsPanel}>
                        <p className={styles.kicker}>Interior gallery</p>
                        <h1 id="image-title" className={styles.title}>
                            {image.title}
                        </h1>

                        <div className={styles.uploaderRow}>
                            <UserAvatar
                                name={image.uploaderSnapshot.name}
                                avatar={image.uploaderSnapshot.avatar}
                                size={48}
                            />
                            <div className={styles.uploaderText}>
                                <p className={styles.uploaderName}>{image.uploaderSnapshot.name}</p>
                                <p className={styles.uploaderMeta}>Uploaded {formatDate(image.createdAt)}</p>
                            </div>
                        </div>

                        {image.description ? (
                            <p className={styles.description}>{image.description}</p>
                        ) : (
                            <p className={styles.description}>No description available for this image.</p>
                        )}

                        <div className={styles.metaGrid}>
                            <div className={styles.metaCard}>
                                <span className={styles.metaLabel}>Image ID</span>
                                <span className={styles.metaValue}>{image._id}</span>
                            </div>
                            <div className={styles.metaCard}>
                                <span className={styles.metaLabel}>Updated</span>
                                <span className={styles.metaValue}>{formatDate(image.updatedAt)}</span>
                            </div>
                            <div className={styles.metaCard}>
                                <span className={styles.metaLabel}>Tag count</span>
                                <span className={styles.metaValue}>{image.tags.length}</span>
                            </div>
                        </div>

                        <div className={styles.tagSection} aria-label="Image tags">
                            {tagOptions.map((tag) => (
                                <span key={tag} className={styles.tagPill}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.relatedSection} aria-labelledby="related-heading">
                    <div className={styles.relatedHeader}>
                        <p className={styles.kicker}>Similar images</p>
                    </div>

                    <GalleryGrid
                        initialImages={relatedImages}
                        initialCursor={nextCursor}
                        initialHasMore={hasMore}
                        relatedImageId={image._id}
                    />
                </section>
            </main>
        </div>
    );
}
