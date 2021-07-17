import { computable, HtmlBlueprint, HtmlEvents, mix, observable, patch } from "@chorda/core"
import { ColumnLayout, RowLayout } from "chorda-bulma"
import { Dropdown, DropdownItem, DropdownScope } from "../../helpers"
import { COUNTRIES, Country } from "../../data"
import { Coerced } from "../../utils"


const countries = observable(COUNTRIES.map(country => ({...country, id: country.alpha2Code})))


export default <T>() : HtmlBlueprint<T> => {
    return RowLayout([
        Portal(
            Dropdown<Country, string, PortalScope>({
                items$: () => countries,
                value$: () => observable(countries[8].id),
                text$: ({selected}) => selected.name,
                defaultItem: DropdownItem<Country, string>({
                    text$: ({item}) => item.name
                }),
                as: Coerced<DropdownScope<Country, string>, PortalScope, HtmlEvents>({
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
                                $dom: {
                                    updateMenuOffset: ($dom, {bounds, parentScrollTop}) => {

                                        const update = () => {
                                            const el = $dom.$value
                                            if (el) {
                                                el.style.top = (bounds.bottom - parentScrollTop) + 'px'
                                                el.style.left = bounds.left + 'px'
                                            }
                                        }

                                        parentScrollTop.$subscribe(update)
                                        bounds.$subscribe(update)
                                        $dom.$subscribe(update)
                                    }
                                }
                            }
                        }
                    },
                    components: {
                        trigger: true,
                        menu: false
                    },
                    reactors: {
                        active: (v) => {
                            patch({classes: {'is-active': v}, components: {menu: v}})
                        },
                    },
                    // injectors: {
                    //     menuOffset: ({bounds, parentScrollTop}) => computable(() => {
                    //         return {
                    //             x: bounds.left,
                    //             y: bounds.bottom - parentScrollTop
                    //         }
                    //     })
                    // },
                })
            })
        )
    ])
}



type PortalScope = {
    $portal: HtmlBlueprint
}


const Portal = <T>(props: HtmlBlueprint<T>) : HtmlBlueprint<T> => {
    return mix<PortalScope>({
        injectors: {
            $portal: () => observable(null)
        },
        templates: {
            portal: {
                css: 'portal-host',
                reactors: {
                    $portal: (v) => {
                        patch({components: {content: v}})
                    }
                }
            },
            content: props
        }
    })
}