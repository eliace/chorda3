import { InferBlueprint } from "@chorda/core"
import { RowLayout, Tab, Tabs } from "chorda-bulma"


export default () => {
    return RowLayout([
        Tabs({
            centered: true,
            tabs: [
                Tab({text: 'Pictures', active: true}),
                Tab({text: 'Music'}),
                Tab({text: 'Videos'}),
                Tab({text: 'Documents'}),
            ]
        }),
        Tabs({
            right: true,
            tabs: [
                Tab({text: 'Pictures', active: true}),
                Tab({text: 'Music'}),
                Tab({text: 'Videos'}),
                Tab({text: 'Documents'}),
            ]
        })        
    ])
}