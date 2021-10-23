import { InferBlueprint } from '@chorda/core'
import * as FaSvgLib from '@fortawesome/free-solid-svg-icons'
import { withList } from '../../utils'
import { FaSvgIcon } from '../../helpers'

const allIcons = Object.values(FaSvgLib).filter((icon:FaSvgLib.IconDefinition) => !!icon.icon && icon.iconName != 'font-awesome-logo-full')

export default () : InferBlueprint<unknown> => {
    return withList({
        defaultItem: FaSvgIcon({
            tooltip$: (scope) => scope.data.iconName,
            data$: (scope) => scope.item
        }),
        injections: {
            items: () => allIcons
        },
    })
}