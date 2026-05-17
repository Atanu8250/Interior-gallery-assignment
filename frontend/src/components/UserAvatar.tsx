"use client";

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

export default function UserAvatar({ name, avatar, size = 40 }: UserAvatarProps) {
  const initial = (name && name.trim() ? name.trim()[0].toUpperCase() : "?");

  const dimension = `${size}px`;
  const shouldShowImage = Boolean(avatar);

  return (
    <div
      className={`${styles.avatar} ${!avatar ? styles.avatarPlaceholder : ""}`}
      style={{ width: dimension, height: dimension }}
      aria-hidden
    >
      {shouldShowImage ? (
        <Image
          key={avatar}
          src={avatar!}
          alt={name}
          className={styles.img}
          width={size}
          height={size}
          sizes={`${size}px`}
        />
      ) : (
        <span className={styles.initial} style={{ fontSize: Math.floor(size / 2) }}>{initial}</span>
      )}
    </div>
  );
}
