import { HtmlBlueprint, Injector, mix, observable, patch } from "@chorda/core"
import { Image } from "chorda-bulma";
import { Custom } from "../../utils";

import './ListBox.scss'

//
// ListBox
//

type ListBoxProps<T> = {
    defaultItem?: HtmlBlueprint<T>
    items?: HtmlBlueprint<T>[]
}

export const ListBox = <T>(props: ListBoxProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'list-box'
    }, props && {
        defaultItem: props.defaultItem,
        items: props.items,
    })
}


//
// Item
//

type ListBoxItemScope = {
    text: string
    subtitle: string
    image: string
}

type ListBoxItemProps<T> = {
    image?: HtmlBlueprint<T>
    text?: string
    subtitle?: string
    text$?: Injector<T>
    subtitle$?: Injector<T>
    image$?: Injector<T>
}

export const ListBoxItem = <T>(props: ListBoxItemProps<T&ListBoxItemScope>) : HtmlBlueprint<T> => {
    return mix<ListBoxItemScope>({
        css: 'list-box-item',
        templates: {
            content: {
                css: 'list-box-item__content',
                components: {
                    subtitle: false
                },
                templates: {
                    subtitle: {
                        css: 'list-box-item__subtitle',
                        weight: 10,
                        reactions: {
                            subtitle: (v) => patch({text: v})
                        }
                    }
                },
                reactions: {
                    text: (v) => patch({text: v}),
                    subtitle: (v) => patch({components: {subtitle: !!v}})
                }
            },
            image: Custom({
                css: 'list-box-item__image is-after',
                weight: 10,
                as: Image({
                    rounded: true,
                    url$: (scope) => scope.image    
                })
            })
        }
    }, props && {
        templates: {
            image: props.image,
            content: {
                text: props.text,
                templates: {
                    subtitle: {
                        text: props.subtitle
                    }
                },
                components: {
                    subtitle: !!props.subtitle
                },
            }
        },
        injections: {
            text: props.text$,
            subtitle: props.subtitle$ || (() => observable(props.subtitle)),
            image: props.image$
        }
    })
}
