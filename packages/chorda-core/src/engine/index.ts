

export interface Engine<T> {
    scheduleTask: (fn: Function, arg?: any, target?: T) => void
    pipeTask: (fn: Function, arg?: any, target?: T) => void
    immediate: () => void
    addPostEffect: (fn: Function) => void
    schedule () : void
    chain: (link: Engine<any>) => void
}

