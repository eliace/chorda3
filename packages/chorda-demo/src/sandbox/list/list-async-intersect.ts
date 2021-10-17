import { InferBlueprint, observable } from "@chorda/core"
import { Field, Fields, RowLayout } from "chorda-bulma"
import { DynamicList, ListBlueprint, watch, withIterableItems, withList } from "../../utils"
import { Tmdb } from "../../api"
import { TextInput } from "../../helpers"
import { MovieListItem } from "./common/items"
import { InfiniteScrollBlueprintType, InfiniteScrollEvents, InfiniteScrollScope, withInfiniteScroll } from "./common/scroll"


const query = observable('' as string)
const genres = observable([])


const loadConfig = () => Tmdb.api.getConfiguration()

const loadGenres = (lang: string) => {
    return Tmdb.api.getMovieGenres(lang).then(response => {
        genres.$value = response.genres
    })
}



type MoviesScope = {
    movies: Tmdb.Movie[]
}


type X = ListBlueprint<Tmdb.Movie> & InfiniteScrollBlueprintType<Tmdb.Movie>

const x : X = {
    injections: {
        //infiniteItems: () => []
        //items: $ => $.
    }
}


export default () : InferBlueprint<unknown> => {
    return RowLayout([
        Fields({
            fields: [
                Field({
                    control: TextInput({
                        value$: () => query
                    })
                })
            ]
        }),
        withInfiniteScroll(withList(<ListBlueprint<Tmdb.Movie, InfiniteScrollScope<Tmdb.Movie>, InfiniteScrollEvents<Tmdb.Movie>>>{
            defaultItem: MovieListItem({
                movie$: (scope) => scope.item,
                genres$: () => genres,
            }),
            styles: {
                maxHeight: 380,
                overflowY: 'auto'
            },
            injections: {
                items: $ => $.infiniteItems
            },
            joints: {
                autoLoad: async ({infiniteScroll}) => {

                    watch(() => {
                        infiniteScroll.resetAndGetFirst()
                    }, [query])

                    await Promise.all([loadConfig(), loadGenres('ru')])

                    query.$value = 'руб'

                }
            },
            events: {
                onNextPage: (pageId, {infiniteScroll}) => {
                    if (query.$value != '') {
                        Tmdb.api.searchMovie({page: pageId, query: query.$value, language: 'ru'}).then(response => {
                            infiniteScroll.update(pageId, response.results, response.total_pages)
                        })
                    }
                    else {
                        infiniteScroll.update(pageId, [], 0)
                    }
                }
            },
        })),
        // withIterableItems(<ListBlueprint<Tmdb.Movie, MoviesScope&InfiniteScrollScope<Tmdb.Movie>>>{
        //     defaultItem: MovieListItem({
        //         movie$: (scope) => scope.item,
        //         genres$: () => genres,
        //     }),
        //     as: withInfiniteScroll({
        //         styles: {
        //             maxHeight: 380,
        //             overflowY: 'auto'
        //         },
        //         joints: {
        //             autoLoad: async ({infiniteScroll}) => {

        //                 query.$subscribe(() => {
        //                     infiniteScroll.resetAndGetFirst()
        //                 })

        //                 await Promise.all([loadConfig(), loadGenres('ru')])

        //                 query.$value = 'руб'

        //             }
        //         },
        //         events: {
        //             onNextPage: (pageId, {infiniteScroll}) => {
        //                 if (query.$value != '') {
        //                     Tmdb.api.searchMovie({page: pageId, query: query.$value, language: 'ru'}).then(response => {
        //                         infiniteScroll.update(pageId, response.results, response.total_pages)
        //                     })
        //                 }
        //                 else {
        //                     infiniteScroll.update(pageId, [], 0)
        //                 }
        //             }
        //         }
        //     }),
        //     injections: {
        //         items: $ => $.infiniteItems
        //     }
        // }),
        // DynamicList<Tmdb.Movie[], MoviesScope&InfiniteScrollScope<Tmdb.Movie>>({
        //     defaultItem: MovieListItem({
        //         movie$: (scope) => scope.item,
        //         genres$: () => genres,
        //     }),
        //     items$: (scope) => scope.infiniteItems,
        //     as: withInfiniteScroll({
        //         styles: {
        //             maxHeight: 380,
        //             overflowY: 'auto'
        //         },
        //         joints: {
        //             autoLoad: async ({infiniteScroll}) => {

        //                 query.$subscribe(() => {
        //                     infiniteScroll.resetAndGetFirst()
        //                 })

        //                 await Promise.all([loadConfig(), loadGenres('ru')])

        //                 query.$value = 'руб'

        //             }
        //         },
        //         events: {
        //             onNextPage: (pageId, {infiniteScroll}) => {
        //                 if (query.$value != '') {
        //                     Tmdb.api.searchMovie({page: pageId, query: query.$value, language: 'ru'}).then(response => {
        //                         infiniteScroll.update(pageId, response.results, response.total_pages)
        //                     })
        //                 }
        //                 else {
        //                     infiniteScroll.update(pageId, [], 0)
        //                 }
        //             }
        //         }
        //     })
        // }),

    ])
}


