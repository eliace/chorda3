import { computable, HtmlBlueprint, HtmlEvents, HtmlScope, mix, observable, patch } from "@chorda/core"
import { ColumnLayout, RowLayout } from "chorda-bulma"
import { Dropdown, DropdownItem, DropdownScope } from "../../helpers"
import { COUNTRIES, Country } from "../../data"
import { Coerced } from "../../utils"
import { DomEvents } from "@chorda/react"


const countries = observable(COUNTRIES.map(country => ({...country, id: country.alpha2Code})))

type ParentScrollScope = {
    parentScrollTop: number
}

export default <T>() : HtmlBlueprint<T> => {
    return RowLayout([
        Portal(
            Dropdown<Country, string, PortalScope>({
                maxHeight: 250,
                items$: () => countries,
                value$: () => observable(countries[8].id),
                text$: ({selected}) => selected.name,
                defaultItem: DropdownItem<Country, string>({
                    text$: ({item}) => item.name
                }),
                as: Coerced<DropdownScope<Country, string>&ParentScrollScope&HtmlScope, PortalScope>({
                    events: {
                        afterAddKeyed: (keyed, {$portal}) => {
                            if (keyed.key == 'menu') {
                                // компонент поменяет родителя и будет исключен из children
                                $portal.$value = keyed
                            }
                        },
                        beforeRemoveKeyed: (key, {$portal}) => {
                            if (key == 'menu') {
                                // компонент будет удален как дочерний portal-а
                                $portal.$value = false
                            }
                        }
                    },
                    templates: {
                        menu: {
                            styles: {
                                display: 'block'
                            },
                            joints: {
                                updateMenuOffset: ({$dom, bounds, parentScrollTop, up, menuBounds}) => {

                                    const update = () => {
                                        const el = $dom.$value
                                        if (el) {
                                            el.style.left = bounds.left + 'px'
                                            if (up.$value) {
                                                el.style.top = (bounds.top - menuBounds.height - parentScrollTop) + 'px'
                                            }
                                            else {
                                                el.style.top = (bounds.bottom - parentScrollTop) + 'px'
                                            }
                                        }
                                    }

                                    parentScrollTop.$subscribe(update)
                                    bounds.$subscribe(update)
                                    $dom.$subscribe(update)
                                }
                            }
                        }
                    },
                    components: {
                        trigger: true,
                        menu: false
                    },
                    reactions: {
                        active: (v) => {
                            patch({classes: {'is-active': v}, components: {menu: v}})
                        },
                    },
                    initials: {
                        parentScrollTop: () => observable(0)
                    },
                    joints: {
                        updateParentScroll: ({$dom, parentScrollTop}) => {

                            let scrollListeners: {listener: (e: Event) => void, target: Element, scroll: number}[] = []

                            $dom.$subscribe(el => {
                                if (el) {
            
                                    let parentEl = el.parentElement
                                    while (parentEl != null) {
                                        const listener = (e: Event) => {
                                            let scroll = 0
                                            scrollListeners.forEach(l => {
                                                if (l.target == e.target) {
                                                    l.scroll = (e.target as Element).scrollTop
                                                }
                                                scroll += l.scroll
                                            })
                                            parentScrollTop.$value = scroll
            //                                    console.log('scroll', (e.target as Element).scrollTop)
                                        }
                                        parentEl.addEventListener('scroll', listener)
                                        scrollListeners.push({listener, target: parentEl, scroll: 0})
                                        parentEl = parentEl.parentElement
                                    }
            //                            console.log('dropdown bounds', bounds.$value)
                                }
                                else {
                                    scrollListeners.forEach(l => {
                                        l.target.removeEventListener('scroll', l.listener)
                                    })
                                    scrollListeners = []
                                }
                            })
                        },
                        checkScreenLimit: ({bounds, menuBounds, parentScrollTop, up}) => {

                            const check = () => {
                                if (menuBounds.height > 0) {
                                    const menuBottom = bounds.bottom - parentScrollTop + menuBounds.height
                                    if (menuBottom > window.visualViewport.height) {
                                        up.$value = true
                                    }
                                    else {
                                        up.$value = false
                                    }
//                                    console.log('bounds', , window.visualViewport.height)
                                }
                                else {
                                    up.$value = false
                                }
                            }

                            bounds.$subscribe(check)
                            menuBounds.$subscribe(check)
                            parentScrollTop.$subscribe(check)
                        },
                        clearMenuBoundsAfterClose: ({active, menuBounds}) => {
                            active.$subscribe(() => {
                                if (!active.$value) {
                                    menuBounds.$value = null
                                }
                            })

                        }
                    }
                })
            })
        )
    ])
}



type PortalScope = {
    $portal: any
}


const Portal = <T>(props: HtmlBlueprint<T>) : HtmlBlueprint<T> => {
    return mix<PortalScope>({
        injections: {
            $portal: () => observable(null)
        },
        templates: {
            portal: {
                css: 'portal-host',
                reactions: {
                    $portal: (v) => {
                        patch({components: {content: v}})
                    }
                }
            },
            content: props
        }
    })
}