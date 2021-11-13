import { attach, buildHtmlContext, buildHtmlOptions, Html, HtmlOptions, HtmlScope } from "@chorda/core";
import { createReactRenderer } from "@chorda/react"
import App from "./App";

const createAppScope = () : HtmlScope => {
    return buildHtmlContext(createReactRenderer())
}

const createAppOptions = () : HtmlOptions<unknown, unknown, any> => {
    return buildHtmlOptions(App())
}



const html = new Html(createAppOptions(), createAppScope())

attach(html, () => document.getElementById('app'))

