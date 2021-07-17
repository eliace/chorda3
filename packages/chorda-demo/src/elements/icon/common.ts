import { HtmlBlueprint, Injector, mix, patch } from "@chorda/core"
import { Icon } from "chorda-bulma"
import { DataScope } from "../../utils"


type FaIconProps<T> = {
    icon$: Injector<T>
}

export const FaIcon = <T>(props: FaIconProps<T&DataScope<string>>): HtmlBlueprint<T> => {
    return mix<DataScope<string>>(Icon, {
        templates: {
            icon: {
                css: 'fas',
                reactors: {
                    data: (next, prev) => patch({classes: {[next]: true, [prev]: false}})
                }
            }
        }
    },
    props && {
        injectors: {
            data: props.icon$
        }
    })
}
