import { Infer } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Coerced, DataScope, ItemBlueprint, ListBlueprint, withItem, withIterableItems, withList } from "../../utils"
import { COUNTRIES, Country } from "../../data"
import { Option, Select } from "./common/select"


export default () : Infer.Blueprint<unknown> => {
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
            optionAs: withItem(<ItemBlueprint<Country>>{
                reactions: {
                    item: (v) => ({text: v.name})
                }                    
            }),
            as: withList(<ListBlueprint<Country>>{
                injections: {
                    items: () => COUNTRIES
                },
            })
        }),
   ])
}