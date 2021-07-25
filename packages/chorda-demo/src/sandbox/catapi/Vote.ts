import { HtmlBlueprint, HtmlScope, mix, observable, patch } from "@chorda/core"
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { Button, Buttons, Card } from "chorda-bulma"
import { BgImage, BgImageScope, FaIcon, SvgIcon } from "../../helpers"
import { api } from "./api"


type VoteScope = {
    imageUrl: string
    imageLoading: boolean
}


export const Vote = () : HtmlBlueprint => {
    return mix<VoteScope&HtmlScope>({
        injectors: {
            imageUrl: () => observable(null),
            imageLoading: () => observable(false)
        },
        joints: {
            autoLoad: ({imageUrl, imageLoading}) => {

                imageLoading.$value = true

                api.searchImages({breed_id: 'norw'}).then(breeds => {

                    const img = new Image()
                    img.src = breeds[0].url
                    img.addEventListener('load', () => {
                        imageLoading.$value = false
                        imageUrl.$value = breeds[0].url
                        console.log('image loaded')
                    })
                })


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
                            height: 400,
                            as: {
                                templates: {
                                    content: {
                                        joints: {
                                            showHide: ({$dom, url, $renderer}) => {
        
                                                const name = 'fade'
        
                                                const show = () => {
                                                    if ($dom.$value && url.$value) {
                                                        const el = $dom.$value
                                                        el.classList.add(name+'-enter')
                                                        $renderer.scheduleTask(() => {
                                                            el.classList.add(name+'-enter-active'/*, name+'-enter'*/)
                                                            
                                                            el.classList.remove(name+'-enter')
                                                            const f = (evt: TransitionEvent) => {
                                                                el.removeEventListener('transitionend', f)
                                                                el.classList.remove(name+'-enter-active')
                                                            }
                                                            el.addEventListener('transitionend', f)    
                                                        })
                                                    }
                                                    else {
                                                        // hidden
                                                    }
                                                }
        
                                                $dom.$subscribe((next) => {
                                                    if (next) {
//                                                        next.classList.add(name+'-enter-active', name+'-enter')
                                                    }
                                                })
                                                url.$subscribe(show)
        
                                            }
                                        },
                                        // reactors: {
                                        //     imageLoading: (v) => patch({classes: {'blurry-placeholder': v}})
                                        // },
                                    }
                                }
                            }
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
