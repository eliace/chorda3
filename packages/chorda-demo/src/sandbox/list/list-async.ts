import { computable, HtmlBlueprint, HtmlScope, iterable, mix, observable, patch } from "@chorda/core"
import { Field, Fields, Image, List, MediaLayout, RowLayout, Tag, Tags } from "chorda-bulma"
import { Paragraph, Text, TextInput } from "../../helpers"
import { Tmdb } from "../../api"
import { Coerced, Custom, IteratorScope } from "../../utils"
import { MovieListItem } from "./common/items"
import { DynamicList } from "./common/utils"

const movies = observable([])
const genres = observable([] as Tmdb.Genre[])
const totalPages = observable(null)
const lastPage = observable(0)
const query = observable('')

type MoviesScope = {
    lastPage: number
    totalPages: number
    pageHeight: number
    scrollTop: number
    scrollHeight: number
    bounds: DOMRect
    loading: boolean
    scrollHeightLock: boolean
    bus: {
        nextPage?: () => void
    }
}

type MovieScope = {
    movie: Tmdb.Movie
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
        DynamicList<Tmdb.Movie[], MoviesScope&HtmlScope>({
            as: {

        //Coerced<IteratorScope<Tmdb.Movie[]>&MoviesScope&HtmlScope>({
                injections: {
    //                __it: () => iterable(movies),
                    totalPages: () => totalPages,
                    scrollTop: () => observable(0),
                    scrollHeight: () => observable(0),
                    bounds: () => observable(null),
                    lastPage: () => lastPage,
                    loading: () => observable(null),
                    bus: () => observable({nextPage: null}),
                    scrollHeightLock: () => observable(false),
                },
                // reactions: {
                //     __it: (v) => patch({items: v})
                // },
                joints: {
                    detectBounds: ({$dom, bounds, items, $engine}) => {

                        const detect = () => {
    //                        console.log('detect bounds')
                            if ($dom.$value) {
                                $engine.pipeTask(() => {
                                    bounds.$value = $dom.$value.getBoundingClientRect()
                                })
                            }
                        }

                        $dom.$subscribe(detect)
                        items.$subscribe(detect)
                    },
                    watchScrollTop: ({$dom, scrollTop}) => {

                        const listener = (e: Event) => {
    //                        console.log('watch scroll')
                            scrollTop.$value = (e.target as Element).scrollTop
                        }
                        $dom.$subscribe((next, prev) => {
                            if (next) {
                                next.addEventListener('scroll', listener)
                            }
                            else {
                                debugger
                            }
                        })

                        // let t = performance.now()

                        // scrollTop.$subscribe((next, prev) => {
                        //     let t2 = performance.now()
                        //     console.log('distance', next - prev, (next - prev)/(t2 - t))
                        //     t = t2
                        // })
                    },
                    watchScrollHeight: ({$dom, $engine, items, scrollHeight, scrollHeightLock, scrollTop, bounds}) => {

                        const detectScrollHeight = () => {
    //                        console.log('detect scroll height')
                            const el = $dom.$value
    //                        console.log('detect scroll height')
                            if (el) {
                                $engine.pipeTask(() => {
                                    // if (scrollTop + bounds.height > scrollHeight) {
                                    //     el.scrollTop = scrollHeight - bounds.height - 1
                                    // }
    //                                console.log('page height', Math.max(el.scrollHeight, el.clientHeight))
                                    //const scrollHeightPrev = scrollHeight.$value
                                    scrollHeight.$value =  Math.max(el.scrollHeight, el.clientHeight)
                                    if (scrollTop + bounds.height < scrollHeight) {
                                        scrollHeightLock.$value = false
                                    }
                                    else {
                                        el.scrollTo(0, scrollHeight - bounds.height)
                                    }
                                })
                            }
                        }

                        $dom.$subscribe(detectScrollHeight)
                        items.$subscribe(detectScrollHeight)

                    },
                    detectLoadNeed: ({scrollHeight, scrollTop, bounds, scrollHeightLock, bus, $engine}) => {

                        const update = () => {
    //                        console.log('scroll', +scrollHeight, +scrollTop, +bounds.height)
                            if (!scrollHeightLock.$value && lastPage > 0 && lastPage < totalPages) {
    //                            console.log('scroll test')
                                if (scrollHeight > 0 && scrollTop + bounds.height >= scrollHeight - 100) {
                                    if (scrollTop + bounds.height > scrollHeight) {
    //                                    debugger
                                        // $engine.pipeTask(() => {
                                            
                                        // })
                                    }
                                    else {
                                        scrollHeightLock.$value = true
                                        bus.nextPage()
                                    }
    //                                scrollHeightLock.$value = true
    //                                lastPage.$value = lastPage + 1
                                }    
                            }
                        }

                        scrollHeight.$subscribe(update)
                        scrollTop.$subscribe(update)
                        bounds.$subscribe(update)
                        //lastPage.$subscribe(update)
                            
                    },
                    loadNextPage: ({lastPage, loading, totalPages, bus, scrollHeightLock, $engine, $dom}) => {

                        const loadNextPage = (p: number, q: string) => {
                            return Tmdb.api.searchMovie({page: p, query: q, language: 'ru'}).then(response => {
                                totalPages.$value = response.total_pages
                                lastPage.$value = p
                                movies.$value = p > 1 ? movies.concat(response.results) : response.results
                            })    
                        }

                        const resetScroll = () => {
                            $engine.pipeTask(() => {
                                $dom.$value.scrollTo(0, 0)
                            })
                        }


                        bus.nextPage.$value = async () => {
    //                        scrollHeightLock.$value = true
                            loading.$value = true
                            if (query.$value == '') {
                                totalPages.$value = 0
                                lastPage.$value = 0
                                movies.$value = []
                            }
                            else {
                                await loadNextPage(lastPage + 1, query.$value) // TODO необходимо добавить снятие прокси для вызовов axios
                            }
                            loading.$value = false
                        }

                        query.$subscribe(next => {
                            lastPage.$value = 0
                            bus.nextPage()
                            resetScroll()
                        })


                        Tmdb.api.getConfiguration().then(conf => {
                            console.log(conf);
    //                        bus.nextPage()
                        })
                        Tmdb.api.getMovieGenres('ru').then(data => {
                            genres.$value = data.genres
                        })
                        
                    }
                },
                styles: {
                    maxHeight: 400,
                    overflowY: 'auto'
                },
            },
            defaultItem: MovieListItem({
                movie$: (scope) => scope.item,
                genres$: () => genres,
            }),
            items$: () => movies,
            
            // defaultItem: MovieListItem({
            //     movie$: (scope) => scope.__it,
            //     genres$: () => genres,
            // }),
        })
    ])
}


// const List = <T>() : HtmlBlueprint<T> => {
//     return mix<>()
// }