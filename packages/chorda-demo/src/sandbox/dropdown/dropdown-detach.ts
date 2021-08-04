import { Blueprint, computable, InferBlueprint, mix, observable, patch, reactive } from "@chorda/core"
import { ColumnLayout, RowLayout } from "chorda-bulma"
import { Dropdown, DropdownScope } from "../../helpers"
import { COUNTRIES, Country } from "../../data"
import { withScope } from "../../utils"



type CountryRecord = Country & {id: any}

const countries: CountryRecord[] = observable(COUNTRIES.map(country => ({...country, id: country.alpha2Code})))


type LazyComponentsScope = {
    lazyComponents: {[k: string]: boolean}
}


export default <T>() : InferBlueprint<T> => {
    return ColumnLayout([
        RowLayout([
            Dropdown({
                value$: () => observable('AD'),
                items$: () => computable(() => countries),
                as: {
                    components: {
                        trigger: true,
                        menu: false
                    },
                    reactions: {
                        active: (v) => {
                            patch({classes: {'is-active': v}, components: {menu: v}})
                        },
                    },            
                    styles: {
                        marginBottom: 140
                    },
                }
            }),
        ]),
        RowLayout([
            Dropdown({
                value$: () => observable('BE'),
                items$: () => computable(() => countries),
                as: withScope<LazyComponentsScope>({
                    components: {
                        trigger: true,
                        menu: false
                    },
                    initials: {
                        lazyComponents: () => reactive({}),
                    },
                    reactions: {
                        lazyComponents: (v) => patch({components: v})
                    },
                    joints: {
                        lazyMenu: ({lazyComponents}) => {
                            setTimeout(() => {
                                lazyComponents.menu.$value = true
                            }, 2000)
                        }
                    }
                })
            }),
        ]),
    ])
}



// const useDetachedMenu = <T, E>(props: Blueprint<T, E>) : InferBlueprint<T, E> => {
//     return mix<DropdownScope<any>>(props, {
//         components: {
//             trigger: true,
//             menu: false
//         },
//         reactions: {
//             active: (v) => {
//                 patch({classes: {'is-active': v}, components: {menu: v}})
//             },
//         },
//     })
// }