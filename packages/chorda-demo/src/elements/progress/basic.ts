import { Box, Progress } from "chorda-bulma"



export default () => {
    return Box({
        css: 'is-paddingless is-roundless',
        styles: {
            maxWidth: 600,
            margin: '0 auto'
        },
        content: Progress({
            max: 100,
            value: 40
        })
    })
}