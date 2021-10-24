import { Box, Progress } from "chorda-bulma"



export default () => {
    return {
        styles: {
            maxWidth: 600,
            margin: '0 auto'
        },
        items: [
            Box({
                css: 'is-paddingless is-roundless',
                content: Progress({
                    max: 100,
                    value: 40,
                    css: 'is-primary'
                }),
            }),
            Box({
                css: 'is-paddingless is-roundless',
                content: Progress({
                    max: 100,
                    value: 45,
                    css: 'is-link'
                }),
            }),
            Box({
                css: 'is-paddingless is-roundless',
                content: Progress({
                    max: 100,
                    value: 50,
                    css: 'is-info'
                }),
            }),
            Box({
                css: 'is-paddingless is-roundless',
                content: Progress({
                    max: 100,
                    value: 55,
                    css: 'is-success'
                }),
            }),
            Box({
                css: 'is-paddingless is-roundless',
                content: Progress({
                    max: 100,
                    value: 60,
                    css: 'is-warning'
                }),
            }),
            Box({
                css: 'is-paddingless is-roundless',
                content: Progress({
                    max: 100,
                    value: 70,
                    css: 'is-danger'
                }),
            }),
        ]
    }
}