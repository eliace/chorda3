import { HtmlBlueprint } from "@chorda/core"
import { Box, Image } from "chorda-bulma"
import { USERS } from "../../data"
import { ListBox, ListBoxItem } from "./ListBox"



export default () : HtmlBlueprint => {
    return Box({
        css: 'is-paddingless centered-narrow-box',
        content: ListBox({
            items: USERS.slice(0, 6).map(user => ListBoxItem({
                text: `${user.name.first} ${user.name.last}`,
                image: Image({
                    url: user.picture.thumbnail
                }),
                subtitle: user.email
            }))
        })
    }) 
}