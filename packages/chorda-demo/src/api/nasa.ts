import axios from "axios"

/**
 * 
 * NASA API
 * 
 * https://api.nasa.gov
 * https://github.com/nasa/apod-api
 * https://github.com/chrisccerami/mars-photo-api
 * 
 */

const API_KEY = 'rt4vY3GxQ5sphrVit5elLXDPjPNtjz38cPVf0JMS'
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1'


const marsRest = axios.create({
    baseURL: BASE_URL,
    params: {api_key: API_KEY}
//    baseURL: 'https://mars-photos.herokuapp.com/',
})

const imagesRest = axios.create({
    baseURL: 'https://images-api.nasa.gov',
})

const apodRest = axios.create({
    baseURL: 'https://api.nasa.gov/planetary/apod',
    params: {api_key: API_KEY}
})


export namespace Nasa {

    export enum Rovers {
        Curiosity = 'curiosity',
        Opportunity = 'opportunity',
        Spirit = 'spirit',
        Perseverance = 'perseverance'
    }

    export type Camera = {
        id: number
        name: string
        rover_id: number
        full_name: string
    }

    export type Rover = {
        id: number
        name: string
        landing_date: string
        launch_date: string
        status: string
    }

    export type Photo = {
        id: number
        sol: number
        camera: Camera
        img_src: string
        earth_date: string
        rover: Rover
    }

    export type PhotoSet = {
        sol: number
        earth_date: string
        total_photos: number
        cameras: string[]
    }

    export type Mission = {
        name: Rovers
        landing_date: string
        launch_date: string
        status: string
        max_sol: number
        max_date: string
        total_photos: number
        photos: PhotoSet[]
    }



    export const api = {
        mars: {
            getRoverPhotos: (rover: Rovers, sol: number, page?: number, camera?: string) : Promise<{photos: Photo[]}> => {
                return marsRest.get(`/rovers/${rover}/photos?`, {params: {sol, page, camera}}).then(response => response.data)
            },
            getMission: (rover: Rovers) : Promise<{photo_manifest: Mission}> => {
                return marsRest.get(`/manifests/${rover}`).then(response => response.data)
            }
        },
        images: {
            search: (query: string, page?: number) : Promise<{collection: Images.Collection}> => {
                return imagesRest.get('/search', {params: {q: query, page}}).then(response => response.data)
            }
        },
        apod: {
            get: (request: Apod.Request) : Promise<Apod.Media[]> => {
                return apodRest.get('', {params: request}).then(response => response.data)
            }
        }
    }

    export namespace Images {

        export type Link = {
            href: string
            prompt: string
            rel: string
        }

        export type Item = {
            data: ItemData[]
            href: string
            links: Link[]
        }

        export type ItemData = {
            center: string
            date_created: string
            description: string
            keywords: string[]
            media_type: string
            nasa_id: string
            title: string
            photographer: string
            location: string
        }

        export type Collection = {
            href: string
            items: Item[]
            links: Link[]
            metadata: {
                total_hits: number
            }
            version: string
        }


    }

    export namespace Apod {

        export enum MediaType {
            Image = 'image',
            Video = 'video'
        }

        export type Request = {
            date?: string
            start_date?: string
            end_date?: string
            count?: number
            thumbs?: boolean
            hd?: boolean
            concept_tags?: boolean
        }

        export type Media = {
            copyright: string
            date: string
            explanation: string
            hdurl: string
            media_type: MediaType
            service_version: string
            title: string
            url: string       
        }

    }
}