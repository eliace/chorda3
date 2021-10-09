import { Blueprint, InferBlueprint, Injector, mix, patch } from "@chorda/core";
import { BlueprintGroup, componentGroups } from "../utils";


type NavScope = {
    components: Blueprint<unknown>
} 

type NavProps<T, E> = {
    css?: string
    isPills?: boolean
    componentGroups?: BlueprintGroup<T, E>[]
    componentAs?: Blueprint<T, E>
    templates?: {[key: string]: Blueprint<T, E>}
    components$?: Injector<T>
}


export const Nav = <T, E>(props: NavProps<T&NavScope, E>) : InferBlueprint<T, E> => {
    return mix<NavScope>({
        tag: 'ul',
        css: 'nav',
        defaultComponent: {
            tag: 'li',
            css: 'nav-item'
        },
    },
    props && {
        css: props.css,
        classes: {
            'nav-pills': props.isPills
        },
        templates: props.componentGroups && componentGroups(props.componentGroups),
        defaultComponent: props.componentAs,
        injections: {
            components: props.components$
        },
        reactions: {
            components: (v) => patch({components: v})
        }
    }, 
    props && {
        templates: props.templates
    })
}