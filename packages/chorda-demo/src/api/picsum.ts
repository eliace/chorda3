import axios from "axios"


export namespace Picsum {

    export type ImageData = {
        id: number
        author: string
        width: number
        height: number
        url: string
        download_url: string
    }
    

    export const api = {
        list: () : Promise<ImageData[]> => {
            return rest.get('/list', {params: {limit: 8, page: 3}}).then(response => response.data)
        }
    }

}


const rest = axios.create({
    baseURL: 'https://picsum.photos/v2',
})
