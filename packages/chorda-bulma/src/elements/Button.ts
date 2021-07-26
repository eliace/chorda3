import { HtmlBlueprint, Injector, Listener, mix, observable, patch } from "@chorda/core"


//
// Button
//


type RendererEvents = {
    $dom: {
        click: () => void
    }
}

type ButtonScope = {
    color: string
    text: string
    disabled: boolean
}

type ButtonProps<T, E> = {
    as?: HtmlBlueprint<T, E>
    text?: string
    text$?: Injector<T>
    color?: string
    color$?: Injector<T>
    static?: boolean
    leftIcon?: HtmlBlueprint<T>
    rightIcon?: HtmlBlueprint<T>
    icon?: HtmlBlueprint<T>
    onClick?: Listener<T, void>
    css?: string|string[]
    disabled$?: Injector<T>
}


export const Button = <T, E>(props: ButtonProps<T&ButtonScope, E>) : HtmlBlueprint<T, E> => {
    return mix<ButtonScope, RendererEvents/*&{click?: () => any}*/>({
        tag: 'button',
        css: 'button',
        templates: {
            leftIcon: {
                weight: -10
            },
            content: {
                tag: 'span',
                reactions: {
                    text: (v) => patch({text: v})
                }
            },
            rightIcon: {
                weight: 10
            }
        },
        reactions: {
            color: (next, prev) => patch({
                classes: {
                    [next]: true, 
                    [prev]: false
                }
            }),
            disabled: (v) => patch({dom: {disabled: v}})
        }
    }, 
    props?.as,
    props && {
        css: props.css,
        classes: {
            'is-static': props.static
        },
        text: (!props.leftIcon && !props.rightIcon) && !props.icon && props.text,
        templates: {
            content: {
                text: props.text
            }
        },
        components: {
            leftIcon: props.leftIcon,
            rightIcon: props.rightIcon,
            icon: props.icon,
            content: (!!props.leftIcon || !!props.rightIcon),
        },
        injections: {
            color: props.color$ || (() => observable(props.color)), //(ctx) => observable(props.color || ctx.color),
            text: props.text$, //|| ((ctx: any) => observable(props.text))
            disabled: props.disabled$,
        },
        events: {
            $dom: {
                click: props.onClick
            }
            //click: props.onClick
        }
    })
}


//
// Buttons
//

type ButtonsProps<T> = {
    buttons: HtmlBlueprint<T>[]
    defaultButton?: HtmlBlueprint<T>
    centered?: boolean
}


export const Buttons = <T>(props: ButtonsProps<T>) : HtmlBlueprint<T> => {
    return {
        css: 'buttons',
        classes: {
            'is-centered': props.centered
        },
        items: props.buttons,
        defaultItem: props.defaultButton
    }
}
