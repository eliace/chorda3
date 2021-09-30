import { InferBlueprint } from "@chorda/core"
import { Card, CardHeader, CardImage, ContentLayout, Image } from "chorda-bulma"
import { IMAGE_1, IMAGE_2 } from "../../data"


const TEXT = `
<p>Yosemite National Park (/joʊˈsɛmɪti/ yoh-SEM-i-tee) is an American national park located in the western Sierra Nevada of Central California, bounded on the southeast by Sierra National Forest and on the northwest by Stanislaus National Forest.</p>
<p class="has-text-right">
    <a href="https://en.wikipedia.org/wiki/Yosemite_National_Park">Wikipedia</a>
</p>
`

export default () : InferBlueprint<unknown> => {
    return Card({
        header: CardHeader({
            title: 'Yosemite National Park'
        }),
        content: ContentLayout([{
            html: TEXT
        }]),
        image: CardImage({
            image: Image({
                css: 'is-16by9',
                url: IMAGE_2
            })
        }),
        as: {
            styles: {
                width: 500,
                margin: '0 auto'        
            }
        }
    })
}