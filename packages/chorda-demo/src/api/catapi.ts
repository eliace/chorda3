import axios from "axios"

/**
 * 
 * CatAPI
 * 
 * https://thecatapi.com
 * 
 */

export namespace CatApi {

    export type Image = {
        id: string
        url: string
        width: number
        height: number
    }    
    
    export type Breed = {
        weight: {
            imperial: string
            metric: string
        },
        id: string
        name: string
        cfa_url: string
        vetstreet_url: string
        vcahospitals_url: string
        temperament: string
        origin: string
        country_codes: string
        country_code: string
        description: string
        life_span: string
        indoor: number
        lap: number
        alt_names: string
        adaptability: number
        affection_level: number
        child_friendly: number
        dog_friendly: number
        energy_level: number
        grooming: number
        health_issues: number
        intelligence: number
        shedding_level: number
        social_needs: number
        stranger_friendly: number
        vocalisation: number
        experimental: number
        hairless: number
        natural: number
        rare: number
        rex: number
        suppressed_tail: number
        short_legs: number
        wikipedia_url: string
        hypoallergenic: number
        reference_image_id: string
        image: {
            id: string
            width: number
            height: number
            url: string
        }
    
    
    }
    
    export type SearchImageFilter = {
        breed_id?: string
        limit?: number
        order?: string
        category_ids?: number
        page?: number
    }
    
    export type SearchResult = {
        breeds: Breed[]
        id: string
        url: string
        width: number
        height: number
    }

    export type Category = {
        id: number
        name: string
    }

    export type Favourite = {
        id: number
        user_id: string
        image_id: string
        sub_id: string
        created_at: string
        image: {
          id: string
          url: string
        }
    }

    export type SearchFavouriteFilter = {
        limit?: number
        page?: number
    }


    export const api = {
        getBreeds: () => {
            return rest.get('/breeds').then(response => response.data)
        },
        getCategories: () => {
            return rest.get('/categories').then(response => response.data)
        },
        searchImages (filter: CatApi.SearchImageFilter) {
            return rest.get('/images/search', {params: filter}).then((response) => response.data)    
        },
        searchFavourites (filter: CatApi.SearchFavouriteFilter) {
            return rest.get('/favourites', {params: filter}).then(response => response.data)
        },
        saveAsFavourite (image_id: string) {
            return rest.post('/favourites', {image_id: image_id})
        }
    }
    
}



const rest = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    headers: {'x-api-key': 'API_KEY'}
})






