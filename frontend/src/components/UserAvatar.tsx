"use client";

import { useState } from "react";
import styles from "@/styles/userAvatar.module.css";

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
];;

export default function UserAvatar({ name, avatar, size = 40 }: UserAvatarProps) {
  const [broken, setBroken] = useState(false);

  const initial = (name && name.trim() ? name.trim()[0].toUpperCase() : "?");
  const colorIndex = (initial.charCodeAt(0) - 65) % COLORS.length;
  const bgColor = COLORS[colorIndex < 0 ? 0 : colorIndex];

  const dimension = `${size}px`;

  if (avatar && !broken) {
    return (
      <div className={styles.avatar} style={{ width: dimension, height: dimension }}>
        <img
          src={avatar}
          alt={name}
          className={styles.img}
          onError={() => setBroken(true)}
          width={size}
          height={size}
        />
      </div>
    );
  }

  return (
    <div
      className={styles.avatar}
      style={{ width: dimension, height: dimension, backgroundColor: bgColor }}
      aria-hidden
    >
      <span className={styles.initial} style={{ fontSize: Math.floor(size / 2) }}>{initial}</span>
    </div>
  );
}
