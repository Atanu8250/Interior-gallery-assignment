import detailsStyles from "@/styles/imageDetails.module.css";
import SkeletonCard from "@/components/Skeleton/SkeletonCard";
import userAvatarStyles from "@/styles/userAvatar.module.css";

/**
 * Loading skeleton for the image details route.
 * Shows a placeholder for the hero image, details panel and related grid.
 */
export default function Loading() {
  return (
    <div style={{ padding: "2rem 1rem" }} className="skeletonMain">
      {/* DETAILS SKELETON (left image + right panel) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 24, marginBottom: 32 }}>
        <div className={`${detailsStyles.skeletonImage} skeleton`} style={{ minHeight: 320, borderRadius: 20 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className={`skeleton skeleton-line`} style={{ width: 120 }} />
          <div className={`skeleton skeleton-line`} style={{ width: "70%", height: 32 }} />

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className={`${userAvatarStyles.skeletonAvatar} skeleton`} style={{ width: 48, height: 48 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div className={`skeleton skeleton-line`} style={{ width: 140 }} />
              <div className={`skeleton skeleton-line`} style={{ width: 100 }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className={`skeleton skeleton-line`} style={{ width: "100%" }} />
            <div className={`skeleton skeleton-line`} style={{ width: "100%" }} />
            <div className={`skeleton skeleton-line`} style={{ width: "70%" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <div className={`skeleton`} style={{ height: 56, borderRadius: 12 }} />
            <div className={`skeleton`} style={{ height: 56, borderRadius: 12 }} />
            <div className={`skeleton`} style={{ height: 56, borderRadius: 12 }} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`skeleton`} style={{ height: 28, width: 88, borderRadius: 999 }} />
            ))}
          </div>
        </div>
      </div>

      {/* RELATED FILTER + GRID SKELETON */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <div className={`skeleton skeleton-line`} style={{ width: 140, height: 16 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`skeleton`} style={{ height: 32, width: 88, borderRadius: 999 }} />
          ))}
        </div>
      </div>

      <div className={`skeleton-grid`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}