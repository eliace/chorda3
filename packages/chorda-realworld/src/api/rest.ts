import axios, { AxiosResponse, Method } from "axios";
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
    baseURL: 'https://conduit.productionready.io/api'
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



const send = <T>(method: Method, url: string, data?: any, auth: boolean = true) : Promise<T> => {
    return rest.request({
        method,
        url,
        data,
        headers: {
            ...(auth && authHeader()),
            'Content-Type': 'application/json; charset=utf-8',
        }
    }).then(response => response.data, err => {throw err.response.data})
}


export const get = <T=ApiResponse>(url: string, data?: any) : Promise<T> => send('get', url, data)
export const post = (url: string, data?: any) : Promise<ApiResponse> => send('post', url, data)
export const put = <T>(url: string, data?: any) : Promise<T> => send('put', url, data)
export const del = <T>(url: string, data?: any) : Promise<T> => send('delete', url, data)

export const post_no_auth = (url: string, data?: any) : Promise<ApiResponse> => send('post', url, data, false)
