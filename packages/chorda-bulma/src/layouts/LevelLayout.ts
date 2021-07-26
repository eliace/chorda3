import { HtmlBlueprint, Injector, iterable, Keyed, mix, observable, patch } from "@chorda/core"


type LevelLayoutScope = {
    level: HtmlBlueprint
    left: Keyed<HtmlBlueprint>
    right: Keyed<HtmlBlueprint>
}

// type LevelLayoutProps<T> = {
//     tag?: string
//     css?: string
//     weight?: number,
//     atLeft?: Keyed<HtmlBlueprint<T>>
//     atRight?: Keyed<HtmlBlueprint<T>>
//     items?: [HtmlBlueprint<T>, HtmlBlueprint<T>]
// }




export const LevelLayout = <T>(elements: [Keyed<HtmlBlueprint<T>>, Keyed<HtmlBlueprint<T>>], as?: HtmlBlueprint<T>) : HtmlBlueprint<T> => {
    return mix<LevelLayoutScope>({
        css: 'level',
        templates: {
            left: {
                css: 'level-left',
                defaultComponent: {
                    css: 'level-item',
                    reactions: {
                        level: (v) => {
                            patch({components: {content: v}})
                        }
                    },
                    injections: {
                        level: (scope) => {
//                            console.log(scope)
                            return (scope as any).__it
                        }
                    }
                },
                reactions: {
                    left: (next) => {
//                        console.log(next)
                        patch({components: next})
                    }
                }
            },
            right: {
                css: 'level-right',
                defaultComponent: {
                    css: 'level-item',
                    reactions: {
                        level: (v) => {
//                            console.log(v)
                            patch({components: {content: v}})
                        }
                    },
                    injections: {
                        level: (s) => {
//                            console.log(s)
                            return (s as any).__it
                        }
                    }
                },
                reactions: {
                    right: (next) => patch({components: next})
                }
            }
        }
    }, 
    as,
    {
        injections: {
            left: () => iterable(elements[0]),
            right: () => iterable(elements[1])
        },
        // tag: props.tag,
        // css: props.css,
        // weight: props.weight
    })
}
