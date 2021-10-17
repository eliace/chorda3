import { InferBlueprint, observable, patch } from "@chorda/core";
import { Box, Button, RowLayout, Image, Modal } from "chorda-bulma";
import { Nasa } from "../api";
import { CURIOSITY_IMAGE_URL, IMAGE_PLACEHOLDER, Movie } from "../data";

import { ListBox, ListBoxItem } from "../extended/listbox/ListBox";
import { ListBlueprint, withBlueprint, withHtml, withHtmlBlueprint, withList } from "../utils";

let data = observable([])


//const active = observable(false as boolean)

type HugeScope = {
    active: boolean
    roverImageUrl: string
    modal: boolean
}

export default () : InferBlueprint<HugeScope> => {
    return Box({
        content: {
        templates: {
            button: Button({
                text: 'Show list',
                onClick: (e, {active}) => {
                    Nasa.api.mars.getRoverPhotos(Nasa.Rovers.Curiosity, 1000)
                        .then(response => {
                            data.$value = response.photos
                        })
                }
            }),
            list: ListBox({
                as: withList(<ListBlueprint<Nasa.Photo, HugeScope>>{
                    defaultItem: ListBoxItem({
                        text$: $ => $.item.id,
                        subtitle$: $ => $.item.camera.full_name,
                        image$: $ => CURIOSITY_IMAGE_URL,
                        as: {
                            templates: {
                                image: withHtmlBlueprint({
                                    tag: 'a',
                                    events: {
                                        $dom: {
                                            click: (e, {modal, roverImageUrl, item}) => {
                                                modal.$value = true
                                                roverImageUrl.$value = item.img_src
                                            }
                                        }
                                    },
                                    as: Image({
                                        rounded: false,
                                        lazy: true,
                                    }),
                                }),
                            }
                        }
                    }),
                    initials: {
                        items: () => data
                    }
                })
            }),
            modal: Modal({
                content: Image({
                    url$: $ => $.roverImageUrl
                }),
                active$: $ => $.modal,
            })
        },
        initials: {
            active: () => observable(true),
            modal: () => observable(false),
            roverImageUrl: () => observable(null),
        },
        reactions: {
            // active: v => patch({components: {
            //     list: v
            // }}),
            modal: v => patch({components: {
                modal: v
            }}),
        }
    }
    })
}