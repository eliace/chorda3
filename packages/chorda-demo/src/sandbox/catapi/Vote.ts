import { HtmlBlueprint, HtmlScope, InferBlueprint, mix, observable, ownTask, patch } from "@chorda/core"
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { Button, Buttons, Card } from "chorda-bulma"
import { IMAGE_BASE64 } from "../../data"
import { CatApi } from "../../api"
import { BgImage, BgImageScope, FaIcon, FaSvgIcon, SvgImagePlaceholder } from "../../helpers"


type VoteScope = {
    imageUrl: string
    imageLoading: boolean
}

const asyncImageLoad = (url: string) : Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.addEventListener('load', () => {
            console.log('image loaded')
            resolve(url)
        })    
    })
}


export const Vote = () : InferBlueprint<VoteScope&HtmlScope> => {
    return {
        injections: {
            imageUrl: () => observable(null),
            imageLoading: () => observable(false),
        },
        joints: {
            autoLoad: ({imageUrl, imageLoading}) => {

                imageLoading.$value = true

                CatApi.api
                    .searchImages({breed_id: 'norw'})
                    .then(breeds => asyncImageLoad(breeds[0].url))
                    .then((url) => {
                        imageLoading.$value = false
                        imageUrl.$value = url                       
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
                        css: 'catapi-vote-card p-4',
                        content: false,
                        image: BgImage({
                            url$: (scope) => scope.imageUrl,
                            height: 400,
                            as: {
                                templates: {
                                    content: {
                                        joints: {
                                            showHide: ({$dom, url, $renderer, $patcher}) => {
        
                                                const name = 'fade'
        
                                                const show = () => {
                                                    if ($dom.$value && url.$value) {
                                                        const el = $dom.$value
                                                        el.classList.add(name+'-enter')
                                                        $patcher.publish($renderer.task(() => {
                                                            el.classList.add(name+'-enter-active'/*, name+'-enter'*/)
                                                            
                                                            el.classList.remove(name+'-enter')
                                                            const f = (evt: TransitionEvent) => {
                                                                el.removeEventListener('transitionend', f)
                                                                el.classList.remove(name+'-enter-active')
                                                            }
                                                            el.addEventListener('transitionend', f)    
                                                        }))
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
                                        // reactions: {
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
            },
        }
    }
}
