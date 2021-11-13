import { AxiosResponse } from "axios"
import { Article, ArticlesQuery, Profile } from "."
import { ApiResponse, del, get, post, post_no_auth, put, saveToken } from "./rest"
import { Articles, Tags, User, Comment } from "./types"



export const api = {
    //getFeed: () : Promise<Articles> => get('/articles/feed'),
    login: (email: string, password: string) : Promise<User> => {
        const req = {
            user: {email, password}
        }
        return post_no_auth('/users/login', req).then(response => {
            saveToken(response.user.token)
            return response.user
        }, err => {
            throw err.errors
        })
    },
    logout: () => {
        saveToken(null)
    },
    register: (username: string, email: string, password: string) : Promise<User> => {
        return post_no_auth('/users', {user: {username, email, password}})
            .then(response => response.user, err => {throw err.errors})
    },
    getUser: () : Promise<User> => {
        return get('/user').then(response => response.user)
    },
    getAllTags: () : Promise<Tags> => {
        return get('/tags')//.then(response => response.data)
    },
    getAllArticles: (query?: ArticlesQuery) : Promise<Articles> => {
        return get('/articles', query)//.then(response => response.data)
    },
    getArticle: (slug: string) : Promise<Article> => {
        return get(`/articles/${slug}`).then(response => response.article)
    },
    getComments: (slug: string) : Promise<Comment[]> => {
        return get(`/articles/${slug}/comments`).then(response => response.comments)
    },
    getProfile: (username: string) : Promise<Profile> => {
        return get(`/profiles/${encodeURIComponent(username)}`).then(response => response.profile)
    },
    postArticle: (article: Partial<Article>) : Promise<Article> => {
        return post('/articles', {article}).then(response => response.article)
    },
    updateArticle: (slug: string, article: Partial<Article>) : Promise<Article> => {
        return put(`/articles/${slug}`, {article}).then(response => response.article)
    },
    deleteArticle: (slug: string) : Promise<Article> => {
        return del(`/articles/${slug}`).then(response => response.article)
    },
    getFeed: (query?: ArticlesQuery) : Promise<Articles> => {
        return get('/articles/feed', query)
    },
    getArticlesByTag: (tag: string, query?: ArticlesQuery) : Promise<Articles> => {
        return get('/articles', {tag, ...query})
    },
    favorite: (slug: string) : Promise<Article> => {
        return post('/articles/'+encodeURIComponent(slug)+'/favorite').then(response => response.article)
    },
    unfavorite: (slug: string) : Promise<Article> => {
        return del('/articles/'+encodeURIComponent(slug)+'/favorite').then(response => response.article)
    },
}
