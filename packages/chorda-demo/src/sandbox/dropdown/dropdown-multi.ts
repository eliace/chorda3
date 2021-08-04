import { callable, computable, InferBlueprint, observable, Scope } from "@chorda/core";
import { ColumnLayout, RowLayout } from "chorda-bulma";
import { Dropdown, Paragraph, Text, DropdownItem, DropdownScope } from "../../helpers";
import { done, watch, withBlueprint, withScope } from "../../utils";
import { COUNTRIES, Country } from "../../data";
import { MenuItem } from "../../helpers/Dropdown/utils";


const countries = observable(COUNTRIES.slice(0, 50), (v: Country) => v.alpha2Code);

const value1: string[] = observable(['BE']);


export default <T>() : InferBlueprint<T> => {
    return ColumnLayout([
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => computable(() => value1.join(','))
            }),
            withScope<DropdownScope<any[]>>({
                as: Dropdown<any[]>({
                    value$: () => value1,
                    items$: () => computable(() => countries.map(c => {return {...c, id: c.alpha2Code}})),
                    defaultItem: DropdownItem({
                        isSelected$: ({selected, item}) => computable(() => {
                            return selected.filter(s => s.id == item.id).length > 0
                        }),
                    }),    
                }),
                styles: {
                    marginBottom: 140
                },
                initials: {
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
        ])
    ])
}
