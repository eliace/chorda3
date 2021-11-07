import { computable, HtmlBlueprint, iterable, iterator, observable } from "@chorda/core"
import { Box, Image } from "chorda-bulma"
import { Coerced } from "../../utils"
import { User, USERS } from "../../data"
import { ListBox, ListBoxItem } from "./ListBox"

type DataScope<T> = {
    data: T
}

const users = observable(USERS.slice(10, 14), (v) => v.id.value)


export default () : HtmlBlueprint => {
    return Box({
        css: 'is-paddingless centered-narrow-box',
        content: Coerced<DataScope<User[]>>({
            as: ListBox({
                defaultItem: Coerced<DataScope<User>, DataScope<User[]>>({
                    as: ListBoxItem({
                        text$: ({data}) => computable(() => `${data.name.first} ${data.name.last}`),
                        image$: ({data}) => data.picture.thumbnail,
                        subtitle$: ({data}) => data.email
                    })
                })
            }),
            reactions: {
                data: (v) => ({items: iterator(v, 'data')})
            },
            initials: {
                data: () => users// iterable(users, 'data')
            }
        })
    }) 
}