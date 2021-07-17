import { HtmlBlueprint, iterable, observable, patch } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Coerced, DataScope } from "../../utils"
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
        Coerced<{countries: Country[]}>({
            injectors: {
                countries: () => iterable(COUNTRIES)
            },
            reactors: {
                countries: (v) => patch({items: v})
            },
            as: Select({
                defaultOption: Coerced<Country&{__it: Country}, {countries: Country[]}>({
                    injectors: {
                        name: (scope) => scope.__it.name
                    },
                    reactors: {
                        name: (v) => patch({text: v})
                    },
                    as: Option
                })
            }),
        })
    ])
}