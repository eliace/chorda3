import { Blueprint, InferBlueprint, mix, patch } from "@chorda/core";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";


type ControlIconsScope = {
    leftIcon?: Blueprint<unknown>
    rightIcon?: Blueprint<unknown>
}


export const withControlIcons = <T, E>(props: Blueprint<T&ControlIconsScope, E>) : InferBlueprint<T, E> => {
    return mix<ControlIconsScope>({
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
                            leftIcon: (v) => patch({
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
                            rightIcon: (v) => patch({
                                components: {
                                    content: v
                                }
                            })
                        }
                    },
                },      
                reactions: {
                    leftIcon: (v) => patch({
                        components: {
                            iconLeft: !!v
                        },
                        classes: {
                            'has-icons-left': !!v
                        }
                    }),
                    rightIcon: (v) => patch({
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