import { HtmlBlueprint } from "@chorda/core";
import { ExamplePanel } from "../helpers";
import { BoxExample } from "./box";
import { ButtonExample } from "./button";
import { IconExample } from "./icon";
import { ImageExample } from "./image";


export const Elements = () : HtmlBlueprint => {
    return ExamplePanel({
        title: 'Elements',
        tabs: [{
            title: 'Box',
            name: 'box',
            link: '/#/elements/box',
            example: BoxExample
        }, {
            title: 'Button',
            name: 'button',
            link: '/#/elements/button',
            example: ButtonExample
        }, {
            title: 'Icon',
            name: 'icon',
            link: '/#/elements/icon',
            example: IconExample
        }, {
            title: 'Image',
            name: 'image',
            link: '/#/elements/image',
            example: ImageExample
        }]
    })
}