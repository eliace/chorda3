import { computable, HtmlBlueprint, Observable, observable, patch } from "@chorda/core";
import { ColumnLayout, RowLayout } from "chorda-bulma";
import { Custom } from "../../utils";
import { COUNTRIES, Country } from "../../data";
import { Paragraph, Text, Dropdown, DropdownItem, DropdownScope } from "../../helpers";

const countries = observable(COUNTRIES, (v: Country) => v.alpha2Code)

countries.$subscribe(() => {
    debugger
})


const value1: string = observable('BE');

const value2: Country = observable(countries[60]);


export default <T>() : HtmlBlueprint<T> => {
    return ColumnLayout([
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => value1
            }),
            Custom({
                styles: {
                    marginBottom: 140
                },
                as: Dropdown<Country, string>({
    //                active: true,
                    value$: () => value1,
                    items$: () => countries,
                    itemToKey: (item) => item?.alpha2Code,
                    valueToKey: (value) => value,
                    itemToValue: (item) => item?.alpha2Code,
                    defaultItem: DropdownItem<Country, string>({
                        text$: (scope) => scope.item.name,
                    }),
                    text$: (scope) => scope.selected.name
                }),
            }),    
        ]),
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => computable(() => `[${value2.alpha2Code}] ${value2.name}`)
            }),
            Custom({
                styles: {
                    marginBottom: 140
                },
                as: Dropdown<Country>({
                    value$: () => value2,
                    items$: () => countries,
                    itemToKey: (item) => item?.alpha2Code,
                    valueToKey: (value) => value?.alpha2Code,
                    itemToValue: (itm) => itm,
                    defaultItem: DropdownItem<Country>({
                        text$: (scope) => scope.item.name,
                        active$: ({item, selected}) => computable(() => item.alpha2Code == selected.alpha2Code)
                    }),
                    text$: (scope) => scope.selected.name,
                    as: {
                        components: {
                            menu: false,    // меню по умолчанию выключено
                            trigger: true   // триггер по умолчанию включен
                        },
                        reactions: {
                            active: (v) => {
                                 patch({classes: {'is-active': v}, components: {menu: v}})
                            }
                        }
                    }
                }),
            }),
        ])
    ])
}
