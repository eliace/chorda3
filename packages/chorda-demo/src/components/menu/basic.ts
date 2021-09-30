import { InferBlueprint } from "@chorda/core"
import { Box, Menu, MenuGroup, MenuItem } from "chorda-bulma"



export default () : InferBlueprint<unknown> => {
    return Box({
        styles: {
            width: 400
        },
        content: Menu({
            groups: [
                MenuGroup({
                    label: 'General',
                    items: [
                        MenuItem({text: 'Dashboard'}),
                        MenuItem({text: 'Customers'}),
                    ]
                }),
                MenuGroup({
                    label: 'Administration',
                    items: [
                        MenuItem({text: 'Team Settings'}),
                        MenuItem({
                            active: true,
                            text: 'Manage Your Team',
                            items: [
                                MenuItem({text: 'Members'}),
                                MenuItem({text: 'Plugins'}),
                                MenuItem({text: 'Add a member'}),
                            ]
                        }),
                        MenuItem({text: 'Invitations'}),
                        MenuItem({text: 'Cloud Storage Environment Settings'}),
                        MenuItem({text: 'Authentication'}),
                    ]
                }),
                MenuGroup({
                    label: 'Transactions',
                    items: [
                        MenuItem({text: 'Payments'}),
                        MenuItem({text: 'Transfers'}),
                        MenuItem({text: 'Balance'}),
                    ]
                }),
            ]
        })
    })
}