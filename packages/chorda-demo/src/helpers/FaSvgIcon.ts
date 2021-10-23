import { HtmlBlueprint, InferBlueprint, Injector, mix, observable, patch } from "@chorda/core"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"


//
// Svg Font Awesome
//


type FaSvgIconScope = {
    data: IconDefinition
    tooltip: string
}

interface FaSvgIconProps<T> {
    icon?: IconDefinition
    tooltip?: string
    tooltip$?: Injector<T>
    data$?: Injector<T>
}

export const FaSvgIcon = <T, E>(props: FaSvgIconProps<T&FaSvgIconScope>) : InferBlueprint<T, E> => {
    return mix<FaSvgIconScope>({
        tag: 'i',
        css: 'icon',
        templates: {
            svg: {
                tag: 'svg',
                css: 'svg-inline--fa',
                dom: {
                    // 'data-icon': props.icon.iconName,
                    // 'data-prefix': props.icon.prefix,
                    viewBox: '0 0 512 512'
                },
                templates: {
                    path: {
                        tag: 'path',
                        // dom: {
                        //     d: props.icon.icon[4]
                        // },
                        reactions: {
                            data: (v) => patch({
                                dom: {
                                    d: v.icon[4]
                                }
                            }) 
                        }
                    }
                },
                reactions: {
                    data: (v) => {
                         patch({
                            dom: {
                                'data-icon': v.iconName,
                                'data-prefix': v.prefix,
                                'viewBox': `0 0 ${v.icon[0]} ${v.icon[1]}`     
                            }
                        })
                    }
                }        
            }
        },
        reactions: {
            tooltip: (v) => patch({dom: {title: v}})
        }
    }, props && {
        initials: {
            data: () => observable(props.icon)
        },
        injections: {
//            data: (scope, ctx) => observable(props.icon),
            tooltip: props.tooltip$,
            data: props.data$
        },
        dom: {
            title: props.tooltip
        }
    })
}


