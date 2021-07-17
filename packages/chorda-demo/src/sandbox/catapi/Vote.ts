import { HtmlBlueprint, mix, observable, patch } from "@chorda/core"
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { Button, Buttons, Card, Image } from "chorda-bulma"
import { BgImage, FaIcon, SvgIcon } from "../../helpers"
import { api } from "./api"

type VoteScope = {
    imageUrl: string
}


export const Vote = () : HtmlBlueprint => {
    return mix<VoteScope>({
        injectors: {
            imageUrl: () => observable(null)
        },
        joints: {
            imageUrl: {
                autoLoad: (imageUrl) => {
                    api.searchImages({breed_id: 'norw'}).then(breeds => {
                        imageUrl.$value = breeds[0].url
                    })
                }
            }
        },
        templates: {
            buttons: {
                css: 'pb-5',
                templates: {
                    content: Buttons({
                        centered: true,
                        buttons: [
                            Button({
                                text: 'Love It', 
                                css: 'is-success', 
                                leftIcon: FaIcon({icon: faThumbsUp})
                            }),
                            Button({
                                text: 'Nope It', 
                                css: 'is-danger',
                                leftIcon: FaIcon({icon: faThumbsDown})
                            }),
                        ]
                    })
                }
            },
            image: {
                templates: {
                    content: Card({
                        css: 'catapi-vote-card',
                        content: false,
                        image: BgImage({
                            url$: (scope) => scope.imageUrl,
                            height: 400
                        })
                        // image: Image({
                        //     url$: (ctx: any) => ctx.imageUrl
                        // }),
                    })
                }
            }
        }
    })
}
