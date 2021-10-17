export const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.'
export const LOREM_IPSUM_HTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.'

export const COUNTRIES: Country[]  = require('./countries.json')

export const USERS: User[] = require('./users.json').results

export const FRUITS: string[] = require('!raw-loader!./fruits.txt').default.split(',').map((s: string) => s.trim())

export const IMAGE_1 = require('./Yosemite.jpg')
export const IMAGE_2 = require('./Yosemite 3.jpg')

export const IMAGE_BASE64 = require('./Yosemite_sq.jpg?base64')

export const IMAGE_PLACEHOLDER = require('./Yosemite_3_sq.jpg')

export const CURIOSITY_IMAGE_URL = require('./curiosity.jpg')

export type Country = {
    name: string
    capital: string
    region: string
    area: number
    population: number
    gini: number
    alpha2Code: string
}

export type User = {
    gender: string
    name: {
        title: string
        first: string
        last: string
    },
    location: {
        street: {
            number: number
            name: string
        },
        city: string
        state: string
        country: string
        postcode: number
        coordinates: {
            latitude: string
            longitude: string
        },
        timezone: {
            offset: string
            description: string
        }
    },
    email: string
    login: {
        uuid: string
        username: string
        password: string
        salt: string
        md5: string
        sha1: string
        sha256: string
    },
    dob: {
        date: string
        age: number
    },
    registered: {
        date: string
        age: number
    },
    phone: string
    cell: string
    id: {
        name: string
        value: string
    },
    picture: {
        large: string
        medium: string
        thumbnail: string
    },
    nat: string
}

export type Movie = {
    "Title": string
    "US Gross": number
    "Worldwide Gross": number
    "US DVD Sales": number 
    "Production Budget": number 
    "Release Date": string 
    "MPAA Rating": string
    "Running Time min": number
    "Distributor": string
    "Source": string
    "Major Genre": string
    "Creative Type": string
    "Director": string
    "Rotten Tomatoes Rating": number
    "IMDB Rating": number
    "IMDB Votes": number
}