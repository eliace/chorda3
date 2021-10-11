"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcile = exports.ItemOp = void 0;
var ItemOp;
(function (ItemOp) {
    ItemOp["ADD"] = "add";
    ItemOp["DELETE"] = "delete";
    ItemOp["UPDATE"] = "update";
})(ItemOp = exports.ItemOp || (exports.ItemOp = {}));
var toSequence = function (items) {
    var head = null;
    var tail = null;
    var map = {};
    items.forEach(function (itm, i) {
        var link = {
            item: itm,
            key: itm.key,
            index: i,
            before: tail,
            after: null
        };
        map[itm.key] = link;
        if (head == null) {
            head = link;
        }
        if (tail) {
            tail.after = link;
        }
        tail = link;
    });
    return [head, map];
};
// const toMap = (items: KVItem[]) : {[key: string]: KVItem} => {
//     const map: {[key: string]: KVItem} = {}
//     items.forEach(itm => {
//         map[itm.key] = itm
//     })
// }
// const mergeLinks = (prevLink: Link, nextLink: Link) : Link => {
// }
var reconcile = function (prevItems, nextItems) {
    // TODO должна быть проверка на уникальность ключей
    //    console.log('----------------------------------------------')
    if (prevItems.length == 0) {
        return nextItems.map(function (itm) {
            itm.op = ItemOp.ADD;
            return itm;
        });
    }
    if (nextItems.length == 0) {
        return prevItems.map(function (itm) {
            itm.op = ItemOp.DELETE;
            return itm;
        });
    }
    //  преобразуем массивы в последовательности
    var _a = toSequence(prevItems), prevSeq = _a[0], prevMap = _a[1];
    var _b = toSequence(nextItems), nextSeq = _b[0], nextMap = _b[1];
    var seqMap = {};
    // сливаем последовательности
    for (var k in prevMap) {
        seqMap[k] = prevMap[k];
    }
    for (var k in nextMap) {
        if (!seqMap[k]) {
            seqMap[k] = { key: k, index: -1 }; //nextMap[k].index}
        }
    }
    for (var k in nextMap) {
        var next = nextMap[k];
        var link = seqMap[k];
        link.item2 = next.item;
        link.before2 = next.before && seqMap[next.before.key];
        link.after2 = next.after && seqMap[next.after.key];
    }
    var sequence = [];
    var head = seqMap[nextItems[0].key];
    //    console.log(seqMap)
    var tail = head;
    // двигаемся вдоль новой головы до первого общего узла
    while (tail && tail.item == null) {
        tail.merged = true;
        sequence.push(tail);
        tail = tail.after2;
    }
    var saved = tail;
    if (tail == null) {
        tail = seqMap[prevItems[0].key];
    }
    // ищем старую голову
    while (tail.before) {
        tail = tail.before;
    }
    // двигаемся вдоль старой головы до первого общего узла
    while (tail && tail.item2 == null) {
        tail.merged = true;
        sequence.push(tail);
        tail = tail.after;
    }
    // возвращаемся к прерванному обходу
    tail = saved;
    while (tail) {
        tail.merged = true;
        sequence.push(tail);
        if (tail.after2) {
            if (tail.after2.index > tail.index) {
                // собираем старые узлы после
                var node = tail.after;
                while (node && node.item2 == null && !node.merged) {
                    node.merged = true;
                    sequence.push(node);
                    node = node.after;
                }
            }
            else {
                // собираем старые узлы до
                var node = tail.before;
                while (node && node.item2 == null && !node.merged) {
                    node.merged = true;
                    sequence.push(node);
                    node = node.before;
                }
            }
        }
        tail = tail.after2;
    }
    // двигаемся назад по новому хвосту
    tail = sequence[sequence.length - 1];
    while (tail && tail.item == null) {
        tail = tail.before2;
    }
    while (tail) {
        if (!tail.merged) {
            sequence.push(tail);
        }
        tail = tail.after;
    }
    //     console.log(sequence)
    return sequence.map(function (link) {
        var item = {
            key: link.key,
            value: null //link.item || link.item2
        };
        if (link.item && link.item2) {
            item.op = ItemOp.UPDATE;
            item.value = link.item.value;
        }
        else if (link.item) {
            item.op = ItemOp.DELETE;
            item.value = link.item.value;
        }
        else {
            item.op = ItemOp.ADD;
            item.value = link.item2.value;
        }
        return item;
    });
};
exports.reconcile = reconcile;
//# sourceMappingURL=reconcile.js.map