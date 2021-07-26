import { HtmlBlueprint, iterable, observable, patch } from '@chorda/core'
import * as FaSvgLib from '@fortawesome/free-solid-svg-icons'
import { SvgIcon } from '../../helpers'

const allIcons = Object.values(FaSvgLib).filter((icon:FaSvgLib.IconDefinition) => !!icon.icon && icon.iconName != 'font-awesome-logo-full')

type AllIconsScope = {
    data: (FaSvgLib.IconDefinition|FaSvgLib.IconPrefix|FaSvgLib.IconPack)[]
    __it: FaSvgLib.IconDefinition
}

export default () : HtmlBlueprint<AllIconsScope> => {
    return {
        defaultItem: SvgIcon({
            tooltip$: (scope) => scope.data.iconName,
            data$: (scope) => scope.__it
        }),
        injections: {
            data: () => iterable(allIcons)
        },
        reactions: {
            data: (v) => patch({items: v})
        }
    }
}