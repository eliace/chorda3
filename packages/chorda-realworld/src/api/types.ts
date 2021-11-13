

export type Article = {
    title: string
    slug: string
    body: string
    createdAt: string
    updatedAt: string
    tagList: string[]
    description: string
    author: Author
    favorited: boolean
    favoritesCount: number
}

export type Articles = {
    articles: Article[]
    articlesCount: number
}

export type Tags = {
    tags: string[]
}

export type User = {
    id: number
    email: string
    token: string
    username: string
    bio: string
    image: string
    createdAt: string
    updatedAt: string
}

export type Errors = {
    [key: string]: string[]
}

export type Profile = {
    username: string
    bio: string
    image: string
    following: boolean
}

type Author = {
    username: string
    bio: string
    image: string
    following: boolean
}

export type Comment = {
    id: number
    createdAt: string
    updatedAt: string
    body: string
    author: Author
}

export type ArticlesQuery = {
    tag?: string
    offset?: number
    limit?: number
}
