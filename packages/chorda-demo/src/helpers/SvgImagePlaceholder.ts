import { InferBlueprint } from "@chorda/core";




interface SvgImagePlaceholderProps {
    url: string
}


export const SvgImagePlaceholder = <T, E>(props: SvgImagePlaceholderProps) : InferBlueprint<T, E> => {
    return {
        tag: 'svg',
        dom: {
            xmlns: "http://www.w3.org/2000/svg",
            xmlnsXlink: "http://www.w3.org/1999/xlink",
//            width: "1500",
//            height: "400",
            viewBox: "0 0 1500 823"
        },
        items: [{
            tag: 'filter',
            dom: {
                id: "blur",
                filterUnits: "userSpaceOnUse",
                colorInterpolationFilters: "sRGB"
            },
            items: [{
                tag: 'feGaussianBlur',
                dom: {
                    stdDeviation: "80 80",
                    edgeMode: "duplicate"
                }
            }, {
                tag: 'feComponentTransfer',
                items: [{
                    tag: 'feFuncA',
                    dom: { type: "discrete", tableValues: "1 1" }
                }]
            }]
        }, {
            tag: 'image',
            dom: {
                filter: "url(#blur)",
                x: "0",
                y: "0",
                height: "100%",
                width: "100%",
                xlinkHref: props.url,
            }
        }]
    }
}