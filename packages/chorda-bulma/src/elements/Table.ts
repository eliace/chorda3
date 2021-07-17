import { HtmlBlueprint, Injector, mix, observable, patch } from "@chorda/core"



type TableScope = {
    data: any[]
}

type TableProps<T> = {
    defaultRow?: HtmlBlueprint<T>
//    defaultCell?: HtmlConfig|Options|Function
    headerRows: HtmlBlueprint<T>[]
    rows?: HtmlBlueprint<T>[]
    data?: any[],
    data$?: Injector<T>,
    cols?: HtmlBlueprint<T>[]
}


export const Table = <T>(props: TableProps<T&TableScope>) : HtmlBlueprint<T> => {
    return mix<TableScope>({
        tag: 'table',
        css: 'table',
        templates: {
            colgroup: {
                tag: 'colgroup',
                weight: -10,
                defaultItem: {
                    tag: 'col'
                }
            },     
            header: {
                tag: 'thead',
                defaultItem: {
                    tag: 'tr',
                    defaultItem: {
                        tag: 'th'
                    }
                }
                // defaultItem: Row({
                //     defaultCell: HeaderCell({})
                // }),
                // bindings: {
                //     hrows: (v: any, s: any) => {
                //         console.log('rows', v)
                //         patch({items: v})
                //     }
                // }
            },
            body: {
                tag: 'tbody',
                defaultItem: {
                    tag: 'tr',
                    defaultItem: {
                        tag: 'td'
                    }
                },
                reactors: {
                    data: (next) => {
//                        debugger
                        patch({items: next})
                    }
                }
            }
        }
    }, {
        components: {
            colgroup: {
                items: props.cols
            },  
            header: {
                items: props.headerRows
            },
            body: {
                items: props.rows,
                defaultItem: props.defaultRow,
            }
        },
        injectors: {
            data: props.data$ || (() => observable(props.data))
        }
    })
}




//
// Cols
//

type ColProps = {
    width?: number|string,
}


export const Col = <T>(props: ColProps) : HtmlBlueprint<T> => {
    return {
//        tag: 'col',
        dom: {
            width: props.width// || '150px'
        }
    }
}



//
// Row
//

type RowScope<D=any> = {
    data: D[]
}

type RowProps<T> = {
    defaultCell?: HtmlBlueprint<T>
    cells?: HtmlBlueprint<T>[]
    data$?: Injector<T>
    data?: T
//    dataId?: string
}



export const Row = <T>(props: RowProps<T>) : HtmlBlueprint<T> => {
    return mix<RowScope>({
    }, {
        defaultItem: props.defaultCell,
        items: props.cells,
        // injectors: {
        //     data: props.data$ || (() => props.data)
        // },
        // reactors: {
        //     data: (v) => patch({items: v})
        // }
    })
}


//
// Cell
//

type CellProps<T> = {
    text?: string
    data?: T,
    data$?: Injector<T>
    format?: (s: T) => string
}

export const Cell = <T>(props: CellProps<T>) : HtmlBlueprint<T> => {
    return mix<any>(/*{
//        tag: 'td'
    }, */{
//        text: props.text,
        reactors: {
            data: (v) => patch({text: (props.format || String)(v)})
        },
        injectors: {
            data: props.data$ || (() => props.text)
        }
    })
}


