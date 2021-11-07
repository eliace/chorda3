import { computable, InferBlueprint, observable, Scope } from "@chorda/core";
import { Column, ColumnLayout, RowLayout } from "chorda-bulma";
import { watch, withMix } from "../../utils";
import { COUNTRIES, Country } from "../../data";
import { Paragraph, Text, Dropdown, DropdownTrigger, TextInput, DropdownPropsType } from "../../helpers";

type CountryRecord = Country & {id: any}

const countries: CountryRecord[] = observable(COUNTRIES.map(country => ({...country, id: country.alpha2Code})))
const value = observable('ZW')
const stats = observable({
    filter: '',
    value: null,
    selected: null,
})

type FilterScope<I> = {
    filter: string
    filteredItems: I[]
}

const filterFunc = (v: CountryRecord) => {
    return v?.name
}


export default () : InferBlueprint<Scope> => {
    return ColumnLayout([
        Column({
            css: 'is-one-quarter',
            content: RowLayout([
                Dropdown(<DropdownPropsType<CountryRecord, FilterScope<CountryRecord>>>{
                    trigger: withMix(false, DropdownTrigger({
                        content: TextInput({
                            value$: ({filter}) => filter
                        })
                    })),
                    value$: () => value,
                    items$: ({filteredItems}) => filteredItems,
                    as: {
                        injections: {
                            filter: () => observable(''),
                            filteredItems: ({filter}) => computable(() => {
                                return !filter ? countries : countries.filter(country => country.name.indexOf(filter) != -1)
                            }),
                        },
                        joints: {
                            initFilter: ({items, filter, value, active}) => {
    
                                watch(() => {
                                    active.$value = items.length > 1
                                }, [items])
        
                                watch(() => {
                                    filter.$value = filterFunc(items.find(itm => itm.id == value))
                                }, [value])
    
                            },
                            updateStats: ({filter, value, selected}) => {
    
                                watch(() => stats.filter = filter, [filter])
                                watch(() => stats.value = value, [value])
                                watch(() => stats.selected = selected, [selected])
    
                            }
                        }
                    },
                })
    
            ])
        }),
        Column({
            css: 'is-three-quarters is-word-wrap',
            content: RowLayout([
                Text({
                    as: Paragraph,
                    text$: () => computable(() => `filter: ${stats.filter}`)
                }),
                Text({
                    as: Paragraph,
                    text$: () => computable(() => `value: ${stats.value}`)
                }),
                Text({
                    as: Paragraph({
                        css: 'is-size-7'
                    }),
                    text$: () => computable(() => JSON.stringify(stats.selected))
                }),
            ])
        }),
    ])
}







/*

const countryUid = (v: Country) => {
    return v.alpha2Code
}

const valueFunc = (v: Country) => {
    return v?.alpha2Code
}

const filterFunc = (v: Country) => {
    return v?.name
}


const countries = observable(COUNTRIES)

type FilterScope<I, V=I> = {
    filter: V
    filteredItems: I[]
    active: boolean
    value: V
    items: I[]
    selected: I
}

type FilterEvents<I> = {
    itemsFilter: () => string
} & DropdownOldEvents<I>

type InputScope<V> = {
    value: V
} & HtmlScope

type Stats = {
    filter?: any
    value?: any
    selected?: any
}

const stats: Stats = observable({filter: null, value: null, selected: null})






export default () : HtmlBlueprint => {
    return RowLayout([
        ColumnLayout([
            Custom<FilterScope<Country, string>, FilterEvents<Country>>({
                injections: {
                    filter: () => observable(''),
                    filteredItems: ({filter}) => computable(() => {
    //                    debugger
                        return !filter ? countries : countries.filter(country => country.name.indexOf(filter) != -1)
                    }, null, countryUid)
                },
                styles: {
                    marginBottom: 140
                },
                as: DropdownOld<Country, string, FilterScope<Country, string>>({
                    value$: () => observable('ZW'),
                    items$: (scope) => scope.filteredItems,
                    itemToKey: (item) => item?.alpha2Code,
                    valueToKey: (value) => value,
                    itemToValue: (item) => item?.alpha2Code,
                        defaultItem: DropdownOldItem<Country, string, DropdownOldScope<Country, string>&FilterScope<Country, string>>({
                        text$: (scope) => scope.item.name,
                    }),
                    trigger: mix<FilterScope<Country, string>&InputScope<string>, FilterEvents<Country>>(false, DropdownOldTrigger({
                        content: {
                            tag: 'input',
                            css: 'input',
                            events: {
                                $dom: {
                                    input: (e, {value}) => {
                                        value.$value = (e.target as any).value
                                        value.$emit('itemsFilter')
                                    },
                                    focus: (e, {value}) => {
    //                                    active.$value = true
                                        value.$emit('itemsFilter')
                                    },
                                    keyDown: (e, {filter, selected}) => {
                                        if (e.code == 'Escape') {
                                            filter.$value = filterFunc(selected)
                                        }
                                    }    
                                }
                            },
                            injections: {
                                value: (scope) => scope.filter
                            },
                            reactions: {
                                value: (v) => ({dom: {defaultValue: v || ''}})
                            },
                            joints: {
                                domValue: ({value, $dom}) => {
                                    value.$subscribe(next => {
                                        if ($dom.$value) {
                                            const htmlValue = ($dom.$value as HTMLInputElement).value
                                            if (htmlValue != next) {
                                                ($dom.$value as HTMLInputElement).value = next
                                            }
                                        }
                                    })
                                },
                                initEl: ({$dom, value}) => {
                                    $dom.$subscribe((el) => {
//                                            el && ((el as HTMLInputElement).value = value)
                                    })
                                }
                            }
                        }
                    }))
                }),
                events: {
                    itemsFilter: (evt, {active, filteredItems}) => {
                        active.$value = filteredItems.length > 1
                    },
                    itemSelect: (itm, {active, value, filter}) => {
                        active.$value = false
                        value.$value = valueFunc(itm)
                        filter.$value = filterFunc(itm)
                    }
                },
                joints: {
                    initFilter: ({filter}) => {
                        filter.$event('itemsFilter')
                    },
                    initValueFilter: ({value, filter, items}) => {

                        items.forEach(itm => {
                            if (valueFunc(itm as any) == value) {
                                filter.$value = filterFunc(itm)
                            }
                        })
                    },
                    updateStats: ({filter, value, selected}) => {
                        filter.$subscribe(next => {
                            stats.filter = next
                        })
                        value.$subscribe(next => {
                            stats.value = next
                        })
                        selected.$subscribe(next => {
                            stats.selected = next
                        })                            
                    }
                }
            }),
            Custom({
                items: [
                    Text({
                        as: Paragraph,
                        text$: () => computable(() => `filter: ${stats.filter}`)
                    }),
                    Text({
                        as: Paragraph,
                        text$: () => computable(() => {
                            return `selected: ${JSON.stringify(stats.selected).substr(0, 60)}`
                        })
                    }),
                    Text({
                        as: Paragraph,
                        text$: () => computable(() => {
//                            console.log('compute value', stats.value, stats)
                            return `value: ${stats.value}`
                        })
                    }),
                ]
            })
        ])
    ])
}

*/
