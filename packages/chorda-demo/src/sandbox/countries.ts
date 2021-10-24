import { InferBlueprint, iterable, observable } from "@chorda/core";
import { Cell, Row, RowProps, RowPropsType, Table } from "chorda-bulma";
import { COUNTRIES, Country } from "../data";


type ExampleScope = {
    data: Country[]
    data2: Country[]
}

const countries = observable(COUNTRIES, (v) => v.name)

const screenNulls = <T>(v: T) => v == null ? '-' : String(v)

export default () : InferBlueprint<ExampleScope> => {
    return Table({
        headerRows: [
            Row({
                cells: [
                    Cell({text: 'Name'}),
                    Cell({text: 'Capital'}),
                    Cell({text: 'Region'}),
                    Cell({text: 'Area'}),
                    Cell({text: 'Population'}),
                    Cell({text: 'GINI'}),
                ]
            })
        ],
        defaultRow: Row(<RowPropsType<Country>>{
            cells: [
                Cell({ data$: ({data}) => data.name }),
                Cell({ data$: ({data}) => data.capital }),
                Cell({ data$: ({data}) => data.region }),
                Cell({ data$: ({data}) => data.area }),
                Cell({ data$: ({data}) => data.population }),
                Cell({ data$: ({data}) => data.gini, format: screenNulls }),
            ]
        }),
        data$: () => countries
    })
}
