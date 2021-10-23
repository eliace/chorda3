import { InferBlueprint, observable, patch } from "@chorda/core"
import { Field, MediaLayout, Image } from "chorda-bulma"
import { Nasa } from "../../api"
import { debounced, ListBlueprint, watch, withItem, withList } from "../../utils"
import { BgImage, TextInput } from "../../helpers"
import _ from "lodash"



type ImagesScope = {
    query: string
    collection: Nasa.Images.Collection
    page: number
}


export const Images = () : InferBlueprint<ImagesScope> => {
    return {
        templates: {
            form: {
                templates: {
                    search: Field({
                        control: TextInput({
                            placeholder: 'Search text',
                            value$: $ => $.query,
                        })
                    })    
                }
            },
            result: {
                templates: {
                    list: withList(<ListBlueprint<Nasa.Images.Item, ImagesScope>>{
                        styles: {
                            maxHeight: 460,
                            overflow: 'auto',
                        },
                        injections: {
                            items: $ => $.collection.items
                        },
                        defaultItem: MediaLayout({
                            templates: {
                                content: BgImage({
                                    url$: $ => $.item.links[0].href,
                                    as: {
                                        css: 'search-preview'
                                    }
                                }),
                            }
                        }),
                
                        // defaultItem: {
                        //     reactions: {
                        //         item: v => patch({text: JSON.stringify(v)})
                        //     }
                        // }
                    })
                }
            }
        },
        initials: {
            query: () => observable('soyuz'),
            collection: () => observable(null),
            page: () => observable(1),
        },
        joints: {
            search: ({query, collection, page}) => {

                watch(_.debounce(() => {

                    if (query.$value) {
                        Nasa.api.images.search(query.$value, page.$value).then(data => {
                            collection.$value = data.collection
                        })    
                    }
                    else {
                        collection.$value = null
                    }

                }, 600), [query])

            }
        }
    }
}