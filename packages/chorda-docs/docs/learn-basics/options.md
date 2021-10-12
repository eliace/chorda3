---
sidebar_position: 1
---

# Опции

### Конфигурация

```javascript

const html = new Html({
    tag: 'div'
})

```


Можем вынести конфигурацию в отдельный файл

```javascript
// Link.js
export default () => {
    return {
        tag: 'a'
    }
}

// App.js
import Link from "./Link"

const app = new Html(Link())

```


### Смесь конфигураций

В состав смеси могут входить:
- `HtmlOptions` - структурированный набор опций
- `boolean` - значение false отменяет предыдущие конфигурации в смеси, true игнорируется
- `Function` - возвращает смешанную конфигурацию
- `Promise` - отложенная смешанная конфигурация

Поскольку компоненты в качестве конфигурации принимают только `HtmlOptions`, это означает, что необходима предварительная сборка/объединение смеси


```javascript
const mixedOptions = mixin({name: 'myComponent'}, MyComponent, 'Hello')
```

Сборка/объединение смеси произойдет только в момент использования. Правила применения зависят от компонента

