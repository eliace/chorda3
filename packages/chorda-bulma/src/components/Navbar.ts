import { HtmlBlueprint, mix } from '@chorda/core'


// Brand

type NavbarBrandProps = {
    items?: HtmlBlueprint[]
}

export const NavbarBrand = <T>(props: NavbarBrandProps) : HtmlBlueprint<T> => {
    return props && {
        items: props.items
    }
}


// Item

type NavbarItemProps<T> = {
    link?: string
}

export const NavbarItem = <T>(props: NavbarItemProps<T>) : HtmlBlueprint<T> => {
    return mix({
        tag: 'a',
    }, props && {
        dom: {
            href: props.link
        },
    })
}




// Navbar

type NavbarProps<T> = {
    brand?: HtmlBlueprint<T>
    menu?: HtmlBlueprint<T>
    end?: HtmlBlueprint<T>,
    css?: string
}

export const Navbar = <T>(props: NavbarProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'navbar',
        templates: {
            brand: {
                css: 'navbar-brand',
                defaultItem: {
                    css: 'navbar-item'
                }
            },
            menu: {
                css: 'navbar-menu',
                templates: {
                    start: {
                        css: 'navbar-start',
                        defaultItem: {
                            css: 'navbar-item'
                        }
                    },
                    end: {
                        css: 'navbar-end',
                        defaultItem: {
                            css: 'navbar-item'
                        }
                    }        
                }
            },
        }
    }, {
        css: props.css,
        components: {
            brand: props.brand,
            menu: props.menu,
        }
    })
}