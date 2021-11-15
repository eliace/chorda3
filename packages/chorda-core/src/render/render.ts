import { DomNode } from "./node"
import { Html } from ".."


type Link = {
    dom: any
    next?: any
    prev?: any
    id: any
    tag?: string
    text?: string
}

type Vnode = {
    dom: DomNode
    key: any
    tag?: string
}

type Changes = {
    children: Vnode[]
    attributes: {[k:string]: any}
    events: {[k:string]: Function}
    styles: {[k:string]: string|number}
    classes: {[k:string]: string}
    html: string
}

// const insertAfter = (after: DomNode<HTMLElement>, node: DomNode<HTMLElement>) => {
//     after._el.after(node)
// }
const Svg = new Set<string>(['svg', 'path'])

// const createElement = (tag: string) : HTMLElement|SVGElement => {
//     if (Svg.has(tag)) {
//         return document.createElementNS("http://www.w3.org/2000/svg", tag)
//     }
//     if (tag == 'undefined' || tag == null) {
//         debugger
//     }
//     return document.createElement(tag)
// }

// const createText = (text: string) : Text => {
//     return document.createTextNode(text)
// }

const createDomNode = (link: Link) : HTMLElement|SVGElement|Text => {
    let el = null
    if (link.tag == null) {
        el = document.createTextNode(link.text)
    }
    else if (Svg.has(link.tag)) {
        el = document.createElementNS("http://www.w3.org/2000/svg", link.tag)
    }
    else {
        el = document.createElement(link.tag)
    }
    nodeMap.set(link.dom, el)

    return el
}




const nodeMap = new Map<DomNode, HTMLElement|SVGElement|Text>()

const eventMap = new Map<DomNode, {[k: string]: any}>()



export const flatten = (arr: any[]) : any[] => {
    let result = [] as any[]
    arr.forEach(itm => {
        if (Array.isArray(itm)) {
            result = result.concat(flatten(itm))
        }
        else {
            result.push(itm)
        }
    })
    return result
}

const Attributes : {[k:string]: string} = {
    className: 'class',
    href: 'href',
    placeholder: 'placeholder',
    type: 'type',
    disabled: 'disabled',
    defaultValue: 'value',
    htmlFor: 'for',
}

const Events : {[k:string]: string} = {
    click: 'click',
    keydown: 'keydown',
}

const isTextNode = (el: Node) : el is Text => {
    return (el.nodeType == Node.TEXT_NODE)
}


const clearSubtree = (dom: any, output: {created: any[], deleted: any[]}) => {
    let child = dom.child
    while (child) {
        const next = child.next
        child.next = null
        child.prev = null
        nodeMap.delete(child)
        clearSubtree(child, output)
        output.deleted.push(child)
        child = next
    }
    dom.child = null
}


export const render = (node: Vnode, changes: Changes, output: {created: any[], deleted: any[]}, rootReady?: (root: Node) => void) : HTMLElement => {

    // if (node == null) {
    //     return null
    // }

    let dom: any = node.dom

    if (typeof node === 'string' || typeof node === 'number') {
        return null
    }

    let el = nodeMap.get(dom) as HTMLElement|SVGElement|Text

    let isReady = false

    if (!el) {
        //console.log('create element', node)
        //commands.push(['create-element', node.key])
        el = createDomNode({dom, id: node.key, tag: node.tag})
//        el.setAttribute("data-id", 'root')
        //root.append(el)
//        nodeMap.set(dom, el)
        output.created.push(dom)
        isReady = true
//        rootReady(el)
    }

    if (isTextNode(el)) {
        return null
    }

    if (changes.attributes) {
        for (let i in changes.attributes) {
            // if (!Attributes[i]) {
            //     //console.warn('unknown attr', i)
            // }
            if (changes.attributes[i] !== undefined) {
                const name = Attributes[i] || i
                // let attr = el.attributes.getNamedItem(name)
                // if (!attr) {
                //     el.setAttribute(name, changes.attributes[i])
                //     // attr = document.createAttributeNS(null, name)
                //     // el.attributes.setNamedItem(attr)
                // }
                if (changes.attributes[i] == null) {
                    el.removeAttribute(name)
                }
                else {
                    let v = changes.attributes[i]
                    if (name == 'disabled') {
                        if (!v) {
                            el.removeAttribute(name)
                            continue
                        }
                    }
                    el.setAttribute(name, v)
//                    attr.value = changes.attributes[i]
                }
            }
        }
    }

    if (changes.events) {
        // let events = eventMap.get(dom)
        // if (!events) {
        //     events = {}
        //     eventMap.set(dom, events)
        // }
        for (let i in changes.events) {
            if (changes.events[i] !== undefined) {
//                console.log('add event listener', i)
//                const name = Events[i];
//                (el as any)[name] = changes.events[i]
                if (changes.events[i] == null) {
                    el.removeEventListener(i, dom)
                }
                else {
                    el.addEventListener(i, dom)
                }
            }
        }
    }

    if (changes.styles) {
        for (let i in changes.styles) {
            let v = changes.styles[i]
            v =  (typeof v === 'number') ? v+'px' : v;
            (el.style as any)[i] = v
        }
    }

    if (changes.classes) {
        for (let i in changes.classes) {
            let v = changes.classes[i];
            if (!v) {
                el.classList.remove(i)
            }
            else {
                el.classList.add(i)
            }
            //(el.classList as any)[i] = v
        }
    }


    if (changes.children) {



        const prevLinks = new Map<any, any>()
        let prevTexts = null
        let head = dom.child
        while (head) {
            prevLinks.set(head, head)
            if (head.isText) {
                if (!prevTexts) {
                    prevTexts = []
                }
                prevTexts.push([head.text, head])
            }
            head = head.next
        }

        const prevHead = dom.child && {dom: dom.child}



//         if (prevTexts) {
// //            debugger
//             console.log(prevTexts)
//         }

//        const nextLinks = new Map<any, any>()

        let nextHead = null as Link
        const children = flatten(changes.children)
        for (let i = children.length-1; i >= 0; i--) {
            let child = children[i]
            if (child == null) {
                continue
            }
            // такой элемент может встретиться только один раз. Если 
            if (typeof child === 'string' || typeof child === 'number') {
                child = {dom: {isText: true, text: child}, key: null, text: child}
                if (prevTexts && prevTexts.length > 0) {
                    const n = prevTexts.findIndex(txt => txt[0] == child.text)
                    if (n != -1) {
                        child.dom = prevTexts.splice(n, 1)[0][1]
//                        console.log(child.dom)
                    }
                    // else {
                    //     console.log(child, prevTexts)
                    // }
                }
            }
            const next = nextHead
            if (nextHead == null) {
                nextHead = {dom: child.dom, id: child.key, tag: child.tag, text: child.text}
            }
            else {
                nextHead = {dom: child.dom, id: child.key, next: nextHead, tag: child.tag, text: child.text}
            }
//            nextLinks.set(nextHead.dom, nextHead)
            if (next) {
                next.prev = nextHead
            }
        }

        // changes.children.forEach(c => {
        //     console.log('index', c.key || c.index)
        // })

        if (!prevHead) {
            let head = nextHead
            while (head) {
                const childEl = createDomNode(head)
//                 let childEl = null
//                 if (head.tag == null) {
//                     childEl = createText(head.text)
//                     nodeMap.set(head.dom, childEl)
//                 }
//                 else {
//                     childEl = createElement(head.tag)
// //                    childEl.setAttribute("data-id", head.id)    
//                     nodeMap.set(head.dom, childEl)
//                 }
                // if (childEl == null) {
                //     debugger
                // }
                el.append(childEl)
                output.created.push(head.dom)
 
//                commands.push(['append', head.id])
                head.dom.next = head.next?.dom
                head.dom.prev = head.prev?.dom
                head = head.next
            }
        }
        else if (!nextHead) {
            let dom = prevHead.dom
            while (dom) {
                nodeMap.get(dom).remove()
                nodeMap.delete(dom)
                eventMap.delete(dom)
                output.deleted.push(dom)
                clearSubtree(dom, output)
//                commands.push(['remove', head.id])
                dom = dom.next
            }
        }
        else if (nextHead && prevHead) {
//            debugger
            let next = nextHead
            let domHead = prevHead.dom
            //let prev = null
            while (next) {
//                console.log('id', next.id)
                if (prevLinks.has(next.dom)) {
                    const dom = next.dom
                    const prev = next.prev
                    if (dom.prev == prev?.dom) {
//                        console.log('ignore')
                    }
                    else {
                        dom.next && (dom.next.prev = dom.prev)
                        dom.prev && (dom.prev.next = dom.next)
                        if (prev) {
                            const childEl = nodeMap.get(dom)
                            const childEl2 = nodeMap.get(prev.dom)
                            childEl2.after(childEl)
                            // if (childEl == null) {
                            //     debugger
                            // }
//                            console.log('insert-after', next.id, prev.id)
                            dom.prev = prev.dom
                            dom.next = prev.dom.next
                            if (prev.dom.next) {
                                prev.dom.next.prev = dom
                            }
                            prev.dom.next = dom
                        }
                        else {
                            const childEl = nodeMap.get(dom)
                            el.prepend(childEl)
                            // if (childEl == null) {
                            //     debugger
                            // }

//                            console.log('prepend', next.id)
                            dom.prev = null
                            dom.next = domHead
                            domHead.prev = dom
                            domHead = dom
                        }    
                    }
                    prevLinks.delete(dom)
                    // prevDom.prev = next.prev?.dom
                    // prevDom.next = next.next?.dom
                }
                else {
                    // добавляем новый узел
                    const dom = next.dom
                    const prev = next.prev
                    // dom.next && (dom.next.prev = dom.prev)
                    // dom.prev && (dom.prev.next = dom.next)
                    if (prev) {
                        const childEl = createDomNode(next)
                        // let childEl = null
                        // if (next.tag == null) {
                        //     childEl = createText(next.text)
                        //     nodeMap.set(dom, childEl)    
                        // }
                        // else {
                        //     childEl = createElement(next.tag)
                        //     nodeMap.set(dom, childEl)    
                        // }
                        const childEl2 = nodeMap.get(prev.dom)
                        childEl2.after(childEl)
//                        nodeMap.set(dom, childEl)
                        output.created.push(dom)
                        dom.prev = prev.dom
                        dom.next = prev.dom.next
                        if (prev.dom.next) {
                            prev.dom.next.prev = dom
                        }
                        prev.dom.next = dom
                    }
                    else {
                        const childEl = createDomNode(next)
                        // let childEl = null
                        // if (next.tag == null) {
                        //     childEl = createText(next.text)
                        //     nodeMap.set(dom, childEl)    
                        // }
                        // else {
                        //     childEl = createElement(next.tag)
                        //     nodeMap.set(dom, childEl)    
                        // }
                        el.prepend(childEl)
                        output.created.push(dom)
                        dom.prev = null
                        dom.next = domHead
                        domHead.prev = dom
                        domHead = dom
                    }
                }
                //prev = next
                next = next.next
            }

        }

        prevLinks.forEach((dom) => {
            console.log('remove old', dom)
            if (dom.next) {
                dom.next.prev = dom.prev
            }
            if (dom.prev) {
                dom.prev.next = dom.next
            }
            nodeMap.get(dom)?.remove()
            nodeMap.delete(dom)
            eventMap.delete(dom)
            output.deleted.push(dom)
            clearSubtree(dom, output)
        })

        dom.child = nextHead?.dom
    }

    if (changes.html !== undefined) {
        el.innerHTML = changes.html
    }

    if (isReady) {
        rootReady(el)
    }

    return el as any
}




export const updateRefs = (nodes: DomNode[]) => {
    nodes.forEach((dom, i) => {
        // FIXME проверяем каждый узел при подключении и отключении
        if (dom.$isSubscribed) {
            dom.$publish?.(nodeMap.get(dom))
        }
    })
}

export const getTrackingNodeCount = () => {
    return nodeMap.size
}

export const getTrackingElementAndNodeCount = () => {
    const out = {
        textNodes: 0,
        elements: 0
    }
    nodeMap.forEach(el => {
        if (el.nodeType == Node.TEXT_NODE) {
            out.textNodes++
        }
        else {
            out.elements++
        }
    })
    return out
}