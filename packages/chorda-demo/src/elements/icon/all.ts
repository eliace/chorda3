import { HtmlBlueprint, Injector, iterable, mix, observable, patch } from '@chorda/core'
import * as FaSvgLib from '@fortawesome/free-solid-svg-icons'
import { DataScope, IteratorScope } from 'chorda-demo/src/utils'
import { FaIcon } from './common'



const allIcons = Object
    .values(FaSvgLib)
    .filter((icon:FaSvgLib.IconDefinition) => !!icon.icon && icon.iconName != 'font-awesome-logo-full')
    .map((icon:FaSvgLib.IconDefinition) => 'fa-' + icon.iconName)

type AllIconsScope = DataScope<string[]>&IteratorScope<string>


export default () : HtmlBlueprint<AllIconsScope> => {
    return {
        defaultItem: FaIcon({
            icon$: (scope) => scope.__it
        }),
        injectors: {
            data: () => iterable(allIcons)
        },
        reactors: {
            data: (v) => patch({items: v})
        }
    }
}