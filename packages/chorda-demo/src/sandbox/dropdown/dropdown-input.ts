import { computable, HtmlBlueprint, HtmlScope, mix, observable, patch } from "@chorda/core";
import { ColumnLayout, RowLayout } from "chorda-bulma";
import { Custom } from "../../utils";
import { COUNTRIES, Country } from "../../data";
import { Paragraph, Text, Dropdown, DropdownEvents, DropdownItem, DropdownScope, DropdownTrigger } from "../../helpers";

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
    itemsFilter?: () => string
} & DropdownEvents<I>

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
                injectors: {
                    filter: () => observable(''),
                    filteredItems: ({filter}) => computable(() => {
    //                    debugger
                        return !filter ? countries : countries.filter(country => country.name.indexOf(filter) != -1)
                    }, null, countryUid)
                },
                styles: {
                    marginBottom: 140
                },
                as: Dropdown<Country, string, FilterScope<Country, string>>({
                    value$: () => observable('ZW'),
                    items$: (scope) => scope.filteredItems,
                    itemToKey: (item) => item?.alpha2Code,
                    valueToKey: (value) => value,
                    itemToValue: (item) => item?.alpha2Code,
                        defaultItem: DropdownItem<Country, string, DropdownScope<Country, string>&FilterScope<Country, string>>({
                        text$: (scope) => scope.item.name,
                    }),
                    trigger: mix<FilterScope<Country, string>&InputScope<string>, FilterEvents<Country>>(false, DropdownTrigger({
                        content: {
                            tag: 'input',
                            css: 'input',
                            events: {
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
                            },
                            injectors: {
                                value: (scope) => scope.filter
                            },
                            reactors: {
                                value: (v) => patch({dom: {defaultValue: v || ''}})
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
