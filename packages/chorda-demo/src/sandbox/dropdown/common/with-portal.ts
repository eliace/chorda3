import { Blueprint, InferBlueprint, mix, observable, patch } from "@chorda/core"



type PortalScope = {
    portal: any
}


export const withPortal = <T, E>(props: Blueprint<T&PortalScope, E>) : InferBlueprint<T, E> => {
    return mix<PortalScope>({
        injections: {
            portal: () => observable(null)
        },
        templates: {
            portal: {
                css: 'portal-host',
                reactions: {
                    portal: (v) => patch({components: {content: v}})
                }
            },
            content: props
        }
    })
}
