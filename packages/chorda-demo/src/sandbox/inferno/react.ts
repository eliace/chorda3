import { InferBlueprint } from "@chorda/core"
import { RowLayout, Message } from "chorda-bulma"
import { LOREM_IPSUM_HTML } from "../../data"
import { withReact } from "./with-react"



export default <T>() : InferBlueprint<T> => {
    return withReact({
        text: 'Hello React!',
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
