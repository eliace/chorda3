import { computable, Html, HtmlBlueprint, HtmlScope, observable, passthruLayout, Value } from "@chorda/core"
import { Field, Fields, RowLayout } from "chorda-bulma"
import { TextInput } from "../../helpers"
import { Tmdb } from "../../api"
import { MovieListItem } from "./common/items"
import { Coerced, watch, DynamicList, DynamicItemScope } from "../../utils"



const movies = observable([])
const genres = observable([] as Tmdb.Genre[])
const totalPages = observable(null as number)
const totalRecords = observable(null as number)
const lastPage = observable(0)
const query = observable('')

const loadConfig = () => Tmdb.api.getConfiguration()

// const loadPage = (p: number, q: string) => {
//     return Tmdb.api.searchMovie({page: p, query: q, language: 'ru'}).then(response => {
//         movies.$value = response.results
//         totalPages.$value = response.total_pages
//     })    
// }

const loadGenres = (lang: string) => {
    return Tmdb.api.getMovieGenres(lang).then(response => {
        genres.$value = response.genres
    })
}


type MoviesScope = {
    page: number
    totalPages: number
//    loadPage: (page: number) => void
}

type MoviesScopeEvents = {

}


type LazyPage<I> = {
    id: number
    cache: I[]
    loading?: boolean
    elements: HTMLElement[]
    // height: number
    // offset: number
    // virtualHeight: number
    // el: HTMLElement
}

type LazyScrollScope<I> = {
    lazyPages: LazyPage<I>[]
    intersectionObserver: IntersectionObserver
    avgHeight: number
    records: (I&{weight: number})[]
}

type LazyScrollEvents = {
    //loadPageDone
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
        Coerced<LazyScrollScope<Tmdb.Movie>&HtmlScope>({
            defaults: {
                lazyPages: () => observable([]),
                intersectionObserver: () => observable(null),
                avgHeight: () => observable(0),
                records: ({lazyPages}) => computable(() => {
//                    debugger
                    const recs: (Tmdb.Movie&{weight: number})[] = []
                    lazyPages.forEach(lazyPage => {
                        lazyPage.cache.forEach(rec => {
                            recs.push({
                                ...rec,
                                weight: lazyPage.id
                            })
                        })
                    })
                    return recs
                })
            },
            joints: {
               init: async ({lazyPages}) => {

                    const reload = (query: string) => {
                        if (query == '') {
                            totalPages.$value = 0
                            totalRecords.$value = 0
                            lazyPages.$value = []
                        }
                        else {
                            Tmdb.api.searchMovie({page: 1, query: query, language: 'ru'}).then(response => {
                            
                                totalPages.$value = response.total_pages
                                totalRecords.$value = response.total_results

                                const pageArr: LazyPage<any>[] = []
                                for (let i = 0; i < response.total_pages; i++) {
                                    pageArr[i] = {id: i+1, cache: [], elements: [], loading: false}
                                }
                                lazyPages.$value = pageArr

                                lazyPages[0].cache.$value = response.results
                                
                            })    
                        }
                    }



                    query.$subscribe(next => {
                        reload(next)
                    })


                    await loadConfig()
                    await loadGenres('ru')        

                },
                detectIntersection: ({$dom, intersectionObserver, lazyPages}) => {

                    const loadPage = (page: number) => {
                        console.log('load page', +page)
                        const lazyPage = lazyPages[page-1]
                        if (lazyPage.loading == false && query.$value) {
                            lazyPage.loading.$value = true
                            Tmdb.api.searchMovie({page: page, query: query.$value, language: 'ru'}).then(response => {
                                lazyPage.cache.$value = response.results
                                lazyPage.loading.$value = false
                            })    
                        }
                    }

                    $dom.$subscribe(el => {
                        if (el) {
                            intersectionObserver.$value = new IntersectionObserver((entries) => {
                                entries.forEach(entry => {
                                    if (entry.isIntersecting) {
                                        let page: LazyPage<any> = null
                                        lazyPages.forEach(lazyPage => {
                                            lazyPage.elements.forEach(el => {
                                                if (el == entry.target) {
                                                    page = lazyPage
                                                }
                                            })
                                        })
//                                        console.log('page', page)

                                        if (page != null) {
//                                            console.log(lazyPages[page.id], lazyPages[page.id+1])
                                            if (lazyPages[page.id].cache.length == 0) {
                                                 loadPage(page.id+1)
                                            }
                                            // if (lazyPages[page.id+1].cache.length == 0) {
                                            //     loadPage(page.id+2)
                                            // }    
                                        }
                                        
                                        intersectionObserver.unobserve(entry.target)
                                    }
                                })
                            }, {
                                root: el,
                                rootMargin: '5px',
                                threshold: 0
                            })
                        }
                        else {
                            intersectionObserver.$value.disconnect()
                        }
                    })

                }

            },
            styles: {
                maxHeight: 400,
                overflowY: 'auto'
            },
            templates: {
                content: DynamicList<Tmdb.Movie[], LazyScrollScope<Tmdb.Movie>&HtmlScope>({
                    as: {
                        joints: {
                            updateMinHeight: ({avgHeight, $dom, lazyPages}) => {

                                let allLoaded = false

                                watch(() => {
                                    if (!allLoaded && $dom.$value && avgHeight > 0 && totalRecords > 0) {
                                        $dom.$value.style.minHeight = (totalRecords * avgHeight) + 'px'
                                    }
                                }, [totalRecords, avgHeight, $dom])

                                watch(() => {
                                    allLoaded = true
                                    lazyPages.forEach(lazyPage => {
                                        if (lazyPage.cache.length == 0) {
                                            allLoaded = false
                                        }
                                    })
                                    console.log('all loaded', allLoaded)
                                    if (allLoaded && $dom.$value) {
                                        $dom.$value.style.minHeight = ''
                                    }
                                }, [lazyPages, $dom])
            
                            },
                        }
                    },
                    defaultItem: MovieListItem({
                        movie$: (scope) => scope.item,
                        genres$: () => genres,
                        as: Coerced<HtmlScope&LazyScrollScope<Tmdb.Movie>&DynamicItemScope<Tmdb.Movie&{weight: number}>>({
                            joints: {
                                detectBounds: ({$dom, avgHeight}) => {
                                    $dom.$subscribe(el => {
                                        if (el) {
                                            const bcr = el.getBoundingClientRect()
                                            if (avgHeight == 0) {
                                                avgHeight.$value = bcr.height
                                            }
                                            else {
                                                avgHeight.$value = Math.max(avgHeight.$value, bcr.height)// (avgHeight.$value + bcr.height) / 2
                                            }
                                        }
                                    })
                                },
                                subscribeIntersector: ({intersectionObserver, $dom, lazyPages, item}) => {

                                    $dom.$subscribe((next, prev) => {
                                        if (next) {
                                            const lazyPage = lazyPages[item.weight-1]
                                            if ((lazyPage as any).$value) {
                                                lazyPage.elements.push(next)
                                                intersectionObserver.observe(next)
                                            }
//                                            console.log('subscribe')
                                            
                                        }
                                        else if (prev) {
                                            intersectionObserver.unobserve(prev)
                                        }
                                    })
        
                                }
                            }
                        })
                    }),
                    items$: (scope) => scope.records
                })
            }
        }),


/*
        withDetectListBounds(withWatchScroll(DynamicList<LazyPage<Tmdb.Movie>[], MoviesScope&LazyScrollScope<Tmdb.Movie>&HtmlScope&WatchScrollScope&BoundsScope>({
            as: {
                defaults: {
                    lazyPages: () => observable([]),
                    intersectionObserver: () => observable(null),
                    // loadPage: () => observable((page: number) => {
                    //     return Tmdb.api.searchMovie({page: p, query: q, language: 'ru'})
                    // }),
                },
                joints: {
                    init: async ({lazyPages, $engine, $dom, intersectionObserver}) => {

                        const reload = (query: string) => {
                            if (query == '') {
                                lazyPages.$value = []
                                totalPages.$value = 0
                            }
                            else {
                                Tmdb.api.searchMovie({page: 1, query: query, language: 'ru'}).then(response => {
                                
                                    totalPages.$value = response.total_pages
                                    
                                    const pages = []
                                    for (let i = 0; i < response.total_pages; i++) {
                                        pages.push({id: i+1, cache: [], height: 0, virtualHeight: 0, offset: 0, el: null})
                                    }
                                    
                                    lazyPages.$value = pages
                                    
                                    if (pages.length > 0) {
                                        lazyPages[0].cache = response.results
                                    }

                                    recalcBlockHeights()
                                })    
                            }
                        }

                        const recalcBlockHeights = () => {
                            $engine.pipeTask(() => {
                                let pageHeight = 0
                                lazyPages.forEach(page => {
                                    if (page.cache.length > 0) {
                                        pageHeight = page.height
                                    }
                                })
                                lazyPages.forEach((page, i) => {
                                    if (page.cache.length == 0) {
                                        lazyPages[i].virtualHeight = pageHeight
                                    }
                                    else {
                                        lazyPages[i].virtualHeight = 0
                                    }
                                })

                            })
                        }

                        const loadPage = (page: number) => {
                            if (lazyPages[page].cache.length == 0) {
                                Tmdb.api.searchMovie({page: page, query: query, language: 'ru'}).then(response => {
                                    lazyPages[page].cache = response.results
                                    recalcBlockHeights()
                                })    
                            }
                        }

                        $dom.$subscribe(el => {
                            if (el) {
                                intersectionObserver.$value = new IntersectionObserver((entries) => {
                                    entries.forEach(entry => {
                                        if (entry.isIntersecting) {
                                            lazyPages.forEach(page => {
                                                if (page.el == entry.target) {
                                                    loadPage(page.id)
//                                                    el.style.height = ''
                                                }
                                            })
                                            intersectionObserver.unobserve(entry.target)
                                        }
                                    })
                                }, {
                                    root: el,
                                    rootMargin: '5px',
                                    threshold: 0
                                })
                            }
                            else {
                                intersectionObserver.$value.disconnect()
                            }
                        })


                        query.$subscribe(next => {
                            reload(next)
                        })


                        await loadConfig()
                        await loadGenres('ru')
//                        reload()

//                        loadPage(1)
                        //await loadPage(1, 'в')

                    },
                    detectScroll: ({scrollTop, bounds, lazyPages, $dom, intersectionObserver}) => {



//                         scrollTop.$subscribe(next => {
//                             const viewportMin = scrollTop
//                             const viewportMax = scrollTop + bounds.height
// //                            console.log('scroll', next, +bounds.height)
//                             lazyPages.forEach(page => {
//                                 if (page.offset < viewportMax && page.offset + page.virtualHeight > viewportMin) {
//                                     console.log('intersection', page.id, page.offset, page.virtualHeight, page.height, +viewportMin)
//                                 }
//                             })
//                         })

                        // const loadPage = (page: number) => {
                        //     if (lazyPages[page].cache.length == 0) {
                        //         Tmdb.api.searchMovie({page: page, query: query, language: 'ru'}).then(response => {
                        //             lazyPages[page].cache = response.results
                        //         })    
                        //     }
                        // }

                        // totalPages.$subscribe(next => {
                        //     const pages = []
                        //     for (let i = 0; i < next; i++) {
                        //         pages.push({id: i+1, cache: []})
                        //     }
                        //     lazyPages.$value = pages
                        // })


                    }
                },
                styles: {
                    maxHeight: 400,
                    overflowY: 'auto'
                },
            },
            defaultItem: DynamicList<Tmdb.Movie[], DynamicItemScope<LazyPage<Tmdb.Movie>>&LazyScrollScope<unknown>&{lazyPage: LazyPage<any>}&HtmlScope>({
                as: {
//                    layout: passthruLayout,
                    injections: {
                        lazyPage: (scope) => scope.item
                    },
                    joints: {
                        updateVirtualHeight: ({lazyPage, $dom, $engine, intersectionObserver}) => {

                            $dom.$subscribe((next, prev) => {
                                if (next) {
                                    lazyPage.el = next
                                    intersectionObserver.observe(next)
                                }
                                else {
                                    lazyPage.el = null
                                    intersectionObserver.unobserve(prev)
                                }
                            })

                            watch(() => {
                                const el = $dom.$value
                                if (el && lazyPage.virtualHeight > 0 && lazyPage.height == 0) {
                                    el.style.height = lazyPage.virtualHeight + 'px'
                                    // $engine.pipeTask(() => {
                                    //     const bcr = el.getBoundingClientRect()
                                    //     const parentBcr = el.parentElement.getBoundingClientRect()
                                    //     lazyPage.offset = bcr.top - parentBcr.top
                                    //     //console.log('offset', +lazyPage.id, bcr.top)
                                    // })
                                }
                                else if (el && lazyPage.height > 0) {
                                    el.style.height = ''
                                }
                            }, [$dom, lazyPage.virtualHeight])



                        },
                    //     detectBoundsAndOffset: ({$dom, lazyPage}) => {

                    //         $dom.$subscribe(el => {
                    //             if (el) {
                    //                 const bcr = el.getBoundingClientRect()
                    //                 lazyPage.offset = bcr.top
                    //                 console.log('offset', +lazyPage.id, bcr.top, bcr)
                    //             }
                    //         })

                    //     }
                    }
                },
                defaultItem: MovieListItem({
                    movie$: (scope) => scope.item,
                    genres$: () => genres,
                    as: Coerced<HtmlScope&{lazyPage: LazyPage<any>}>({
                        joints: {
                            detectBounds: ({$dom, lazyPage}) => {
                                $dom.$subscribe(el => {
                                    if (el) {
                                        lazyPage.height += el.getBoundingClientRect().height
                                    }
                                })
                            }
                        }
                    })
                }),
                items$: (scope) => scope.item.cache
            }),
            items$: (scope) => scope.lazyPages,
        })))
*/        
    ])
}
