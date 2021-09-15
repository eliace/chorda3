import { HtmlBlueprint, iterable, mix, observable, patch } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Coerced, DataScope, withItem, withIterableItems, withScope } from "../../utils"
import { COUNTRIES, Country } from "../../data"
import { Option, Select } from "./common/select"


export default () : HtmlBlueprint => {
    return RowLayout([
        Select({
            options: [
                Option({text: 'Alice'}),
                Option({text: 'Bob'}),
                Option({text: 'Charlie'}),
            ]
        }),
        Select({
            options: COUNTRIES.map(country => Option({text: country.name}))
        }),
        Select({
            size: 8,
            value: 'AD',
            options: COUNTRIES.map(country => Option({text: country.name, value: country.alpha2Code}))
        }),
        Select({
            defaultOption: Option({
                as: withItem<Country>({
                    reactions: {
                        item: (v) => patch({text: v.name})
                    }                    
                }),
            }),
            as: withIterableItems<Country[]>({
                injections: {
                    list: () => COUNTRIES
                },
            })
        }),
        // Coerced<{countries: Country[]}>({
        //     injections: {
        //         countries: () => iterable(COUNTRIES)
        //     },
        //     reactions: {
        //         countries: (v) => patch({items: v})
        //     },
        //     as: Select({
        //         defaultOption: Coerced<Country&{__it: Country}, {countries: Country[]}>({
        //             injections: {
        //                 name: (scope) => scope.__it.name
        //             },
        //             reactions: {
        //                 name: (v) => patch({text: v})
        //             },
        //             as: Option
        //         })
        //     }),
        // })
    ])
}