import SkeletonCard from "@/components/Skeleton/SkeletonCard";
import styles from "@/styles/galleryGrid.module.css";

/**
 * App-level loading UI shown during server-side navigation to the home route.
 */
export default function Loading() {
  return (
    <section aria-label="Loading gallery" className="skeletonMain">
      <div className={styles.skeletonFilterContainer}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.skeletonPill}`} />
        ))}
      </div>

      <div className={styles.skeletonGridContainer}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}