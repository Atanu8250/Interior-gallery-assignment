export type Tag = {
    _id: string,
    name: string,
    slug: string,
    createdAt: string,
    updatedAt: string
};

export type TagFetch = {
    tags: Array<Tag>
}