import { InferBlueprint, observable } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { Link, Modal, Image } from "chorda-bulma"
import { Nasa } from "../../api"
import { BgImage, FaIcon, FaSvgIcon, Text } from "../../helpers"
import { ListBlueprint, withAs, withList } from "../../utils"


const photos = observable([])

Nasa.api.mars.getRoverPhotos(Nasa.Rovers.Curiosity, 1001)
    .then(response => {
        photos.$value = response.photos
    })


type MarsScope = {
    roverImageUrl: string
    modal: boolean
}


export const Mars = () : InferBlueprint<MarsScope> => {
    return {
        templates: {
            form: {

            },
            tiles: {
                templates: {
                    content: withList(<ListBlueprint<Nasa.Photo, MarsScope, ReactDomEvents>>{
                        css: 'flex-tiles',
                        defaultItem: withAs({
                            as: Link,
                            css: 'flex-tile',
                            templates: {
                                image: BgImage({
                                    url$: $ => $.item.img_src
                                }),
                                camera: Text({
                                    css: 'rover-camera',
                                    text$: $ => $.item.camera.name,
                                    as: {
                                        templates: {
                                            icon: FaIcon({
                                                icon: faCamera,
                                                as: {
                                                    weight: -10
                                                }
                                            })
                                        }
                                    }
                                })
                            },
                            events: {
                                $dom: {
                                    click: (e, {modal, roverImageUrl, item}) => {
                                        modal.$value = true
                                        roverImageUrl.$value = item.img_src
                                    }
                                }
                            }
                        }),
                        initials: {
                            items: () => photos
                        }
                    })
                }
            },
            modal: Modal({
                content: Image({
                    url$: $ => $.roverImageUrl
                }),
                active$: $ => $.modal,
            })
        },
        initials: {
            modal: () => observable(false),
            roverImageUrl: () => observable(null),
        }
    }
}