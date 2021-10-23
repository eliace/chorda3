import { Button, Buttons } from "chorda-bulma"



export default () => {
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
            Button({text: 'Delete'})
        ]
    })
}