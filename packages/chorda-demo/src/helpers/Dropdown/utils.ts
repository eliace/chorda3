import { Blueprint, computable, HtmlBlueprint, HtmlScope, InferBlueprint, mix, observable, Scope } from "@chorda/core"
import { watch, withBlueprint, withScope } from "../../utils"


export type MenuItem = {
    id: any
    name: string
}

