import { EventBus, Observable, observable } from "@chorda/core"




export type NavigationEvents = {
    next: any
    prev: any
}



export const Navigator: EventBus<any> = observable(null)

Navigator.$event('next')
Navigator.$event('prev')

