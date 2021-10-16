---
sidebar_position: 1
---

# Опции

Приложение, реализованное с помощью Chorda, это одна большая конфигурация

### Конфигурация

```javascript

const html = new Html({
    items: [{
        tag: 'button',
    }, {
        tag: 'a',
    }]
})

```


Конфигурации отдельных компонентов можно вынести в отдельные файлы

```javascript
// Button.js
export default () => {
    return {
        tag: 'button'
    }
}

// Link.js
export default () => {
    return {
        tag: 'a'
    }
}

// App.js
import Link from "./Link"
import Button from "./Button"

const App = () => {
    return {
        items: [
            Button, 
            Link,
        ]
    }
}

const app = new Html(App())
```

Таким образом до момента создания корневого компонента конфигурация является просто объектом, который можно свободно модифицировать


### Смесь конфигураций

Chorda предлагает модификацию конфигураций через смешивание

В состав смеси могут входить:
- `HtmlOptions` - структурированный набор опций
- `boolean` - значение false отменяет предыдущие конфигурации в смеси, true игнорируется
- `Function` - возвращает смешанную конфигурацию
- `Promise` - отложенная смешанная конфигурация

Поскольку компоненты в качестве конфигурации принимают только `HtmlOptions`, это означает, что необходима предварительная сборка/объединение смеси


```javascript
const mixedOptions = mixin({name: 'myComponent'}, MyComponent, 'Hello')
```

Правила применения зависят от компонента

