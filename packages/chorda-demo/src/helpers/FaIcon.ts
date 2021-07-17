import { HtmlBlueprint, Injector, isObservable, mix, observable, patch } from "@chorda/core"
import { faCircleNotch, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { Icon } from "chorda-bulma"
import { DataScope } from "../utils"



type FaIconProps<T, E> = {
    icon$?: Injector<T>
    prefix?: string
    icon?: string|IconDefinition|(string|IconDefinition)[]
    as?: HtmlBlueprint<T, E>
}

export const FaIcon = <T, E>(props: FaIconProps<T&DataScope<string>, E>): HtmlBlueprint<T, E> => {

    const prefix = props?.prefix || 'fas'

    return mix<DataScope<string|IconDefinition>>(Icon, {
        tag: 'i',
        templates: {
            icon: {
                reactors: {
                    data: (next, prev) => {
//                        console.log('icon', next, prev)
                        const classes: any = {}
                        if (next) {
                            if (isObservable(next)) {
                                next = next.$value
                            }
                            (Array.isArray(next) ? next : [next]).forEach(s => {
                                if ((s as IconDefinition).iconName) {
                                    classes['fa-'+s.iconName] = true
                                    classes[s.prefix] = true
                                }
                                else {
                                    classes['fa-'+s] = true
                                    classes[prefix] = true
                                }
                            })
                        }
                        if (prev) {
                            if (isObservable(prev)) {
                                prev = prev.$value
                            }
                            (Array.isArray(prev) ? prev : [prev]).forEach(s => {
                                if ((s as IconDefinition).iconName) {
                                    classes['fa-'+s.iconName] = false
                                    classes[s.prefix] = classes[s.prefix] || false
                                }
                                else {
                                    classes['fa-'+s] = false
                                    classes[prefix] = classes[prefix] || false
                                }
                            })
//                            (Array.isArray(prev) ? prev : [prev]).map(s => s.iconName || s).forEach(s => classes[prefix+'-'+s] = false)
                        }
//                        console.log('icon', classes)
                        // next = next ? (prefix+'-'+next) : next
                        // prev = prev ? (prefix+'-'+prev) : prev
                        patch({classes})//: {[next]: true, [prev]: false}})
                    }
                }
            }
        }
    },
    props?.as,
    props && {
        initials: {
            data: () => observable(props.icon)
        },
        injectors: {
            data: props.icon$
        }
    })
}
