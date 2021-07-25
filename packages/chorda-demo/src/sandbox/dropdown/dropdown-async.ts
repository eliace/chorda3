import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Dropdown } from "../../helpers"





export default <T>() : HtmlBlueprint<T> => {
    return RowLayout([
        Dropdown({

        })
    ])
}
