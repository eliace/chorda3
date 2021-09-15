import { HtmlBlueprint } from "@chorda/core"

export default () : HtmlBlueprint => {
    return {
        css: 'dropdown is-active mb-120px',
        templates: {
            trigger: {
                css: 'dropdown-trigger',
                templates: {
                    content: {
                        tag: 'button',
                        css: 'button',
                        templates: {
                            text: {
                                tag: 'span',
                                text: 'Select'
                            },
                            icon: {
                                tag: 'span',
                                css: 'icon is-small',
                                templates: {
                                    content: {
                                        tag: 'i',
                                        css: 'fas fa-angle-down'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            menu: {
                css: 'dropdown-menu',
                templates: {
                    content: {
                        css: 'dropdown-content',
                        defaultItem: {
                            css: 'dropdown-item',
                            tag: 'a',
//                            dom: {href: '#'},
                        },
                        items: [
                            {text: 'Alice'},
                            {text: 'Bob'},
                            {text: 'Charlie'},
                        ]
                    }
                }
            }
        }
    }
}