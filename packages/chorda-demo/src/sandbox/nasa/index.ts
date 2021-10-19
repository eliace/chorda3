import { computable, InferBlueprint, observable, patch } from "@chorda/core"
import { Box, Tab, Tabs } from "chorda-bulma"
import { withAs } from "../../utils"
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
                    Tab({text: 'Mars', name: 'mars'}),
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
                    mars: Mars,
                    images: Images,
                },
                reactions: {
                    selected: v => patch({components: {
                        mars: v == 'mars',
                        images: v == 'images',
                    }})
                }
            }
        ],
        initials: {
            selected: () => observable('mars')
        }
    })
}