import { Blueprint, computable, HtmlBlueprint, InferBlueprint, observable, patch } from "@chorda/core"
import { Box, RowLayout } from "chorda-bulma"
import { COUNTRIES, Country } from "../../data"
import { Select2, Option2 } from "./common/select2"
import { Paragraph, Text } from '../../helpers'

type SelectedScope = {
    selected: string
}

const countries = observable(COUNTRIES)

export default () : InferBlueprint<unknown> => {
    return RowLayout([
        Select2<Country>({
            options$: () => countries,
            optionAs: Option2<Country>({
                text$: ({option}) => option.name
            })
        }),
        <Blueprint<SelectedScope>>{
            injections: {
                selected: () => observable('Andorra')
            },
            items: [
                Select2<Country, SelectedScope>({
                    options$: () => countries,
                    value$: ({selected}) => selected,
                    optionAs: Option2<Country>({
                        text$: ({option}) => option.name
                    }),
                }),
                Text({
                    as: Paragraph,
                    text$: ({selected}) => computable(() => `selected: ${selected}`)
                })    
            ]
        },
        <Blueprint<SelectedScope>>{
            injections: {
                selected: () => observable('TH')
            },
            items: [
                Select2<Country, SelectedScope>({
                    options$: () => countries,
                    value$: (scope) => scope.selected,
                    optionAs: Option2<Country>({
                        text$: (scope) => scope.option.name,
                        key$: (scope) => scope.option.alpha2Code,
                    }),
                }),
                Text({
                    as: Paragraph,
                    text$: (scope) => computable(() => `selected: ${scope.selected}`)
                })    
            ]
        },
    ])
}