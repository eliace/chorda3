import { Blueprint, Infer, InferBlueprint, mix } from "@chorda/core";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";


type FieldIconsScope = {
    leftIcon?: Blueprint<unknown>
    rightIcon?: Blueprint<unknown>
}


export const withFieldIcons = <T, E>(props: Blueprint<T&FieldIconsScope, E>) : InferBlueprint<T, E> => {
    return mix<FieldIconsScope>({
        templates: {
            control: {
                css: 'control',
                templates: {
                    iconLeft: {
                        tag: 'span',
                        css: 'icon is-small is-left',
                        templates: {
                            content: {
                                classes: {
                                    'icon': false
                                }
                            }
                        },
                        reactions: {
                            leftIcon: (v) => ({
                                components: {
                                    content: v
                                }
                            })
                        }
                    },
                    iconRight: {
                        tag: 'span',
                        css: 'icon is-small is-right',
                        templates: {
                            content: {
                                classes: {
                                    'icon': false
                                }
                            }
                        },
                        reactions: {
                            rightIcon: (v) => ({
                                components: {
                                    content: v
                                }
                            })
                        }
                    },
                },      
                reactions: {
                    leftIcon: (v) => ({
                        components: {
                            iconLeft: !!v
                        },
                        classes: {
                            'has-icons-left': !!v
                        }
                    }),
                    rightIcon: (v) => ({
                        components: {
                            iconRight: !!v
                        },
                        classes: {
                            'has-icons-right': !!v
                        }
                    }),
                }
            }
        }
    }, props)
}




type FieldIconProps<T, E> = {
    leftIcon?: Blueprint<T, E>
    rightIcon?: Blueprint<T, E>
}


export const FieldIcons = <T, E>(props: FieldIconProps<T&FieldIconsScope, E>) : Infer.Blueprint<T, E> => {
    return mix(withFieldIcons({
        injections: {
            leftIcon: () => props.leftIcon,
            rightIcon: () => props.rightIcon
        }
    }))
}
