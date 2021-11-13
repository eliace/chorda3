import { attach, buildHtmlContext, buildHtmlOptions, Html, HtmlOptions, HtmlScope } from "@chorda/core";
import { createReactRenderer } from "@chorda/react"
import App from "./single";


const html = new Html(
    buildHtmlOptions(App()), 
    buildHtmlContext(createReactRenderer())
    )

attach(html, () => document.getElementById('app'))

