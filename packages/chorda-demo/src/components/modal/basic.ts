import { InferBlueprint, observable } from "@chorda/core"
import { Button, Card, CardHeader, Modal, RowLayout } from "chorda-bulma"
import { LOREM_IPSUM_HTML } from "../../data"

const isOpened = observable(false as boolean)

export default () : InferBlueprint<unknown> => {
    return RowLayout([
        Button({
            text: 'Open modal',
            onClick: () => {
                isOpened.$value = !isOpened.$value
            }
        }),
        Modal({
            content: Card({
                content: {
                    html: LOREM_IPSUM_HTML
                }
            }),
            active$: () => isOpened
        })
    ])
}