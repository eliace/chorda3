import { HtmlBlueprint } from "@chorda/core"
import { Button, Buttons } from "chorda-bulma"



export default () : HtmlBlueprint => {
    return Buttons({
        defaultButton: Button({
            onClick: (evt) => {
                console.log(evt)
            }
        }),
        buttons: [
            Button({text: 'GitHub', color: 'is-info'}),
            Button({text: '@jgthms', color: 'is-success'}),
            Button({text: 'Save', color: 'is-warning'}),
            Button({
                text: 'Delete',
                // onClick: (evt, {color}) => {
                //     color.$set(nextColor(color.$get()))
                // }
            })
        ]
    })
}