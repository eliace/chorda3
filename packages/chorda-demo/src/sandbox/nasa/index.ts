import { computable, InferBlueprint, observable } from "@chorda/core"
import { Box, Tab, Tabs } from "chorda-bulma"
import { withAs } from "../../utils"
import { Apod } from "./apod"
import { Images } from "./images"
import { Mars } from "./mars"






export const NasaExample = () : InferBlueprint<{selected: string}> => {
    return withAs({
        as: Box,
        css: 'nasa-box mt-3',
        items: [
            Tabs({
                centered: true,
                tabs: [
                    Tab({text: 'APOD', name: 'apod'}),
                    Tab({text: 'Mars Rover Photos', name: 'mars'}),
                    Tab({text: 'Images', name: 'images'}),
                ],
                defaultTab: Tab({
                    active$: ({selected, name}) => computable(() => {
                        return selected == name
                    }),
                    onClick: (e, {selected, name}) => {
                        selected.$value = name
                    }
                })

            }),
            {
                components: false,
                templates: {
                    apod: Apod,
                    mars: Mars,
                    images: Images,
                },
                reactions: {
                    selected: v => ({components: {
                        apod: v == 'apod',
                        mars: v == 'mars',
                        images: v == 'images',
                    }})
                }
            }
        ],
        defaults: {
            selected: () => observable('apod')
        }
    })
}