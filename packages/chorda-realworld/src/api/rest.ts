import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { Article, Profile, User, Errors, Comment } from "./types";



export type ApiResponse = {
    profile?: Profile
    user?: User
    articles?: Article[]
    articleCount?: number
    article?: Article
    comments?: Comment[]
    errors?: Errors
}




const rest = axios.create({
    baseURL: 'https://api.realworld.io/api'//'https://conduit.productionready.io/api'
})


export const saveToken = (token: string) => {
    localStorage.setItem('conduit-user-token', token)
}

const getToken = () => {
    return localStorage.getItem('conduit-user-token')
}

const authHeader = () => {
    const token = getToken()
    return token && {Authorization: 'Token ' + token}
}



const send = <T>(method: Method, url: string, data?: any, params?: any, auth: boolean = true) : Promise<T> => {
    return rest.request({
        method,
        url,
        data,
        params,
        headers: {
            ...(auth && authHeader()),
            'Content-Type': 'application/json; charset=utf-8',
        }
    }).then(response => response.data, err => {throw err.response.data})
}


export const get = <T=ApiResponse>(url: string, data?: any) : Promise<T> => send('get', url, null, data)
export const post = (url: string, data?: any) : Promise<ApiResponse> => send('post', url, data)
export const put = (url: string, data?: any) : Promise<ApiResponse> => send('put', url, data)
export const del = (url: string, data?: any) : Promise<ApiResponse> => send('delete', url, data)

export const post_no_auth = (url: string, data?: any) : Promise<ApiResponse> => send('post', url, data, null, false)
