import { InferBlueprint } from "@chorda/core"
import { Message } from "chorda-bulma"
import { LOREM_IPSUM_HTML } from "../../data"

export default () : InferBlueprint<unknown> => {
    return Message({
        title: 'Hello World',
        html: LOREM_IPSUM_HTML
    })
}