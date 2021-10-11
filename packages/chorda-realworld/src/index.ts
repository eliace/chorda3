import { createHtmlContext, createHtmlOptions, Html, HtmlOptions, HtmlScope, render } from "@chorda/core";
import { createReactRenderer } from "@chorda/react"
import { createAsyncPatcher } from "@chorda/engine"
import App from "./App";

const createAppScope = () : HtmlScope => {
    return createHtmlContext(createAsyncPatcher(), createReactRenderer())
}

const createAppOptions = () : HtmlOptions<unknown, unknown, any> => {
    return createHtmlOptions(App()) //mixin(App()).build(defaultHtmlInitRules) as HtmlOptions<unknown, unknown, any>
}



const html = new Html(createAppOptions(), createAppScope())

render(html, () => document.getElementById('app'))

