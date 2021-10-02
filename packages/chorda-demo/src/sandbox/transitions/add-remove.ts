import { InferBlueprint, iterable, observable, patch } from "@chorda/core"
import { Button, Buttons, List, ListItem } from "chorda-bulma"
import { Text } from "../../helpers"
import { withShowHide } from "./utils"


type AddRemoveScope = {
    items: number[]
    nextNum: number
    add: () => void
    remove: () => void
    randomIndex: () => number
}


export default () : InferBlueprint<AddRemoveScope> => {
    return {
        injections: {
            nextNum: () => observable(10),
            items: () => observable([1,2,3,4,5,6,7,8,9], (v) => v),
            randomIndex: ({items}) => () => Math.floor(Math.random() * items.length),
            add: ({items, randomIndex, nextNum}) => () => {
                items.splice(randomIndex(), 0, nextNum.$value++)
            },
            remove: ({items, randomIndex}) => () => items.splice(randomIndex(), 1)
        },
        templates: {
            buttons: Buttons({
                buttons: [
                    Button({
                        text: 'Add',
                        onClick: (e, {add}) => add()
                    }),
                    Button({
                        text: 'Remove',
                        onClick: (e, {remove}) => remove()
                    }),
                ]
            }),
            list: List({
                defaultItem: withShowHide(ListItem({
                    css: 'list__item'
                }), 'list', 'list'),
                items$: ($) => iterable($.$context.items, 'text')
            })
        }
    }
}