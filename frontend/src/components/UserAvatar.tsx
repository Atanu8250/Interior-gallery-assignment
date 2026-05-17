"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/userAvatar.module.css";

/**
 * `UserAvatar` — simple avatar component with image fallback to colored initial.
 * - Accepts an optional `avatar` URL; if the image fails to load, shows a colored initial.
 */

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: number;
}

const COLORS = [
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#059669",
  "#0891B2",
  "#2563EB",
  "#4F46E5",
  "#7C3AED",
  "#DB2777",
  "#C2410C",
  "#65A30D",
  "#059669",
  "#3B82F6",
  "#6D28D9",
  "#E11D48",
  "#EA580C",
  "#CA8A04",
  "#0F766E",
  "#0F766E",
  "#1D4ED8",
  "#2563EB",
  "#0284C7",
  "#9333EA",
  "#DB2777",
  "#DC2626",
  "#CA8A04",
];

export default function UserAvatar({ name, avatar, size = 40 }: UserAvatarProps) {
  const [broken, setBroken] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset image state when avatar URL changes.
    setBroken(false);
    setIsLoaded(false);
  }, [avatar]);

  const initial = (name && name.trim() ? name.trim()[0].toUpperCase() : "?");
  const colorIndex = (initial.charCodeAt(0) - 65) % COLORS.length;
  const bgColor = COLORS[colorIndex < 0 ? 0 : colorIndex];

  const dimension = `${size}px`;
  const shouldShowImage = Boolean(avatar) && !broken;

  return (
    <div
      className={styles.avatar}
      style={{ width: dimension, height: dimension, backgroundColor: bgColor }}
      aria-hidden
    >
      {shouldShowImage ? (
        <>
          {!isLoaded ? (
            <span className={styles.initial} style={{ fontSize: Math.floor(size / 2) }}>
              {initial}
            </span>
          ) : null}
          <Image
            key={avatar}
            src={avatar!}
            alt={name}
            className={styles.img}
            width={size}
            height={size}
            sizes={`${size}px`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setBroken(true);
              setIsLoaded(false);
            }}
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
        </>
      ) : (
        <span className={styles.initial} style={{ fontSize: Math.floor(size / 2) }}>
          {initial}
        </span>
      )}
    </div>
  );
}
