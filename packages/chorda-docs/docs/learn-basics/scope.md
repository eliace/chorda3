---
sidebar_position: 3
---
# Реактивность

Реактивность Chorda состоит из двух частей:
1. Базовая реактивность - включает в себя конфигурацию скоупа и связь между данными и компонентами по схеме PubSub
2. Расширенная реактивность - управление сайд-эффектами с помощью [событий](../learn-advanced/events), [асинхронных функций](../learn-advanced/callable) и [точек соединения](../learn-advanced/joints)

Ниже пойдет речь о базовой реактивности

:::info
Базовая реактивность очень проста и работает по следующей схеме:

`Изменение` -> `Реакция` -> `Патч`
:::

## Скоуп

Скоуп это набор переменных, доступных компоненту. Архитектура Chorda исходит из того, что состояние компонента описывается только скоупом

:::tip
Если сравнивать Chorda с React, то скоуп можно понимать как локальный *store*
:::

:::info
В Chorda отсутствует понятие **контекста** как глобального набора данных, доступного всем компонентам. Под **контекстом** понимается только родительский скоуп
:::

### Описание

Локальные переменные компонента задаются в блоке `defaults`. 

```javascript

export default () => {
    return {
        defaults: {
            // создаем реактивную переменную скоупа
            text: () => observable(''),
            // в скоуп можно положить и не реактивное значение
            name: () => 'MyComponent',
        },
    }
}
```

:::warning
При совпадении имен переменных в контексте и в `defaults`, будет использована локальная переменная из `defaults`
:::

### Инъекция

Скоуп компонента "содержит" собственные переменные и переменные контекста. Таким образом с помощью инжектирования мы можем добавить переменные, которые определены вне компонента (IoC)

```javascript

export default () => {
    return {
        injections: {
            cn: (scope) => scope.data,  // достаем переменную data из скоупа
        },
    }
}
```

:::tip
Скоуп может быть нереактивным, когда все его элементы являются константами
:::

### Передача

При создании дочернего компонента, ему по умолчанию передается скоуп родительского компонента (контекст)

Так в примере ниже компоненты **form**, **button** и **icon** имеют одинаковые скоупы

```javascript
export default () => {
    return {
        templates: {
            form: {
                templates: {
                    button: {
                        templates: {
                            icon: {
                            }
                        }
                    }
                }
            }
        }
    }
}
```

:::caution
Скоупы именно *одинаковые*, т.е. набор переменных в них один и тот же, но сами скоупы разные
:::

## Реакции

Реакцией является функция, которая возвращает новый частичный набор опций - **патч**. Реакция связана с переменной скоупа и задается в блоке `reactions`

```javascript
export default () => {
    return {
        reactions: {
            // патч содержит новое значение опции text
            data: v => ({text: v})
        }
    }
}

```

:::caution
В Chorda реакции это единственный способ динамически создать патч опций, т.е. единственный способ изменить состояние компонента
:::

##  Переменные

Chorda предлагает свой набор типов переменных для создания реактивного скоупа


### observable

Простая реактивная переменная

```javascript
const val = observable('')

val.$value = 'Hello' // уведомляются все подписчики
```

### computable

Вычисляемая переменная, задается функцией. У нее есть особенности:
1. На все реактивные переменные внутри вычисления автоматически устанавливается подписка
2. Внутри функции включен [терминальный режим](#терминальный-режим)
3. Чистая функция

```javascript
const x = observable(1)
const y = observable(10)

const sum = computable(() => x + y)

// sum.$value == 11

x.$value = 5

// sum.$value == 15

```

:::warning
Внутри **computable** нельзя изменять состояние скоупа. Если вы хотите, чтобы ваше вычисление изменяло другие значения, то можете воспользоваться блоком `joints`
:::


### ~~iterable~~

Обертка-итератор над реактивной переменной

Добавляет переменной метод `$each`

```javascript
const it = iterable([1, 2, 3])

it.$each(itm => {
    // реактивный элемент массива
})
```

### Ссылочная целостность

Реактивные переменные являются обертками над значениями. При модификациях или присвоениях ссылочно значение остается тем же самым

```javascript
const obj = {id: 1, name: 'Alice'}

const a = observable(obj)
const b = observable(obj)

a.id = 5

a.$value == b.$value // true

```

### Прокси

Все переменные используют объект `Proxy` для доступа к своим свойствам. По умолчанию каждое свойство реактивной переменной тоже является реактивным (кроме терминального режима)


## Терминальный режим

В терминальном режиме свойства переменной проверяются на формальное отсутствие вложенных свойств (справедливо, к примеру, для примитивных типов). В этом случае свойство считается *терминальным* и становится доступно по значению

```javascript
const val = observable({
    a: 5,
    b: {
        c: 'hello'
    }
})

// терминальный режим

val.a // 5

val.b // [Proxy]

val.b.c // "hello"

```



