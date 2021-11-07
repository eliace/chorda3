import { BasicDomEvents, Blueprint, callable, computable, Infer, observable } from "@chorda/core"
import { watch } from "../../../utils"
import { Index } from "flexsearch"
import { MdnSearchItem, MdnSearchScope } from "./search"
import { MdnSearchSimple } from "./simple"
import { Lazy } from "./lazy"


const MdnSearchLazy = () => import("./search").then(m => m.MdnSearch)


const MDN_SEARCH_INDEX : MdnSearchItem[] = require('../../../data/mdn-search-index.json')

// const MDN_URL = 'https://developer.mozilla.org/ru/search-index.json'


type ExampleScope = {
    loaded: Blueprint<unknown>
    flex: Index
    db: MdnSearchItem[]
}

type ExampleActions = {
    updateSelection: (start: number, end: number) => void
//    lazyLoad: () => Promise<Blueprint<unknown>>
}

export default () : Infer.Blueprint<MdnSearchScope&ExampleScope&ExampleActions, BasicDomEvents&ExampleActions> => {
    return {
        tag: 'form',
        styles: {
            height: 400
        },
        templates: {
            search: Lazy({
                lazy: MdnSearchLazy,
                initial: MdnSearchSimple({
                    placeholder: 'Go ahead. Type your search...',
                    value$: $ => $.query,
                    onFocus: (e, {loadLazy}) => {
                        loadLazy()
                    },
                    onInput: (e, {updateSelection}) => {
                        const el = e.currentTarget as HTMLInputElement
                        updateSelection(el.selectionStart, el.selectionEnd)
                    }
                }),
            }),
        },
        events: {
            $dom: {
                submit: (e, {}) => {
                    e.preventDefault()

                    // TODO здесь загружаем страницу
                },
            },
        },
        initials: {
            query: () => observable(''),
            flex: () => new Index({ tokenize: 'forward' }),
            db: () => observable([]),
            textSelection: () => observable([0, 0])
        },
        injections: {
            suggest: $ => computable(() => {
                const indexes = $.flex.search($.query, {
                    limit: 5,
                })
                return indexes.map((i) => $.db.$value[i as number])
            }),
            updateSelection: $ => (start, end) => {
                $.textSelection.$value = [start, end]
            }
        },
        joints: {
            loadAndBuildIndex: ({flex, db}) => {

                setTimeout(() => {
                    const data = MDN_SEARCH_INDEX.map(v => {return {...v, id: v.url}})
                    data.forEach(({ title }, i) => {
                        flex.add(i, title)
                    })
                    db.$value = data
                    //search.$value = 'read'
                }, 500)
                
            }
        }
    }
}

