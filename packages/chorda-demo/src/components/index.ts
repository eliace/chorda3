import { InferBlueprint } from "@chorda/core"
import { ExamplePanel } from "../helpers"
import { BreadcrumbExample } from "./breadcrumb"
import { CardExample } from "./card"
import { MenuExample } from "./menu"
import { MessageExample } from "./message"
import { ModalExample } from "./modal"
import { NavbarExample } from "./navbar"
import { TabsExample } from "./tabs"



export const Components = () : InferBlueprint<unknown> => {
    return ExamplePanel({
        title: 'Components',
        tabs: [{
            title: 'Breadcrumb',
            name: 'breadcrumb',
            link: '/#/components/breadcrumb',
            example: BreadcrumbExample
        }, {
            title: 'Card',
            name: 'card',
            link: '/#/components/card',
            example: CardExample
        }, {
            title: 'Menu',
            name: 'menu',
            link: '/#/components/menu',
            example: MenuExample
        }, {
            title: 'Message',
            name: 'message',
            link: '/#/components/message',
            example: MessageExample
        }, {
            title: 'Modal',
            name: 'modal',
            link: '/#/components/modal',
            example: ModalExample
        }, {
            title: 'Navbar',
            name: 'navbar',
            link: '/#/components/navbar',
            example: NavbarExample
        }, {
            title: 'Tabs',
            name: 'tabs',
            link: '/#/components/tabs',
            example: TabsExample
        }]
    })
}
