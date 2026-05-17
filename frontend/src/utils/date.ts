
export const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(value));