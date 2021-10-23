import * as FaSvgLib from '@fortawesome/free-solid-svg-icons'
import { DataScope, IteratorScope, ListBlueprint, withList } from '../../utils'
import { FaIcon } from './common'


const allIcons = Object
    .values(FaSvgLib)
    .filter((icon:FaSvgLib.IconDefinition) => !!icon.icon && icon.iconName != 'font-awesome-logo-full')
    .map((icon:FaSvgLib.IconDefinition) => 'fa-' + icon.iconName)


export default ()=> {
    return withList(<ListBlueprint<string>>{
        defaultItem: FaIcon({
            icon$: (scope) => scope.item
        }),
        injections: {
            items: () => allIcons
        },
    })
}