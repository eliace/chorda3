import { callable, computable, HtmlBlueprint, HtmlScope, MethodsOf, mix, observable, Scoped } from "@chorda/core"
import { Field, Fields, RowLayout } from "chorda-bulma"
import { Coerced, Custom, ItemScope, watch } from "../../utils"
import { Tmdb } from "../../api"
import { TextInput } from "../../helpers"
import { MovieListItem } from "./common/items"
import { DynamicItemScope, DynamicList } from "./common/utils"
import { InfiniteScrollScope, withInfiniteScroll } from "./common/scroll"


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




export default <T>() : HtmlBlueprint<T> => {
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
        DynamicList<Tmdb.Movie[], MoviesScope&InfiniteScrollScope<Tmdb.Movie>>({
            defaultItem: MovieListItem({
                movie$: (scope) => scope.item,
                genres$: () => genres,
            }),
            items$: (scope) => scope.infiniteItems,
            as: withInfiniteScroll({
                styles: {
                    maxHeight: 400,
                    overflowY: 'auto'
                },
                joints: {
                    init: async ({infiniteScroll}) => {

                        query.$subscribe(() => {
                            infiniteScroll.reset()
                        })

                        await loadConfig()
                        await loadGenres('ru')

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
                }
            })
        }),

    ])
}


