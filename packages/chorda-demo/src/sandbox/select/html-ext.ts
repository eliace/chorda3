import { computable, HtmlBlueprint, observable, patch } from "@chorda/core"
import { Box, RowLayout } from "chorda-bulma"
import { Coerced, Custom } from "../../utils"
import { COUNTRIES, Country } from "../../data"
import { Select2, Option2 } from "./common/select2"
import { Paragraph, Text } from '../../helpers'

type SelectedScope = {
    selected: string
}

const countries = observable(COUNTRIES)

export default () : HtmlBlueprint => {
    return RowLayout([
        Select2<Country>({
            options$: () => countries,
            defaultOption: Option2<Country>({
                text$: ({option}) => option.name
            })
        }),
        Coerced<SelectedScope>({
            injectors: {
                selected: () => observable('Andorra')
            },
            items: [
                Select2<Country, SelectedScope>({
                    options$: () => countries,
                    value$: ({selected}) => selected,
                    defaultOption: Option2<Country>({
                        text$: ({option}) => option.name
                    }),
                }),
                Text({
                    as: Paragraph,
                    text$: ({selected}) => computable(() => `selected: ${selected}`)
                })    
            ]
        }),
        Coerced<SelectedScope>({
            injectors: {
                selected: () => observable('TH')
            },
            items: [
                Select2<Country, SelectedScope>({
                    options$: () => countries,
                    value$: (scope) => scope.selected,
                    defaultOption: Option2<Country>({
                        text$: (scope) => scope.option.name,
                        key$: (scope) => scope.option.alpha2Code,
                    }),
                }),
                Text({
                    as: Paragraph,
                    text$: (scope) => computable(() => `selected: ${scope.selected}`)
                })    
            ]
        }),
    ])
}