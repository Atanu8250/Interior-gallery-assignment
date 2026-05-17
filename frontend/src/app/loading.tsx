import styles from "@/styles/galleryGrid.module.css";

export default function Loading() {
  return (
    <section aria-label="Loading gallery">
      <div className={styles.skeletonFilterContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.skeletonPill} />
        ))}
      </div>

      <div className={styles.skeletonGridContainer}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeletonCard" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ aspectRatio: "1", borderRadius: "8px", background: "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)", backgroundSize: "1000px 100%", animation: "shimmer 2s infinite" }} />
            <div style={{ padding: "0 10px 10px 10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ height: "18px", borderRadius: "6px", background: "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)", backgroundSize: "1000px 100%", animation: "shimmer 2s infinite" }} />
              <div style={{ height: "12px", borderRadius: "6px", background: "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)", backgroundSize: "1000px 100%", animation: "shimmer 2s infinite", width: "80%" }} />
            </div>
          </div>
        ))}
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
    </section>
  );
}