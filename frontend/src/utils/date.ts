
/**
 * Small date formatting helper used by image details.
 * Returns a human readable date like "January 1, 2024".
 */
export const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(value));