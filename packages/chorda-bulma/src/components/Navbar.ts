import { HtmlBlueprint, InferBlueprint, mix } from '@chorda/core'


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

// Menu

type NavbarMenuProps = {
    start?: HtmlBlueprint[]
    end?: HtmlBlueprint[]
}

export const NavbarMenu = <T, E>(props: NavbarMenuProps) : InferBlueprint<T, E> => {
    return {
        components: {
            start: {
                items: props.start
            },
            end: {
                items: props.end
            }
        }
        
    }
}


interface NavbarDropdownProps {
    items?: HtmlBlueprint[]
    trigger: HtmlBlueprint
    css?: string
}

export const NavbarDropdown = (props: NavbarDropdownProps) : HtmlBlueprint => {
    return mix({
        templates: {
            trigger: {
                tag: 'a',
                css: 'navbar-link',
            },
            dropdown: {
                css: 'navbar-dropdown',
                defaultItem: {
                    css: 'navbar-item'
                }
            }
        }
    }, props && {
        css: props.css,
        components: {
            trigger: props.trigger,
            dropdown: {
                items: props.items
            }
        }
    })
}


export const NavbarDivider = () : HtmlBlueprint => {
    return {
        tag: 'hr',
        css: 'navbar-divider'
    }
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
                weight: -10,
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