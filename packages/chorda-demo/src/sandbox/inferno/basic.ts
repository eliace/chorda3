import { InferBlueprint } from "@chorda/core"
import { RowLayout, Message } from "chorda-bulma"
import { LOREM_IPSUM_HTML } from "../../data"
import { withInferno } from "./with-inferno"



export default <T>() : InferBlueprint<T> => {
    return withInferno({
        text: 'Hello Inferno!',
        templates: {
            list: RowLayout([
                Message({
                    title: 'Hello World',
                    html: LOREM_IPSUM_HTML
                })
            ])
        }
    })
}
