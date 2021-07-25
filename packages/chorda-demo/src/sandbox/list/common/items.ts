import { computable, HtmlBlueprint, Injector, iterable, mix, observable, patch } from "@chorda/core";
import { MediaLayout, Image, Tags } from "chorda-bulma";
import { Tmdb } from "../../../api";
import { Coerced, IteratorScope } from "../../../utils";
import { Paragraph, Text } from "../../../helpers";
import { DynamicList } from "./utils";


type MovieListItemScope = {
    movie: Tmdb.Movie
    noPoster: boolean
    noOriginalTitle: boolean
    genres: Tmdb.Genre[]
}

type MovieListItemProps<T> = {
    movie$?: Injector<T>
    genres$?: Injector<T>
    as?: HtmlBlueprint<T>
}

export const MovieListItem = <I, T=IteratorScope<Tmdb.Movie[]>>(props: MovieListItemProps<I&T>) : HtmlBlueprint<T> => {
    return mix<MovieListItemScope>(
        MediaLayout({
            templates: {
                content: Image({
                    url$: ({movie}) => computable(() => Tmdb.toImageUrl(movie.poster_path, 'w92')) 
                }),
                rate: Text({
                    as: {
                        css: 'movie-rate'
                    },
                    text$: ({movie}) => movie.vote_average
                })
            }
        }, {
            templates: {
                title: Text({
                    as: {
                        css: 'movie-title'
                    },
                    text$: ({movie}) => movie.title
                }),
                originalTitle: Text({
                    text$: ({movie}) => movie.original_title
                }),
                date: Text({
                    text$: ({movie}) => movie.release_date
                }),
                description: Text({
                    as: Paragraph,
                    text$: ({movie}) => movie.overview
                }),
                genres: DynamicList<Tmdb.Movie['genre_ids'], MovieListItemScope>({
                    as: Tags,
                    defaultItem: Text({
                        text$: (scope) => computable(() => {
                            return scope.genres.filter(g => g.id == scope.item)[0].name
                        })
                    }),
                    items$: ({movie}) => movie.genre_ids,
                }),
                // genres2: Coerced<IteratorScope<number[]>, MovieListItemScope>({
                //     as: Tags({
                //         defaultTag: Coerced<IteratorScope<number>, MovieListItemScope>({
                //             as: Text({
                //                 text$: (scope) => computable(() => {
                //                     return scope.genres.filter(g => g.id == scope.__it)[0].name
                //                 })
                //             })
                //         })
                //     }),
                //     reactors: {
                //         __it: (v) => patch({items: v})
                //     },
                //     injectors :{
                //         __it: (scope) => iterable(scope.movie.genre_ids)
                //     }
                // })
            }
        }),
        props?.as,
        props && {
            initials: {
                noOriginalTitle: () => observable(null),
                noPoster: () => observable(null),
            },
            injectors: {
                movie: props.movie$,
                genres: props.genres$,
            }
        }
    )
}