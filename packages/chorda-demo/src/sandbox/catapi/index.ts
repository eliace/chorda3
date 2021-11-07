import { computable, InferBlueprint, observable } from "@chorda/core";
import { Box, Tab, Tabs } from "chorda-bulma";
import { Custom } from "../../utils";
import { Breeds } from "./Breeds";
import { Favourites } from "./Favourites";
import { Search } from "./Search";
import { Vote } from "./Vote";



type CatApiScope = {
    selected: string
}


export const CatApi = () : InferBlueprint<CatApiScope> => {
    return Custom({
        as: Box,
        css: 'catapi-box',
        items: [
            Tabs({
                centered: true,
                tabs: [
                    Tab({text: 'Vote', name: 'vote'}),
                    Tab({text: 'Breeds', name: 'breeds'}),
                    Tab({text: 'Images/Search', name: 'search'}),
                    Tab({text: 'Favourites', name: 'favourites'}),
                    Tab({text: 'Upload', name: 'upload'}),
                ],
                defaultTab: Tab({
                    active$: ({selected, name}) => computable(() => {
                        return selected == name
                    }),
                    onClick: (e, {selected, name}) => {
//                        debugger
                        selected.$value = name
                    }
                })
            }),
            {
                components: false,
                templates: {
                    vote: Vote,
                    breeds: Breeds,
                    search: Search,
                    favourites: Favourites,
                },
                reactions: {
                    selected: (v) => ({components: {
                        vote: v == 'vote',
                        breeds: v == 'breeds',
                        search: v == 'search',
                        favourites: v == 'favourites',
                    }})
                }
            }
        ],
        injections: {
            selected: () => observable('vote')
        }
    })
}
