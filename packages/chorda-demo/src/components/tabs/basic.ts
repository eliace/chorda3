import { InferBlueprint } from "@chorda/core"
import { Tab, Tabs } from "chorda-bulma"


export default () => {
    return Tabs({
        tabs: [
            Tab({text: 'Pictures', active: true}),
            Tab({text: 'Music'}),
            Tab({text: 'Videos'}),
            Tab({text: 'Documents'}),
        ]
    })
}