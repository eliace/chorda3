import { InferBlueprint } from "@chorda/core"



export const Footer = () : InferBlueprint<unknown> => {
    return {
        weight: 10,
        tag: 'footer',
        templates: {
            content: {
                css: 'container',
                templates: {
                    link: {
                        tag: 'a',
                        css: 'logo-font',
                        text: 'conduit',
                        dom: {
                            href: '/'
                        }
                    },
                    attribution: {
                        tag: 'span',
                        css: 'attribution',
                        html: 'An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.'
                    }
                }
            }
        }
    }
}