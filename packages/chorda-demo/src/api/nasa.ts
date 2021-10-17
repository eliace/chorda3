import axios from "axios"

const API_KEY = 'rt4vY3GxQ5sphrVit5elLXDPjPNtjz38cPVf0JMS'
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1'

const rest = axios.create({
    baseURL: BASE_URL,
    params: {api_key: API_KEY}
})


export namespace Nasa {

    export enum Rovers {
        Curiosity = 'curiosity',
        Opportunity = 'opportunity',
        Spirit = 'spirit'
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



    export const api = {
        mars: {
            getRoverPhotos: (rover: Rovers, sol: number) : Promise<{photos: Photo[]}> => {
                return rest.get(`/rovers/${rover}/photos?`, {params: {sol}}).then(response => response.data)
            }
        }
    }
}