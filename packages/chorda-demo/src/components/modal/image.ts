import { InferBlueprint, observable } from "@chorda/core"
import { Button, Card, Image, Modal, RowLayout } from "chorda-bulma"
import { IMAGE_1, LOREM_IPSUM_HTML } from "../../data"

const isOpened = observable(false as boolean)

export default () : InferBlueprint<unknown> => {
    return RowLayout([
        Button({
            text: 'Open modal image',
            onClick: () => {
                isOpened.$value = !isOpened.$value
            }
        }),
        Modal({
            content: Image({
                url: IMAGE_1
            }),
            active$: () => isOpened
        })
    ])
}