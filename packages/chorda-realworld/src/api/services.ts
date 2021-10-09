import { AxiosResponse } from "axios"
import { Article, ArticlesQuery, Profile } from "."
import { ApiResponse, get, post, post_no_auth, saveToken } from "./rest"
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
    }
}
