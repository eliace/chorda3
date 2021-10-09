import { Blueprint, InferBlueprint, mix } from "@chorda/core";


type NavBarProps<T, E> = {
    nav?: Blueprint<T, E>
    as?: Blueprint<T, E>
}




export const NavBar = <T, E>(props: NavBarProps<T, E>) : InferBlueprint<T, E> => {
    return mix({
        tag: 'nav',
        css: 'navbar navbar-light',
        templates: {
            content: {
                css: 'container',
                templates: {
                    brand: {
                        css: 'navbar-brand',
                        text: 'conduit',
                        dom: {
                            href: 'index.html'
                        }
                    },
                    nav: {
                        css: 'navbar-nav pull-xs-right'
                    }
                }
            }
        }
    },
    props.as,
    props && {
        templates: {
            content: {
                templates: {
                    nav: props.nav
                }
            }
        }
    })
}