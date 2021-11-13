import { computable, HtmlBlueprint, Injector, iterable, mix, observable } from "@chorda/core";
import { MediaLayout, Image, Tags, ContentLayout, LevelLayout } from "chorda-bulma";
import { Tmdb } from "../../../api";
import { Coerced, DynamicList, IteratorScope } from "../../../utils";
import { Paragraph, Text } from "../../../helpers";
import * as dayjs from 'dayjs'


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
            }
        },
        ContentLayout([
            LevelLayout([{
                title: Text({
                    as: {
//                        tag: 'h6',
                        css: 'movie-title mb-2 has-text-weight-medium',
                        templates: {
                            date: Text({
                                text$: ({movie}) => computable(() => dayjs(movie.release_date, 'YYYY-MM-DD').format('YYYY')),
                                as: {
                                    tag: 'span',
                                    css: 'ml-2 has-text-grey-light has-text-weight-normal is-size-7',
                                    weight: 10,
                                }
                            }), 
                        }
                    },
                    text$: ({movie}) => movie.title
                })
            }, {
                rating: Text({
                    as: {
                        css: 'movie-rate has-text-grey mr-4'
                    },
                    text$: ({movie}) => computable(() => `${movie.vote_average} / ${movie.vote_count}`)
                })
            }], {css: 'mb-0'}),
            Text({
                as: Paragraph,
                text$: ({movie}) => movie.overview,
                css: 'is-size-0_85'
            }),
            DynamicList<Tmdb.Movie['genre_ids'], MovieListItemScope>({
                as: Tags,
                defaultItem: Text({
                    text$: (scope) => computable(() => {
                        return scope.genres.filter(g => g.id == scope.item)[0].name
                    }),
                    css: 'is-info is-light'
                }),
                items$: ({movie}) => movie.genre_ids,
            }),
            Text({
                text$: ({movie}) => computable(() => movie.adult ? '18+' : '')
            })
        ])),
        props?.as,
        props && {
            defaults: {
                noOriginalTitle: () => observable(null),
                noPoster: () => observable(null),
            },
            injections: {
                movie: props.movie$,
                genres: props.genres$,
            }
        }
    )
}