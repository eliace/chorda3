import { Blueprint, computable, Infer, observable } from "@chorda/core"
import { ColumnLayout, MenuItem, RowLayout } from "chorda-bulma"
import { Dropdown } from "../../helpers"
import { COUNTRIES, Country } from "../../data"
import { watch, withHtml, withBounds } from "../../utils"
import { withPortal } from "./common/with-portal"
import { withParentScrollTop } from "./common/with-parent-scroll-top"

type CountryRecord = Country & {id: any}

const countries: CountryRecord[] = observable(COUNTRIES.slice(0, 50).map(country => ({...country, id: country.alpha2Code})))


export default <T>() : Infer.Blueprint<T> => {
    return withPortal(ColumnLayout([
        RowLayout([
            Dropdown({
                value$: () => observable('BE'),
                items$: () => computable(() => countries),
//                up: true,
                as: withParentScrollTop(withHtml({
                    events: {
                        afterAddKeyed: (keyed, {portal}) => {
                            if (keyed.key == 'menu') {
                                // компонент поменяет родителя и будет исключен из children
                                portal.$value = keyed
                            }
                        },
                        beforeRemoveKeyed: (key, {portal}) => {
                            if (key == 'menu') {
                                // компонент будет удален как дочерний portal-а
                                portal.$value = false
                            }
                        }
                    },
                    styles: {
                        marginBottom: 140
                    },
                    templates: {
                        menu: {
                            joints: {
                                updateMenuPosition: ({$dom, dropdownBounds, parentScrollTop, up, menuBounds}) => {

                                    watch(() => {
                                        const el = $dom.$value
                                        if (el) {
                                            el.style.left = dropdownBounds.left + 'px'
                                            if (up.$value) {
                                                el.style.top = (dropdownBounds.top - menuBounds.height - parentScrollTop) + 'px'
                                            }
                                            else {
                                                el.style.top = (dropdownBounds.bottom - parentScrollTop) + 'px'
                                            }
                                        }
                                    }, [$dom, parentScrollTop, dropdownBounds])
                                }
                            },
                            reactions: {
                                active: (v) => ({
                                    styles: {display: v ? 'block' : 'none'}
                                })
                            }
                        }
                    }
                }))
            }),
        ]),
        RowLayout([
            Dropdown({
                value$: () => observable('CA'),
                items$: () => computable(() => countries),
                as: withParentScrollTop(withHtml({
                    joints: {
                        autoUp: ({dropdownBounds, menuBounds, parentScrollTop, up}) => {

                            // также можно подписаться window resize
                            watch(() => {
                                if (menuBounds.height > 0) {
                                    const menuBottom = dropdownBounds.bottom - parentScrollTop + menuBounds.height
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
//                                console.log('auto up', up.$value, parentScrollTop.$value)
                            }, [dropdownBounds, menuBounds, parentScrollTop])

                        },
                        // resetBoundsOnClose: ({active, menuBounds}) => {

                        //     watch(() => {
                        //         if (active.$value == false) {
                        //             menuBounds.$value = null
                        //         }
                        //     }, [active])

                        // }
                    },
                    templates: {
                        menu: withBounds({
                            joints: {
                                updateBounds: ({$dom, bounds, active, $patcher, $renderer}) => {
                                    watch(() => {
                                        if ($dom.$value /*&& active.$value*/) {
                                            $patcher.queue($renderer.fiber(() => {
                                                const prevDisplay = $dom.$value.style.display
                                                $dom.$value.style.display = 'block'
                                                bounds.$value = $dom.$value.getBoundingClientRect()
                                                $dom.$value.style.display = prevDisplay
                                            }))
                                        }
                                    }, [$dom/*, active*/])
                                }                    
                            }
                        })
                    }
                }))
            })
        ])
/*        
        withPortal(
            DropdownOld<CountryRecord, string, PortalScope>({
                maxHeight: 250,
                items$: () => countries,
                value$: () => observable(countries[8].id),
                text$: ({selected}) => selected.name,
                defaultItem: DropdownOldItem<CountryRecord, string>({
                    text$: ({item}) => item.name
                }),
                as: Coerced<DropdownOldScope<CountryRecord, string>&ParentScrollScope&HtmlScope, PortalScope>({
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
                            ({classes: {'is-active': v}, components: {menu: v}})
                        },
                    },
                    defaults: {
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
*/        
        
    ]))
}







