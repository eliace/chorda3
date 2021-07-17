import { HtmlBlueprint, Injector, mix, observable, passthruLayout, patch } from "@chorda/core"


// Menu

type MenuProps<T> = {
    groups?: HtmlBlueprint<T>[]
}

export const Menu = <T>(props: MenuProps<T>) : HtmlBlueprint<T> => {
    return {
        tag: 'aside',
        css: 'menu',
        items: props.groups
    }
}


// Menu Group

type MenuGroupProps<T> = {
    label?: string
    items?: HtmlBlueprint<T>[]
    defaultItem?: HtmlBlueprint<T>
}

export const MenuGroup = <T>(props: MenuGroupProps<T>) : HtmlBlueprint<T> => {
    return mix({
        layout: passthruLayout,
        templates: {
            label: {
                tag: 'p',
                css: 'menu-label',
            },
            list: {
                tag: 'ul',
                css: 'menu-list',
                defaultItem: {
                    tag: 'li'
                },
            }
        }
    }, props && {
        templates: {
            label: {
                text: props.label
            },
            list: {
                defaultItem: props.defaultItem,
                items: props.items
            }
        }
    })
}



// Menu Item

export type MenuItemScope = {
    active: boolean
    name: string
    link: string
    text: string
}

type MenuItemProps<T> = {
    text?: string
    items?: HtmlBlueprint<T>[]
    active?: boolean
    active$?: Injector<T>
    name?: string
    link?: string
}

export const MenuItem = <T>(props: MenuItemProps<T&MenuItemScope>) : HtmlBlueprint<T> => {
    return mix<MenuItemScope>({
        components: {
            content: true,
        },
        templates: {
            content: {
                tag: 'a',
                reactors: {
                    text: (v) => patch({text: v}),
                    active: (v) => patch({classes: {'is-active': v}}),
                    link: (v) => patch({dom: {href: v}})
                }
            },
            list: {
                tag: 'ul',
            }
        }
    }, props && {
        name: props.name,
        templates: {
            content: {
                text: props.text,
                classes: {
                    'is-active': props.active
                }
            },
            list: {
                items: props.items
            }
        },
        components: {
            list: !!props.items
        },
        injectors: {
            name: () => observable(props.name),
            link: () => observable(props.link),
            active: props.active$
        }
    })
}



