import { computable, Infer, iterator, observable, patch } from "@chorda/core"
import { watch } from "../../../utils"
import { Text } from "../../../helpers"



export default () : Infer.Blueprint<any> => {

    const log = observable([])

    const firstName = observable('fff' as string)
    const lastName = observable('lll')
    const fullName = computable(() => firstName.$value + ' ' + lastName.$value)
    const label = computable(() => {
        log.push('compute label')
        return firstName.length <= 3 ? fullName.$value : firstName.$value
    })
    
    watch(() => {
        log.push('watch label')
    }, [label])
    
    log.push(label.$value)
    
    firstName.$value = 'xxxxxxx'
//    firstName.$value = 'aaa'
    
    log.push(label.$value)    

    return {
        tag: 'ul',
        defaultItem: Text({
            as: {tag: 'li'}
        }),
        reactions: {
            log: v => ({items: iterator(v, 'text')})
        },
        injections: {
            log: () => log
        }
    }
}