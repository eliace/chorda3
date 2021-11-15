import { Blueprint, callable, computable, InferBlueprint, mix, observable, watch } from "@chorda/core"
import { DropdownScope } from "../../../helpers"


export const withMultiselect = <T, E>(blueprint: Blueprint<T, E>) : InferBlueprint<T, E> => {
    return mix<DropdownScope<any[]>>(blueprint, {
        defaults: {
            selected: () => observable([]),
        },
        injections: {
            selectItem: ({value}) => callable((itm: any) => {
                if (value.includes(itm.$value.id)) {
                    value.$value = value.filter(v => v != itm.$value.id)
                }
                else {
                    value.$value = [...value, itm.$value.id]
                }
                return itm
            }),
            triggerText: ({selected}) => computable(() => selected.map(s => s.name).join(',')),
        },
        joints: {
            initDropdown: ({value, items, selected, active, current}) => {

                watch(() => {
                    selected.$value = value.map(v => {
                        let found = null
                        items.forEach(itm => {
                            if ((itm as any).id == v) {
                                found = itm
                            }
                        })
                        return found
                    })
                }, [value, items])

                watch(() => {
                    if (active.$value) {
                        current.$value = selected[selected.length-1]
                    }
                }, [active])

            }            
        }   
    })
}
