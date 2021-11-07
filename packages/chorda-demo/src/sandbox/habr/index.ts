import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const HabrExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Хочу поиск как у MDN',
            content: require('./mdn/index').default,
            link: 'https://habr.com/ru/company/timeweb/blog/585910/',
            files: [
                {
                    name: 'index.ts',
                    code: require('!raw-loader!./mdn/index').default
                },
                {
                    name: 'lazy.ts',
                    code: require('!raw-loader!./mdn/lazy').default
                },
                {
                    name: 'search.ts',
                    code: require('!raw-loader!./mdn/search').default
                },
                {
                    name: 'simple.ts',
                    code: require('!raw-loader!./mdn/simple').default
                },
                {
                    name: 'highlighted.ts',
                    code: require('!raw-loader!./mdn/highlighted').default
                },
                {
                    name: 'utils.ts',
                    code: require('!raw-loader!./mdn/utils').default
                },
            ]
        }),
    ])
}
