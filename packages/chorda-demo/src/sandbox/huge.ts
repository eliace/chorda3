import { InferBlueprint, observable, patch } from "@chorda/core";
import { Box, Button, RowLayout, Image, Modal, Tag } from "chorda-bulma";
import { Nasa } from "../api";
import { CURIOSITY_IMAGE_URL, IMAGE_PLACEHOLDER, Movie } from "../data";

import { ListBox, ListBoxItem } from "../extended/listbox/ListBox";
import { Text } from "../helpers";
import { ListBlueprint, withAs, withBlueprint, withHtml, withHtmlBlueprint, withList } from "../utils";

let data = observable([])


//const active = observable(false as boolean)

type HugeScope = {
    active: boolean
    roverImageUrl: string
    modal: boolean
}

export default () : InferBlueprint<HugeScope> => {
    return Box({
        css: 'm-3',
        styles: {
            maxWidth: '600px'
        },
        content: {
        templates: {
            button: Button({
                text: 'Show list',
                onClick: (e, {active}) => {
                    Nasa.api.images.search('mars').then(data => {
                        console.log(data)
                    })
                    // Nasa.api.mars.getRoverPhotos(Nasa.Rovers.Curiosity, 1000)
                    //     .then(response => {
                    //         data.$value = response.photos
                    //     })
                }
            }),
            list: ListBox({
                as: withList(<ListBlueprint<Nasa.Photo, HugeScope>>{
                    defaultItem: ListBoxItem({
                        text$: $ => $.item.id,
                        subtitle$: $ => $.item.camera.full_name,
                        image$: () => CURIOSITY_IMAGE_URL,
                        as: {
                            templates: {
                                rover: {
                                    templates: {
                                        tag: withAs({
                                            weight: 10,
                                            css: 'ml-2 is-after',
                                            as: Text({
                                                as: Tag,
                                                text$: $ => $.item.rover.name
                                            })
                                        })
                                    }
                                },
                                image: withHtmlBlueprint({
                                    tag: 'a',
                                    weight: -10,
                                    classes: {
                                        'is-after': false,
                                        'is-before': true,
                                    },
                                    css: 'line2',
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