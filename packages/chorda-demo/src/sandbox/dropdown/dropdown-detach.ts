import { Blueprint, computable, InferBlueprint, mix, observable, patch, reactive, Scope } from "@chorda/core"
import { ColumnLayout, RowLayout } from "chorda-bulma"
import { Dropdown, DropdownProps, DropdownScope } from "../../helpers"
import { COUNTRIES, Country } from "../../data"



type CountryRecord = Country & {id: any}

const countries: CountryRecord[] = observable(COUNTRIES.map(country => ({...country, id: country.alpha2Code})))


type LazyComponentsScope = {
    lazyComponents: {[k: string]: boolean}
}


export default () : InferBlueprint<Scope> => {
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
                as: <Blueprint<LazyComponentsScope>>{
                    components: {
                        trigger: true,
                        menu: false
                    },
                    initials: {
                        lazyComponents: () => observable({} as any),
                    },
                    reactions: {
                        lazyComponents: (v) => patch({components: v})
                    },
                    joints: {
                        lazyMenu: ({lazyComponents}) => {
                            // на 2 секунды отложим создание меню
                            setTimeout(() => {
                                lazyComponents.menu.$value = true
                            }, 2000)
                        }
                    }
                }
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