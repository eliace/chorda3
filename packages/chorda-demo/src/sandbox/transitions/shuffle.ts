import { InferBlueprint, iterable, observable } from "@chorda/core"
import { Button, Buttons, List, ListItem } from "chorda-bulma"
import { watch, withHtml } from "../../utils"
import * as _ from "lodash"
import { withFLIP } from "./utils"


type ShuffleScope = {
    items: number[]
    shuffle: () => void
}


export default () : InferBlueprint<ShuffleScope> => {
    return {
        injections: {
            items: () => observable([1,2,3,4,5,6,7,8,9]),
            shuffle: ({items}) => () => {
                items.$value = _.shuffle(items.$value)
            }
        },
        templates: {
            buttons: Buttons({
                buttons: [
                    Button({
                        text: 'Shuffle',
                        onClick: (e, {shuffle}) => shuffle()
                    })
                ]
            }),
            list: List({
                items$: ($) => iterable($.$context.items, 'text'),
                defaultItem: withFLIP(withHtml(ListItem({
                    as: {
                        joints: {
                            init: ({flip, items, $dom}) => {
                                watch(() => {
                                    if ($dom.$value) {
                                        flip()
                                    }
                                }, [items])
                            }
                        }
                    }
                })))
            })
        }
    }
}
