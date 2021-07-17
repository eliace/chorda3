import { HtmlBlueprint, Injector, iterable, Keyed, mix, observable, patch } from "@chorda/core"


type LevelLayoutScope = {
    level: HtmlBlueprint
    left: HtmlBlueprint
    right: HtmlBlueprint
}

type LevelLayoutProps<T> = {
    tag?: string
    css?: string
    weight?: number,
    atLeft?: Keyed<HtmlBlueprint<T>>
    atRight?: Keyed<HtmlBlueprint<T>>
    items?: [HtmlBlueprint<T>, HtmlBlueprint<T>]
}




export const LevelLayout = <T>(elements: [Keyed<HtmlBlueprint<T>>, Keyed<HtmlBlueprint<T>>]) : HtmlBlueprint<T> => {
    return mix<LevelLayoutScope>({
        css: 'level',
        templates: {
            left: {
                css: 'level-left',
                defaultComponent: {
                    css: 'level-item',
                    reactors: {
                        level: (v) => {
                            patch({components: {content: v}})
                        }
                    },
                    injectors: {
                        level: (scope) => {
//                            console.log(scope)
                            return (scope as any).__it
                        }
                    }
                },
                reactors: {
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
                    reactors: {
                        level: (v) => {
//                            console.log(v)
                            patch({components: {content: v}})
                        }
                    },
                    injectors: {
                        level: (s) => {
//                            console.log(s)
                            return (s as any).__it
                        }
                    }
                },
                reactors: {
                    right: (next) => patch({components: next})
                }
            }
        }
    }, {
        injectors: {
            left: () => iterable(elements[0]),
            right: () => iterable(elements[1])
        },
        // tag: props.tag,
        // css: props.css,
        // weight: props.weight
    })
}
