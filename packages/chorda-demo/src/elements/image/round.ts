import { faUserShield } from "@fortawesome/free-solid-svg-icons"
import { Box, Image } from "chorda-bulma"
import { USERS } from "../../data"

export default () => {
    return {
        styles: {
            width: 600,
            margin: '0 auto'
        },
        css: 'is-flex is-justify-content-space-between',
        items: USERS.slice(0, 6).map(user => {
            return Image({
                rounded: true,
                url: user.picture.medium
            })
        })
    }
}