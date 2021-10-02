import { defaultHtmlFactory, defaultLayout, Html, HtmlOptions, InferBlueprint, pipe } from "@chorda/core";
import { createPatchScheduler } from "@chorda/engine";
import { createRenderScheduler } from "@chorda/react";
import * as React from "react";

const engine = createPatchScheduler()
const renderer = createRenderScheduler()

export const Test = <T, E>() : InferBlueprint<T, E> => {
    return {
        tag: 'input'
    }
}

const html = new Html(Test() as HtmlOptions<unknown, unknown, any>, {
    $renderer: renderer,
    $engine: engine,
    $defaultFactory: defaultHtmlFactory,
    $defaultLayout: defaultLayout,
    $pipe: pipe(engine, renderer)
})

export const Foo = () => {

    const ref = (el: HTMLElement) => {
        if (el) {
            renderer.attach(el, html)
        }
        else {
            renderer.detach(html)
        }
    }

    return React.createElement('div', {
        ref
    })
}