import { Blueprint, callable, computable, InferBlueprint, mix, observable, Scope } from "@chorda/core";
import { ColumnLayout, RowLayout } from "chorda-bulma";
import { Dropdown, Paragraph, Text, DropdownItem, DropdownScope, DropdownProps } from "../../helpers";
import { COUNTRIES, Country } from "../../data";
import { withMultiselect } from "./common/with-multiselect";
import { withBlueprint } from "../../utils";

type CountryRecord = Country & {id: any}

const countries = observable(COUNTRIES.slice(0, 50), (v: Country) => v.alpha2Code);

const value1: string[] = observable(['BE']);


type CountryMultiDropdownType = <T, E>(props: DropdownProps<T&DropdownScope<CountryRecord[]>, CountryRecord[], CountryRecord[], E>) => InferBlueprint<T, E>

const CountryMultiDropdown : CountryMultiDropdownType = (props) => withMultiselect(Dropdown(props)) //Dropdown


export default <T>() : InferBlueprint<T> => {
    return ColumnLayout([
        RowLayout([
            Text({
                as: Paragraph,
                text$: () => computable(() => value1.join(','))
            }),
            withBlueprint({
                css: 'mb-140px',
                as: CountryMultiDropdown({
                    value$: () => value1,
                    items$: () => computable(() => countries.map(c => {return {...c, id: c.alpha2Code}})),
                    itemAs: DropdownItem({
                        isSelected$: ({selected, item}) => computable(() => {
                            return selected.filter(s => s.id == item.id).length > 0
                        }),
                    }),
                }),
            })
        ])
    ])
}
