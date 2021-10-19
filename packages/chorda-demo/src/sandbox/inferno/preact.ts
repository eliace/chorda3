import { InferBlueprint } from "@chorda/core"
import { RowLayout, Message } from "chorda-bulma"
import { LOREM_IPSUM_HTML } from "../../data"
import { withPreact } from "./with-preact"



export default <T>() : InferBlueprint<T> => {
    return withPreact({
        text: 'Hello Preact!',
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
