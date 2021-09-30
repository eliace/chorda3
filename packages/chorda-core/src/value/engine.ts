import { SubscriptionProvider } from "."
import { EMPTY, LifecycleProvider } from "./utils"


export type Transaction = {
    joined: boolean
}

type NodeUpdate = {
    node: SubscriptionProvider
    prev: any
    next: any
}

type UpdateSession = {
    nodes: Set<any>
    head: any
    deleted: (SubscriptionProvider&LifecycleProvider)[]
    updated: NodeUpdate[]
}





let _Session: UpdateSession = null

export const openTransaction = () : Transaction => {
    const t = {joined: true}
    if (!_Session) {
        _Session = {
            nodes: new Set(),
            head: this,
            deleted: [],
            updated: []
        }
        t.joined = false
    }
    // else {
    //     debugger
    // }
    return t
}

export const closeTransaction = (t: Transaction) => {
    if (!t.joined) {
        if (_Session.updated.length > 0 || _Session.deleted.length > 0) {
            _engine.addSession(_Session)
        }
        _Session = null    
    }
}

export const transactionUpdates = (t: Transaction) : NodeUpdate[] => {
    return _Session.updated
}

export const currentTransaction = () : UpdateSession => {
    return _Session
}





class UpdateEngine {

    _sessions: UpdateSession[]
    _commiting: boolean
    _commitedNodes: Map<unknown, any>
//    _commitedSubscriptions: Set<Subscription>

    constructor () {
        this._sessions = []
        this._commitedNodes = new Map<any, unknown>()
//        this._commitedSubscriptions = new Set<Subscription>()
    }

    addSession(session: UpdateSession) {
        this._sessions.push(session)
    }

    commit () {
        if (!this._commiting) {

//            console.log('commit', this._sessions)

//            this._commitedNodes.size == 0 && console.log('Commit start')
            this._commiting = true

            const sessions = this._sessions
            this._sessions = []

            sessions.forEach(session => {
//                console.log('session', session.updated)

                // ?
                session.deleted.forEach(del => {
//                    console.log('delete', del)
                    del.$destroy()
                })

//                const lastUpdateMap = new Map<Subscriber<any>, NodeUpdate>()
                session.updated.forEach(upd => {
                    if (this._commitedNodes.has(upd.node)) {
                        //console.warn('Cyclic update detected', upd.prev, upd.next)
                        if (upd.next === this._commitedNodes.get(upd.node)) {
                            console.warn('Possible cyclic update', upd)
                            return
                        }
//                        return
                    }
                    upd.node.$subscriptions.forEach(sub => {
//                        console.log('publish to subscriber', upd.next)
                        sub.subscriber.$publish(upd.next, upd.prev, EMPTY)
                    })
                    this._commitedNodes.set(upd.node, upd.next)
                })
                // lastUpdateMap.forEach((upd, sub) => {
                //     sub.$publish(upd.next, upd.prev, EMPTY)
                // })
//                 session.updated.forEach(upd => {
//                     if (this._commitedNodes.has(upd.node)) {
//                         if (upd.next == 'filter: Albania') {
//                             debugger
//                         }
// //                        console.log('Already commited', upd, upd.node._memoValue)
//                         return
//                     }
//                     upd.node._subscriptions.forEach(sub => {
//                         sub.subscriber.$publish(upd.next, upd.prev, EMPTY)
//                     })
//                 })
//                this._commitedNodes.add(session.head as Node<any>)
            })

            this._commiting = false

            if (this._sessions.length > 0) {
                this.commit()
//                console.log('commit')
            }
            else {
                this._commitedNodes.clear()
//                console.log('Commit end')
            }
        }
    }


}

const _engine = new UpdateEngine()


export const commitEngine = () => {
    return _engine
}