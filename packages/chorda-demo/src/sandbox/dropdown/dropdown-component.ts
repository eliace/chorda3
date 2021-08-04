import { computable, HtmlBlueprint, InferBlueprint, Observable, observable, patch } from "@chorda/core";
import { ColumnLayout, RowLayout } from "chorda-bulma";
import { Custom, withBlueprint, withScope } from "../../utils";
import { COUNTRIES, Country, FRUITS } from "../../data";
import { Paragraph, Text, Dropdown } from "../../helpers";

const countries = observable(COUNTRIES.slice(0, 50), (v: Country) => v.alpha2Code);

const fruits = observable(FRUITS.slice(0, 50))

const value1: string = observable('BE');

const value2: Country = observable({id: COUNTRIES[30].alpha2Code, ...COUNTRIES[30]});

const value3: string = observable('Apricot');


export default <T>() : InferBlueprint<T> => {
    return ColumnLayout([
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => value1
            }),
            withBlueprint({
                styles: {
                    marginBottom: 140
                },
                as: Dropdown({
                    value$: () => value1,
                    items$: () => computable(() => countries.map(c => {return {...c, id: c.alpha2Code}}))
                })
            })
            
    //         Custom({
    //             styles: {
    //                 marginBottom: 140
    //             },
    //             as: Dropdown<Country, string>({
    // //                active: true,
    //                 value$: () => value1,
    //                 items$: () => countries,
    //                 itemToKey: (item) => item?.alpha2Code,
    //                 valueToKey: (value) => value,
    //                 itemToValue: (item) => item?.alpha2Code,
    //                 defaultItem: DropdownItem<Country, string>({
    //                     text$: (scope) => scope.item.name,
    //                 }),
    //                 text$: (scope) => scope.selected.name
    //             }),
    //         }),    
        ]),
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => value3
            }),
            withBlueprint({
                styles: {
                    marginBottom: 140
                },
                as: Dropdown({
                    value$: () => value3,
                    items$: () => computable(() => fruits.map(c => {return {id: c, name: c}}))
                })
            })
        ]),
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => computable(() => `[${value2.alpha2Code}] ${value2.name}`)
            }),
            withBlueprint({
                styles: {
                    marginBottom: 140
                },
                as: Dropdown({
                    value$: () => value2,
                    items$: () => computable(() => countries.map(c => {return {...c, id: c.alpha2Code}})),
                    valueToKey: (v) => v.id,
                    itemToValue: (itm) => itm,
                })
            })
            // Custom({
            //     styles: {
            //         marginBottom: 140
            //     },
            //     as: Dropdown<Country>({
            //         value$: () => value2,
            //         items$: () => countries,
            //         itemToKey: (item) => item?.alpha2Code,
            //         valueToKey: (value) => value?.alpha2Code,
            //         itemToValue: (itm) => itm,
            //         defaultItem: DropdownItem<Country>({
            //             text$: (scope) => scope.item.name,
            //             active$: ({item, selected}) => computable(() => item.alpha2Code == selected.alpha2Code)
            //         }),
            //         text$: (scope) => scope.selected.name,
            //         as: {
            //             components: {
            //                 menu: false,    // меню по умолчанию выключено
            //                 trigger: true   // триггер по умолчанию включен
            //             },
            //             reactions: {
            //                 active: (v) => {
            //                      patch({classes: {'is-active': v}, components: {menu: v}})
            //                 }
            //             }
            //         }
            //     }),
            // }),
        ])
    ])
}
