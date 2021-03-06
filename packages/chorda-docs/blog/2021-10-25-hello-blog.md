---
title: Новая версия Chorda 3.0
description: Описание нововведений Chorda 3.0
slug: chorda-release-3
authors:
  - name: Eliace
    title: Author and maintainer of Chorda
    url: https://github.com/eliace
    image_url: https://avatars.githubusercontent.com/u/281135?s=96&v=4
tags: [chorda, release 3.0]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: true
---

Что нового?
- "Ленивый" скоуп
- Callable
- Переименованы некоторые свойства
- Упрощение joint-ов и контроль подписки
- Вложенные обработчики событий
- Служебные события
- Ну и костыли typescript

<!--truncate-->

## "Ленивый" скоуп

Передача скоупа раньше представляла из себя копирование содержимого родительского скоупа и слияние его с дочерним. Простая рабочая схема, но у нее были проблемы:
- лишние копирования ненужных свойств. Чем жирнее скоуп, тем больше копирований
- ограниченное разрешение кросс-ссылок. Разрешение происходило только во время инициализации и не все компоненты скоупа могли быть доступны в этот момент

Теперь скоуп разрешает переменные лениво и в новой последовательности:
1. Инжектируемые переменные (определяются разработчиком)
2. Проецируемые переменные (задаются при использовании итераторов)
3. Инициализационные переменные (переменные по умолчанию)
4. Переменные контекста (передаются от родительского компонента)

## Callable

Новый тип объектов, содержащий функцию. На результат выполнения функции можно подписаться через раздел events. От computable отличается тем, что значением является функция и в первую очередь она предназначена для изменения других свойств скоупа

## Переименования

Покинули чат: `scope`, `bindings`

Появились: `injections`, `reactions`, `initials`

## Joint-ы

Теперь джоинты не привязаны к переменной скоупа, а подключаются ко всему скоупу. Все подписки, выполняемые во время джоинта, отзываются при удалении компонента

## События

Для подключения к событиям теперь необходимо указывать прослушиваемую переменную. В первую очередь это сделано, чтобы не проверять весь скоуп в поисках зарегистрированных событий. Регистрация событий теперь не нужна

В разделе `events` можно подписываться на callable переменные

## Служебные события

- afterInit
- afterDestroy
- afterSyncIndexed
- afterSyncKeyed
- afterAddKeyed
- beforeRemoveKeyed
- afterRender

## Typescript

Для корректного управления угадайкой (infer) следует использовать Blueprint/InferBlueprint. На данный момент это "костыльное" решение, т.к. другой альтернативы нет

Частичное применение генериков так же недоступно. Общая рекомендация: не модифицировать генерики ответа, работать только с расширением или приведением типов аргументов


# Концептуальные проблемы

- невозможно использовать один узел в разных деревьях
- использование VDOM, хотя есть полная информация об изменении DOM
- невозможно клонирование или перенос поддерева


