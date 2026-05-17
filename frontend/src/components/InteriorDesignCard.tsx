import styles from "@/styles/interiorDesignCard.module.css";
import UserAvatar from "./UserAvatar";
import type { Image as ImageType } from "@/types/image";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * `InteriorDesignCard` — renders a single image card in the masonry grid.
 * - Click navigates to the image details page.
 */

interface InteriorDesignCardProps {
    img: ImageType
}

export default function InteriorDesignCard({ img }: InteriorDesignCardProps) {
    const router = useRouter();
    const redirectToDetails = () => {
        router.push(`/images/${img._id}`);
    }

    return (
        <article className={styles.masonryItem} aria-label={img.title} onClick={redirectToDetails}>
            <figure className={styles.imageWrapper}>
                <Image
                    src={img.imageUrl}
                    alt={img.title}
                    fill
                    className={styles.masonryImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <figcaption className={styles.uploaderBottom}>
                    <div className={styles.uploaderPill}>
                        <UserAvatar name={img.uploaderSnapshot.name} avatar={img.uploaderSnapshot.avatar} size={40} />
                        <span className={styles.uploaderPillName}>{img.uploaderSnapshot.name}</span>
                    </div>
                </figcaption>
            </figure>
            <section className={styles.imageInfo} aria-label="Image details">
                <h3 className={styles.imageTitle}>{img.title}</h3>
                {img.description && (
                    <p className={styles.imageDescription}>{img.description}</p>
                )}
                {img.tags.length > 0 && (
                    <ul className={styles.imageTags} aria-label="Image tags">
                        {img.tags.map((tag) => (
                            <li key={tag} className={styles.tag}>
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </article>
    )
}