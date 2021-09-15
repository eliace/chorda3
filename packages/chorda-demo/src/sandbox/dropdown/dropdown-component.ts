import { Blueprint, computable, HtmlBlueprint, InferBlueprint, Observable, observable, patch } from "@chorda/core";
import { ColumnLayout, RowLayout } from "chorda-bulma";
import { Custom, withBlueprint, withScope } from "../../utils";
import { COUNTRIES, Country, FRUITS } from "../../data";
import { Paragraph, Text, Dropdown } from "../../helpers";

const countries = observable(COUNTRIES.slice(0, 50))//, (v: Country) => v.alpha2Code);

const fruits = observable(FRUITS.slice(0, 50))

const value1: string = observable('BE');

const value2: string = observable('Apricot');

const value3: Country = observable({id: COUNTRIES[30].alpha2Code, ...COUNTRIES[30]});



export default <T>() : InferBlueprint<T> => {
    return ColumnLayout([
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => value1
            }),
            withBlueprint({
                css: 'mb-140px',
                as: Dropdown({
                    value$: () => value1,
                    items$: () => computable(() => countries.map(c => {return {...c, id: c.alpha2Code}}))
                })
            }),
        ]),
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => value2
            }),
            withBlueprint({
                css: 'mb-140px',
                as: Dropdown({
                    value$: () => value2,
                    items$: () => computable(() => fruits.map(c => {return {id: c, name: c}}))
                })
            })
        ]),
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => computable(() => `[${value3.alpha2Code}] ${value3.name}`)
            }),
            withBlueprint({
                css: 'mb-140px',
                as: Dropdown({
                    value$: () => value3,
                    items$: () => computable(() => countries.map(c => {return {...c, id: c.alpha2Code}})),
                    valueToKey: (v) => v.id,
                    itemToValue: (itm) => itm,
                })
            })
        ])
    ])
}
