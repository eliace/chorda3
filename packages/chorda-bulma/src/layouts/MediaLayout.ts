import { HtmlBlueprint, mix } from "@chorda/core";


// type MediaLayoutProps<T> = {
//     left?: HtmlBlueprint<T>
//     content?: HtmlBlueprint<T>
//     right?: HtmlBlueprint<T>
// }


export const MediaLayout = <T>(left?: HtmlBlueprint<T>, content?: HtmlBlueprint<T>, right?:  HtmlBlueprint<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'media',
        templates: {
            left: {
                css: 'media-left'
            },
            content: {
                css: 'media-content'
            },
            right: {
                css: 'media-right'
            }
        }
    }, {
        components: {
            left,
            content,
            right
        }
    })
}