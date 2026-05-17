import styles from "@/styles/imageDetails.module.css";

export default function Loading() {
  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div className={styles.skeletonContainer}>
        {/* Left: Image Skeleton */}
        <div className={styles.skeletonImage} />

        {/* Right: Details Skeleton */}
        <div className={styles.skeletonPanel}>
          {/* Back Link Skeleton */}
          <div className={styles.skeletonText} style={{ width: "100px" }} />

          {/* Title Skeleton */}
          <div className={styles.skeletonTitle} style={{ width: "80%" }} />

          {/* Uploader Row Skeleton */}
          <div className={styles.skeletonRow}>
            <div className={styles.skeletonAvatar} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className={styles.skeletonText} style={{ width: "120px" }} />
              <div className={styles.skeletonText} style={{ width: "100px" }} />
            </div>
          </div>

          {/* Description Skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} style={{ width: "70%" }} />
          </div>

          {/* Meta Grid Skeleton */}
          <div className={styles.skeletonMetaGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonMetaCard} />
            ))}
          </div>

          {/* Tags Skeleton */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "24px",
                  width: "80px",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)",
                  backgroundSize: "1000px 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
    </div>
  );
}