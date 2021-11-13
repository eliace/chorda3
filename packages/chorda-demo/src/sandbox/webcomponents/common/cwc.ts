import { buildHtmlContext, createBasicRenderer, Html, HtmlOptions, observable } from "@chorda/core"



export const createChordaWebComponent = <T, E>(options?: HtmlOptions<T, E, any>, styles?: string) =>  {

    const attrs : {[key: string]: (s: string) => any} = {
        active: (v) => JSON.parse(v)
    }

    return class extends HTMLElement {
        
        __html: Html
        
        constructor () {
            super()

            const context = {
                active: observable(false),
                onClick: (e: any) => {
                    e.stopPropagation()
                    this.dispatchEvent(new Event('click', {}))
                },
            }
    
            this.__html = new Html(options || {}, {...buildHtmlContext(createBasicRenderer())}, context)
    
            this.attachShadow({mode: 'open'})

            if (styles) {
                const style = document.createElement('style');
                style.innerHTML = styles
    
                this.shadowRoot.append(style)    
            }

        }
    
        connectedCallback () {
            this.__html.attach(this.shadowRoot as any)
        }
    
        disconnectedCallback () {
            this.__html.detach()            
        }

        attributeChangedCallback (name: string, oldValue: string, newValue: string) {
            console.log(name, newValue, oldValue)
            this.__html.scope[name].$value = attrs[name](newValue)
        }

        static get observedAttributes () {
            return Object.keys(attrs)
        }
    }
}
