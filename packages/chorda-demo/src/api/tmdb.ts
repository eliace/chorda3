import axios from "axios"

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = 'e78d300b41622292faa3e76f64eb27d7'

const rest = axios.create({
    baseURL: BASE_URL,
    params: {api_key: API_KEY}
})


export namespace Tmdb {

    export type Movie = {
        poster_path: string
        adult: boolean
        overview: string
        release_date: string
        genre_ids: number[]
        id: number
        original_title: string
        original_language: string
        title: string
        backdrop_path: string
        popularity: number
        vote_count: number
        video: boolean
        vote_average: number
    }


    type SearchMovieRequest = {
        query?: string
        page?: number
        language?: string
    }

    type SearchMovieResponse = PageResponse<Movie>

    type PageResponse<T> = {
        page: number
        total_pages: number
        total_results: number
        results: T[]
    }

    type ConfigurationResponse = {
        images: {
            base_url: string
            secure_base_url: string
            backdrop_sizes: string[]
            logo_sizes: string[]
            poster_sizes: string[]
            profile_sizes: string[]
            still_sizes: string[]
        }
        change_keys: string[]        
    }

    export type Genre = {
        id: number
        name: string
    }

    type GenresResponse = {
        genres: Genre[]
    }




    export const api = {
        getConfiguration: () : Promise<ConfigurationResponse> => rest.get('/configuration').then(response => {
            return configuration = response.data
        }),
        searchMovie: (request: SearchMovieRequest) : Promise<SearchMovieResponse> => rest.get('/search/movie', {params: request}).then(response => response.data),
        getMovieGenres: (language: string) : Promise<GenresResponse> => rest.get('/genre/movie/list', {params: {language}}).then(response => response.data),
    }


    let configuration: ConfigurationResponse = null

    export const toImageUrl = (path: string, size: string = 'w500') : string => {
        return path && configuration.images.secure_base_url + '/' + size + path
    }
}


