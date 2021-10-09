import { InferBlueprint } from "@chorda/core"


export const H1 = () : InferBlueprint<unknown> => {
    return {
        tag: 'h1'
    }
}

export const H2 = () : InferBlueprint<unknown> => {
    return {
        tag: 'h4'
    }
}

export const H4 = () : InferBlueprint<unknown> => {
    return {
        tag: 'h4'
    }
}

export const Paragraph = () : InferBlueprint<unknown> => {
    return {
        tag: 'p'
    }
}

export const HR = () : InferBlueprint<unknown> => {
    return {
        tag: 'hr'
    }
}

export const Span = () : InferBlueprint<unknown> => {
    return {
        tag: 'span'
    }
}

export const UL = () : InferBlueprint<unknown> => {
    return {
        tag: 'ul',
        defaultItem: {
            tag: 'li'
        }
    }
}