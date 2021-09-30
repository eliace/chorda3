import { InferBlueprint } from "@chorda/core"
import { Box, Button, Buttons, Link, Navbar, NavbarBrand, NavbarDivider, NavbarDropdown, NavbarMenu } from "chorda-bulma"
import { withBlueprint } from "../../utils"



export default () : InferBlueprint<unknown> => {
    return Box({
        css: 'is-paddingless is-roundless',
        content: Navbar({
            brand: NavbarBrand({
                items: [
                    withBlueprint({
                        as: Link,
                        content: {
                            tag: 'span',
                            text: 'Chorda',
                            css: 'has-text-grey-light is-uppercase'
                        }
                    })
                ]
            }),
            menu: NavbarMenu({
                start: [
                    Link({text: 'Home'}),
                    Link({text: 'Documentation'}),
                    NavbarDropdown({
                        css: 'is-hoverable has-dropdown',
                        trigger: Link({text: 'More'}),
                        items: [
                            Link({text: 'About'}),
                            Link({text: 'Jobs'}),
                            Link({text: 'Contact'}),
                            NavbarDivider,
                            Link({text: 'Report an issue'}),
                        ]
                    })
                ],
                end: [
                    Buttons({
                        buttons: [
                            Button({text: 'Sign up', color: 'is-primary'}),
                            Button({text: 'Log in'}),
                        ]
                    })
                ]
            })
        })
    })
}

