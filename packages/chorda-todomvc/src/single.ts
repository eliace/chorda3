import { Blueprint, computable, HtmlScope, Infer, iterator, observable, ownTask, passthruLayout } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import * as director from 'director'

import 'todomvc-common/base.css'
import 'todomvc-app-css/index.css'

type Todo = {
    id: number
    text: string
    completed?: boolean
}

type TodoMvcScope = {
    newTodo: string
    todos: Todo[]
    hasTodos: boolean
    filteredTodos: Todo[]
    isAllCompleted: boolean
    hasCompleted: boolean
    activeCount: number
}

type TodoMvcActions = {
    addTodo: () => void
    toggleTodoAsDone: (id: number, value: boolean) => void
    deleteTodo: (id: number) => void
    toggleAll: (value: boolean) => void
    clearCompleted: () => void
    changeTodoText: (id: number, text: string) => void
}

type Router = {
    route: string
}

type RouterScope = {
    router: Router
}
type LocalStore = {
    save: (data: any) => void
    load: () => any
}

type LocalStoreScope = {
    store: LocalStore
}


const useRouter = () : Router => {

    const router = observable({route: null})

    const r = new director.Router({
        '/': () => router.route.$value = 'all',
        '/active': () => router.route.$value = 'active',
        '/completed': () => router.route.$value = 'completed',
    });

    (r as any).init('/')

    return router
}

const useLocalStore = () : LocalStore => {

    const LS_KEY = 'chorda-todomvc'

    return {
        save: function (data) {
            localStorage.setItem(LS_KEY, JSON.stringify(data))
        },
        load: function () {
            return JSON.parse(localStorage.getItem(LS_KEY)) || []
        }
    }
}

const pluralize = (count: number, word: string) => {
    return count === 1 ? word : word + 's';
}



export default () : Infer.Blueprint<TodoMvcScope&RouterScope&LocalStoreScope&TodoMvcActions, ReactDomEvents> => {
    return {
        templates: {
            app: {
                tag: 'section',
                css: 'todoapp',
                templates: {
                    header: {
                        tag: 'header',
                        css: 'header',
                        templates: {
                            title: {tag: 'h1', text: 'todos'},
                            input: {
                                tag: 'input',
                                css: 'new-todo',
                                dom: {
                                    placeholder: 'What needs to be done?',
                                    autoFocus: true,
                                },
                                events: {
                                    $dom: {
                                        input: (e, {newTodo}) => {
                                            const el = e.currentTarget as HTMLInputElement
                                            newTodo.$value = el.value
                                        },
                                        keyDown: (e, {addTodo}) => {
                                            if (e.key == 'Enter') {
                                                addTodo()
                                            }
                                        }
                                    }
                                },
                                reactions: {
                                    newTodo: v => ({dom: {value: v}})
                                }
                            }
                        }
                    },
                    main: {
                        tag: 'section',
                        css: 'main',
                        templates: {
                            toggleAll: {
                                layout: passthruLayout,
                                items: [
                                    {
                                        tag: 'input', 
                                        css: 'toggle-all',
                                        dom: {type: 'checkbox', id: 'toggle-all'},
                                        reactions: {
                                            isAllCompleted: v => ({dom: {checked: v}})
                                        },
                                        events: {
                                            $dom: {
                                                change: (e, {toggleAll}) => {
                                                    const el = e.currentTarget as HTMLInputElement
                                                    toggleAll(el.checked)
                                                }
                                            }
                                        }
                                    },
                                    {tag: 'label', text: 'Mark all as complete', dom: {htmlFor: 'toggle-all'}}
                                ]
                            },
                            list: {
                                tag: 'ul',
                                css: 'todo-list',
                                defaultItem: <Blueprint<{todo: Todo, editing: boolean, value: string}&TodoMvcScope&TodoMvcActions&HtmlScope, ReactDomEvents>>{
                                    tag: 'li',
                                    templates: {
                                        view: {
                                            css: 'view',
                                            items: [
                                                {
                                                    tag: 'input', 
                                                    css: 'toggle', 
                                                    dom: {type: 'checkbox'},
                                                    events: {
                                                        $dom: {
                                                            change: (e, {toggleTodoAsDone, todo}) => {
                                                                const el = e.currentTarget as HTMLInputElement
                                                                toggleTodoAsDone(todo.id, el.checked)
                                                            }
                                                        }
                                                    },
                                                    reactions: {
                                                        todo: v => ({dom: {checked: (v && v.completed) || false}})
                                                    }
                                                },
                                                {
                                                    tag: 'label',
                                                    reactions: {
                                                        todo: v => ({text: v && v.text})
                                                    }
                                                },
                                                {
                                                    tag: 'button', 
                                                    css: 'destroy',
                                                    events: {
                                                        $dom: {
                                                            click: (e, {deleteTodo, todo}) => {
                                                                deleteTodo(todo.id)
                                                            }
                                                        }
                                                    }
                                                }
                                            ],
                                            events: {
                                                $dom: {
                                                    doubleClick: (e, {editing}) => {
                                                        editing.$value = true
                                                    }
                                                }
                                            }
                                        },
                                        edit: {
                                            tag: 'input',
                                            css: 'edit',
                                            events: {
                                                $dom: {
                                                    change: (e, {value}) => {
                                                        const el = e.currentTarget as HTMLInputElement
                                                        value.$value = el.value
                                                    },
                                                    keyDown: (e, {editing, changeTodoText, value, todo}) => {
                                                        if (e.key == 'Escape') {
                                                            editing.$value = false
                                                        }
                                                        else if (e.key == 'Enter') {
                                                            editing.$value = false
                                                            changeTodoText(todo.id, value)
                                                        }
                                                    },
                                                    blur: (e, {editing}) => {
                                                        editing.$value = false
                                                    }
                                                }
                                            },
                                            joints: {
                                                autoFocus: ({$dom, editing, $renderer, $patcher, todo, value}) => {

                                                    editing.$subscribe(next => {
                                                        if (next) {
                                                            $patcher.publish($renderer.task(() => {
                                                                $dom.$value.focus()
                                                            }))
                                                            value.$value = todo.text
                                                        }
                                                    })

                                                    $dom.$subscribe(() => {})
                                                    
                                                }
                                            },
                                            reactions: {
                                                value: v => ({dom: {value: v}})
                                            }
                                        }
                                    },
                                    reactions: {
                                        todo: v => ({classes: {completed: (v && v.completed) || false}}), // FIXME
                                        editing: v => ({classes: {editing: v}})
                                    },
                                    initials: {
                                        editing: () => observable(false),
                                        value: () => observable(''),
                                    },
                                },
                                reactions: {
                                    filteredTodos: v => ({items: iterator(v, 'todo')})
                                }
                            }
                        }
                    },
                    footer: {
                        tag: 'footer',
                        css: 'footer',
                        templates: {
                            count: {
                                tag: 'span',
                                css: 'todo-count',
                                items: [
                                    {
                                        tag: 'strong', 
                                        reactions: {
                                            activeCount: v => ({text: String(v)})
                                        }
                                    },
                                    {
                                        tag: false, 
                                        text: ' item left',
                                        reactions: {
                                            activeCount: v => ({text: ` ${pluralize(v, 'item')} left`})
                                        }
                                    }
                                ]
                            },
                            filters: <Blueprint<{selected: boolean, name: string}&RouterScope>>{
                                tag: 'ul',
                                css: 'filters',
                                defaultItem: {
                                    tag: 'li',
                                    templates: {
                                        content: {
                                            tag: 'a',
                                            reactions: {
                                                selected: v => ({classes: {selected: v}})
                                            }
                                        }
                                    },
                                    initials: {
                                        selected: $ => computable(() => {
                                            return $.router.route == $.name
                                        })
                                    }
                                },
                                items: [
                                    {
                                        templates: {
                                            content: {
                                                dom: {href: '#/'},
                                                text: 'All'
                                            }
                                        },
                                        initials: {
                                            name: () => 'all'
                                        }
                                    },
                                    {
                                        templates: {
                                            content: {
                                                dom: {href: '#/active'},
                                                text: 'Active'
                                            }
                                        },
                                        initials: {
                                            name: () => 'active'
                                        }
                                    },
                                    {
                                        templates: {
                                            content: {
                                                dom: {href: '#/completed'},
                                                text: 'Completed'
                                            }
                                        },
                                        initials: {
                                            name: () => 'completed'
                                        }
                                    },
                                ]
                            },
                            clear: {
                                tag: 'button',
                                css: 'clear-completed',
                                text: 'Clear completed',
                                events: {
                                    $dom: {
                                        click: (e, {clearCompleted}) => {
                                            clearCompleted()
                                        }
                                    }
                                }
                            }
                        },
                        reactions: {
                            hasCompleted: v => ({components: {clear: v}})
                        }
                    }
                },
                reactions: {
                    hasTodos: v => ({components: {
                        header: true,
                        main: v,
                        footer: v,
                    }})
                }
            },
            footer: {
                tag: 'footer',
                css: 'info',
                items: [
                    {tag: 'p', text: 'Double-click to edit a todo'},
                    {tag: 'p', items: [
                        {tag: false, text: 'Created by '},
                        {tag: 'a', text: 'Eliace', dom: {href: 'http://todomvc.com'}},
                    ]},
                    {tag: 'p', items: [
                        {tag: false, text: 'Part of '},
                        {tag: 'a', text: 'TodoMVC', dom: {href: 'http://todomvc.com'}},
                    ]},
                ]
            }
        },
        // init: () => {

        //     const router = useRouter()
        //     const store = useLocalStore()

        //     const newTodo = observable('')
        //     const todos = observable(store.load())

        //     return {
        //         router,
        //         store,
        //         newTodo,
        //         todos,
        //     }
        // },
        initials: {
            router: () => useRouter(),
            store: () => useLocalStore(),
            newTodo: () => observable(''),
            todos: $ => observable($.store.load()),
            hasTodos: $ => computable(() => $.todos.length > 0),
            addTodo: $ => () => {
                $.todos.$value = [...$.todos.$value, {text: $.newTodo.$value, id: new Date().getTime()}]
                $.newTodo.$value = ''
            },
            toggleTodoAsDone: $ => (id, value) => {
                const idx = $.todos.findIndex(todo => todo.id == +id)
                $.todos[idx].completed = value
            },
            filteredTodos: $ => computable(() => {
                return $.todos.filter(todo => {
                    if ($.router.route == 'all') {
                        return true
                    }
                    else if ($.router.route == 'active') {
                        return !todo.completed
                    }
                    else if ($.router.route == 'completed') {
                        return todo.completed
                    }
                })
            }),
            deleteTodo: $ => (id) => {
                $.todos.$value = $.todos.filter(todo => todo.id != +id)
            },
            toggleAll: $ => (value) => {
                $.todos.$value = $.todos.map(todo => ({...todo, completed: value}))
            },
            isAllCompleted: $ => computable(() => {
                return $.filteredTodos.length > 0 && $.filteredTodos.filter(todo => todo.completed).length == $.filteredTodos.length
            }),
            hasCompleted: $ => computable(() => {
                return $.todos.filter(todo => todo.completed).length > 0
            }),
            activeCount: $ => computable(() => {
                return $.todos.filter(todo => !todo.completed).length
            }),
            clearCompleted: $ => () => {
                $.todos.$value = $.todos.filter(todo => !todo.completed)
            },
            changeTodoText: $ => (id, text) => {
                const idx = $.todos.findIndex(todo => todo.id == +id)
                $.todos[idx].text = text
            }
        },
        joints: {
            storeTodos: ({store, todos}) => {

                todos.$subscribe(next => {
                    if (next) {
                        store.save(todos)
                    }
                })

            }
        }
    }
}