import { defaultHtmlFactory, defaultHtmlInitRules, defaultLayout, Html, HtmlOptions, HtmlScope, mix, mixin, pipe } from "@chorda/core";
import { createRenderScheduler } from "@chorda/react"
import { createPatchScheduler } from "@chorda/engine"
import App from "./App";

const createAppScope = () : HtmlScope => {

    const patchQueue = createPatchScheduler()
    const renderQueue = createRenderScheduler()

    return {
        $defaultFactory: defaultHtmlFactory,
        $defaultLayout: defaultLayout,
        $renderer: renderQueue,
        $engine: patchQueue,
        $pipe: pipe(patchQueue, renderQueue)
    }
}

const createAppOptions = () : HtmlOptions<unknown, unknown, any> => {
    return mixin(App()).build(defaultHtmlInitRules) as HtmlOptions<unknown, unknown, any>
}



const html = new Html(createAppOptions(), createAppScope())

document.addEventListener('DOMContentLoaded', () => {
    html.attach(document.getElementById('app'))
})    


