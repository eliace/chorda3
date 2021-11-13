import { Infer } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const WebComponentsExample = () : Infer.Blueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic/index').default,
            files: [
                {
                    name: 'index.ts',
                    code: require('!raw-loader!./basic/index').default
                },
                {
                    name: 'cwc.ts',
                    code: require('!raw-loader!./common/cwc').default
                },
            ]
        }),
    ])
}
