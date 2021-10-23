import { Box, Notification } from "chorda-bulma"
import { LOREM_IPSUM } from "../../data"


export default () => {
    return Box({
        css: 'is-paddingless is-roundless',
        styles: {
            maxWidth: 600,
            margin: '0 auto'
        },
        content: Notification({
            text: LOREM_IPSUM
        })
    })
}