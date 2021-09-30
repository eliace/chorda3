import { HtmlBlueprint, iterable, observable } from "@chorda/core";
import { Cell, Row, Table } from "chorda-bulma";
import { COUNTRIES, Country } from "../data";
import { Coerced } from "../utils";


type ExampleScope = {
    data: Country[]
    data2: Country[]
}

const countries = observable(COUNTRIES, (v) => v.name)

const screenNulls = <T>(v: T) => v == null ? '-' : String(v)

export default () : HtmlBlueprint => {
    return Table<ExampleScope>({
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
        defaultRow: Coerced<{data: Country}>({
            as: Row({
                cells: [
                    Cell({ data$: ({data}) => data.name }),
                    Cell({ data$: ({data}) => data.capital }),
                    Cell({ data$: ({data}) => data.region }),
                    Cell({ data$: ({data}) => data.area }),
                    Cell({ data$: ({data}) => data.population }),
                    Cell({ data$: ({data}) => data.gini, format: screenNulls }),
                ]
            })
        }),
        data$: () => countries
    })
}
