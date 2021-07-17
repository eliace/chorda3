


export enum ItemOp {
    ADD = 'add',
    DELETE = 'delete',
    UPDATE = 'update'
}

export type KVItem<T=any> = {
    key: string
    value: T
    op?: ItemOp
} 


type Link = {
    key: string
    index: number

    item?: KVItem
    before?: Link
    after?: Link

    item2?: KVItem
    before2?: Link
    after2?: Link

    merged?: boolean
}



const toSequence = (items: KVItem[]) : [Link, {[key: string]: Link}] => {
    let head: Link = null
    let tail: Link = null
    const map: {[key: string]: Link} = {}
    items.forEach((itm, i) => {
        const link: Link = {
            item: itm,
            key: itm.key,
            index: i,
            before: tail,
            after: null
        }
        map[itm.key] = link
        if (head == null) {
            head = link
        }
        if (tail) {
            tail.after = link
        }
        tail = link

    })
    return [head, map]
}

// const toMap = (items: KVItem[]) : {[key: string]: KVItem} => {
//     const map: {[key: string]: KVItem} = {}
//     items.forEach(itm => {
//         map[itm.key] = itm
//     })
// }


// const mergeLinks = (prevLink: Link, nextLink: Link) : Link => {

// }



export const reconcile = (prevItems: KVItem[], nextItems: KVItem[]) : KVItem[] => {

//    console.log('----------------------------------------------')

    if (prevItems.length == 0) {
        return nextItems.map(itm => {
            itm.op = ItemOp.ADD
            return itm
        })
    }
    if (nextItems.length == 0) {
        return prevItems.map(itm => {
            itm.op = ItemOp.DELETE
            return itm
        })
    }



    //  преобразуем массивы в последовательности
    const [prevSeq, prevMap] = toSequence(prevItems)
    const [nextSeq, nextMap] = toSequence(nextItems)

    const seqMap: {[key: string]: Link} = {}
    // сливаем последовательности
    for (let k in prevMap) {
        seqMap[k] = prevMap[k]
    }
    for (let k in nextMap) {
        if (!seqMap[k]) {
            seqMap[k] = {key: k, index: -1}//nextMap[k].index}
        }
    }
    for (let k in nextMap) {
        const next = nextMap[k]
        const link = seqMap[k]
        link.item2 = next.item
        link.before2 = next.before && seqMap[next.before.key]
        link.after2 = next.after && seqMap[next.after.key]
    }

    const sequence: Link[] = []

    const head = seqMap[nextItems[0].key]

//    console.log(seqMap)

    let tail = head
    // двигаемся вдоль новой головы до первого общего узла
    while (tail && tail.item == null) {
        tail.merged = true
        sequence.push(tail)
        tail = tail.after2
    }
    let saved = tail
    if (tail == null) {
        tail = seqMap[prevItems[0].key]
    }
    // ищем старую голову
    while (tail.before) {
        tail = tail.before
    }
    // двигаемся вдоль старой головы до первого общего узла
    while (tail && tail.item2 == null) {
        tail.merged = true
        sequence.push(tail)
        tail = tail.after
    }

    // возвращаемся к прерванному обходу
    tail = saved
    while (tail) {
        tail.merged = true
        sequence.push(tail)

        if (tail.after2) {
            if (tail.after2.index > tail.index) {
                // собираем старые узлы после
                let node = tail.after
                while (node && node.item2 == null && !node.merged) {
                    node.merged = true
                    sequence.push(node)
                    node = node.after
                }
            }
            else {
                // собираем старые узлы до
                let node = tail.before
                while (node && node.item2 == null && !node.merged) {
                    node.merged = true
                    sequence.push(node)
                    node = node.before
                }
            }
        }

        tail = tail.after2
    }


    // двигаемся назад по новому хвосту
    tail = sequence[sequence.length-1]
    while (tail && tail.item == null) {
        tail = tail.before2
    }
    while (tail) {
        if (!tail.merged) {
            sequence.push(tail)
        }
        tail = tail.after
    }


//     console.log(sequence)

     return sequence.map(link => {
         const item: KVItem = {
             key: link.key,
             value: null//link.item || link.item2
         }

         if (link.item && link.item2) {
             item.op = ItemOp.UPDATE
             item.value = link.item.value
         }
         else if (link.item) {
             item.op = ItemOp.DELETE
            item.value = link.item.value
         }
         else {
             item.op = ItemOp.ADD
             item.value = link.item2.value
            }

         return item
     })
}