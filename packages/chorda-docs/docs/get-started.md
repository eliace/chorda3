---
sidebar_position: 1
slug: /
---

# Быстрый старт

### Устанавливаем зависимости

```bash
# chorda
npm i @chorda/core @chorda/engine
# react
npm i @chorda/react react react-dom
```


### Создаем дерево компонентов

Создаем и отрисовываем дерево компонентов

```javascript
import { Html, attach, buildHtmlOptions, buildHtmlContext } from "@chorda/core"
import { createAsyncPatcher } from "@chorda/engine"
import { createReactRenderer } from "@chorda/react"

// 1. объявляем конфигурацию нашего корневого компонента
const options = buildHtmlOptions({
    tag: 'span'
})

// 2. создаем контекст
const context = buildHtmlContext(
    createAsyncPatcher(), // асинхронная очередь обработки патчей
    createReactRenderer() // используем VDOM React
)

// 3. создаем дерево компонентов
const html = new Html(options, context)

// 4. подключаем компоненты к DOM дереву
attach(html, () => document.getElementById('root'))

```


### И что тут происходит?

#### Создание конфигурации

Конфигурация может быть задана несколькими способами, их надо интерпретировать и собрать в набор опций, который понимает используемый компонент `Html`. Это выполняетмся методом `buildHtmlOptions`. В нашем примере мы указываем опцию `tag`, чтобы задать тэг DOM элемента

#### Создание контекста

Компонент типа `Html` для своего создания требует минимальный набор переменных, который инициализируется методом `buildHtmlContext`. Однако патчер и рендерер нам придется задать явно

#### Создание дерева компонентов

При создании корневого компонента в очередь патчей сразу же помещаются новые задания. Наши компоненты с этого момента готовы загружать данные и обрабатывать внешние события

#### Подключение к DOM

На этом шаге мы связываем корневой компонент с узлом DOM-дерева. Начинается обработка задач отрисовки, что приводит к построению и рендерингу VDOM
