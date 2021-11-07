import { HtmlBlueprint, InferBlueprint, mix } from "@chorda/core"




interface CardImageProps<T> {
    image?: HtmlBlueprint<T>
}


export const CardImage = <T>(props: CardImageProps<T>) : InferBlueprint<T> => {
    return {
        templates: {
            content: props.image
        }
    }
}


interface CardHeaderProps<T> {
    title?: string
    icon?: HtmlBlueprint<T>
}

export const CardHeader = <T>(props: CardHeaderProps<T>) : InferBlueprint<T> => {
    return {
        components: {
            title: {
                text: props.title
            },
            icon: props.icon
        }
    }
}



type CardScope = {
    model: {
        title: string
        titleIcon: string
    }
}

interface CardProps<T> {
    css?: string
    image?: HtmlBlueprint<T>
    header?: HtmlBlueprint<T>
    content?: HtmlBlueprint<T>
    title?: HtmlBlueprint<T>
    titleIcon?: HtmlBlueprint<T>
    as?: HtmlBlueprint<T>
}


export const Card = <T>(props: CardProps<T&CardScope>) : InferBlueprint<T> => {
    return mix<CardScope>({
        css: 'card',
        components: {
            image: false,
            footer: false
        },
        templates: {
            header: {
                css: 'card-header',
                weight: -20,
                components: false,
                templates: {
                    title: {
                        css: 'card-header-title'
                    },
                    icon: {
                        css: 'card-header-icon'
                    }
                },
                reactions: {
                    model: (v) => v && ({
                        components: {title: v.title, icon: v.titleIcon}
                    })
                }
            },
            image: {
                css: 'card-image',
                templates: {
                    content: {
                        // image
                    }
                }
            },
            content: {
                css: 'card-content'
            },
            footer: {
                css: 'card-footer',
                defaultItem: {
                    css: 'card-footer-item'
                }
            }
        },
        // bindings: {
        //     model: (v: any) => ({components: v})
        // }
    },
    props?.as, 
    props && {
        css: props.css,
        components: {
            image: !!props.image && {
                components: {
                    content: props.image
                }
            },
            header: props.header,
            content: !!props.content && {
                components: {
                    content: props.content
                }
            }
        },
        // scope: {
        //     model: () => observable(props)
        // }
        // scope: {
        //     model: () => observable(props),
        // }
    })
}