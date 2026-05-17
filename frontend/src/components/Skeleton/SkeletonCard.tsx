import styles from "@/styles/interiorDesignCard.module.css";

export default function SkeletonCard() {
  return (
    <article className={styles.skeletonCard} aria-hidden>
      <div className={`skeleton ${styles.skeletonImageArea}`} />
      <div style={{ padding: "0 10px 12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div className={`skeleton ${styles.skeletonTitle}`} />
        <div className={`skeleton ${styles.skeletonTextLine}`} />
        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
          <div className={`skeleton ${styles.skeletonTag}`} />
          <div className={`skeleton ${styles.skeletonTag}`} />
          <div className={`skeleton ${styles.skeletonTag}`} />
        </div>
      </div>
    </article>
  );
}
