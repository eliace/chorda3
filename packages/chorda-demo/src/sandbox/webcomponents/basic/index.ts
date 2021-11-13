import { Infer, observable } from "@chorda/core"
import { createChordaWebComponent } from "../common/cwc"

const styles = `
.button {
    padding: 1rem;
    font-size: 1em;
    border: 1px solid #cfe5ff;
    border-radius: 3px;
    color: #fff;
    background-color: rgb(91, 171, 255);    
}

.active {
    background-color: rgb(33, 118, 208);    
}
`

customElements.define('chorda-button', createChordaWebComponent<any, any>({
    tag: 'button',
    css: 'button',
    reactions: {
        active: v => ({classes: {active: v}})
    },
    templates: {
        slot: {tag: 'slot'},
    },
    events: {
        $dom: {
            click: (e, $) => $.onClick(e)
        }
    }
}, styles))


export default () : Infer.Blueprint<any> => {
    return {
        tag: 'chorda-button',
        text: 'Click me',
        // dom: {
        //     active: true
        // },
        events: {
            $dom: {
                click: (e: any, scope: any) => {
                    scope.toggle.$value = !scope.toggle.$value
                }
            }
        },
        reactions: {
            toggle: v => ({dom: {active: v}})
        },
        defaults: {
            toggle: () => observable(false)
        }
        // items: [
        //     {text: 'Alice'},
        //     {text: 'Bob'},
        //     {text: 'Charlie'},
        // ]
    }
}