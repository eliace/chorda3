import { HtmlBlueprint } from "@chorda/core"

export default () : HtmlBlueprint => {
    return {
        tag: 'select',
        defaultItem: {
            tag: 'option'
        },
        items: [
            {text: 'Alice'},
            {text: 'Bob'},
            {text: 'Charlie'},
        ]
    }
}