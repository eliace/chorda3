import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, iterable, mix, observable } from "@chorda/core"



export type TableScope = {
    data: any[]
    rows: any[]
}

type TableProps<T> = {
    defaultRow?: Blueprint<T>
//    defaultCell?: HtmlConfig|Options|Function
    headerRows: Blueprint<T>[]
    rows?: Blueprint<T>[]
    data?: any[],
    data$?: Injector<T>,
    cols?: Blueprint<T>[]
}


export const Table = <T>(props: TableProps<T&TableScope>) : InferBlueprint<T> => {
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
                //         ({items: v})
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
                reactions: {
                    rows: (next) => ({items: next})
                },
                injections: {
                    rows: $ => iterable($.data, 'data')
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
        injections: {
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


export const Col = <T>(props: ColProps) : InferBlueprint<T> => {
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

export type RowProps<I, T> = {
    defaultCell?: Blueprint<T&CellScope<I>>
    cells?: Blueprint<T&CellScope<I>>[]
    data$?: Injector<T>
    data?: T
//    dataId?: string
}

export type RowPropsType<I, T=unknown> = RowProps<I, T&RowScope>


export const Row = <T>(props: RowPropsType<unknown, T>) : InferBlueprint<T> => {
    return mix<RowScope>({
    }, {
        defaultItem: props.defaultCell,
        items: props.cells,
        // injections: {
        //     data: props.data$ || (() => props.data)
        // },
        // reactions: {
        //     data: (v) => ({items: v})
        // }
    })
}


//
// Cell
//

type CellScope<I> = {
    data: I
}

export type CellProps<T> = {
    text?: string
    data?: T,
    data$?: Injector<T>
    format?: (s: T) => string
}

export const Cell = <T>(props: CellProps<T>) : InferBlueprint<T> => {
    return mix<any>(/*{
//        tag: 'td'
    }, */props && {
//        text: props.text,
        reactions: {
            data: (v) => ({text: (props.format || String)(v)}) //({text: (props.format || String)(v)})
        },
        injections: {
            data: props.data$ || (() => props.text)
        }
    })
}


