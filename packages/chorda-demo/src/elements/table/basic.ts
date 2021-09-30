import { InferBlueprint, iterable, observable } from "@chorda/core"
import { Cell, CellProps, Row, RowProps, Table, TableScope } from "chorda-bulma"
import { NhlApi } from "../../api"
import { Text } from '../../helpers'

const TEAMS = observable([] as NhlApi.Team[])

NhlApi.api.getTeams().then(response => {
    TEAMS.$value = response.teams
})

export default () : InferBlueprint<unknown> => {
    return {
        templates: {
            content: Table({
                headerRows: [
                    Row({
                        cells: [
                            {text: 'Name'},
                            {text: 'Abbr'},
                            {text: 'FirstYearOfPlay'},
                            {text: 'Division'},
                            {text: 'Venue'},
                            {text: 'Conference'},
                            {text: 'Franchise'},
                        ]
                    })
                ],
                defaultRow: Row(<RowProps<NhlApi.Team, TableScope>>{
                    cells: [
                        Text({
                            as: Cell,
                            text$: $ => $.data.name
                        }),
                        Text({
                            as: Cell,
                            text$: $ => $.data.abbreviation
                        }),
                        Text({
                            as: Cell,
                            text$: $ => $.data.firstYearOfPlay
                        }),
                        Text({
                            as: Cell,
                            text$: $ => $.data.division.nameShort
                        }),
                        Text({
                            as: Cell,
                            text$: $ => $.data.venue.name
                        }),
                        Text({
                            as: Cell,
                            text$: $ => $.data.conference.name
                        }),
                        Text({
                            as: Cell,
                            text$: $ => $.data.franchise.teamName
                        }),
                    ]
                }),
                data$: () => TEAMS
            })
        }
    }
}
