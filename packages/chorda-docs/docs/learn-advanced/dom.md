# Dom

Доступ к DOM осуществляется через реактивную переменную скоупа `$dom`

## Подключение/отключение

Поскольку создание и удаления узла DOM асинхронно, то для взаимодействия с ним понадобится подписка

```javascript
export default () => {
    return {
        joints: {
            connectToDom: ({$dom}) => {
                $dom.$subscribe(el => {
                    if (el) {
                        // DOM элемент создан 
                    }
                    else {
                        // DOM элемент удален
                    }
                })
            }
        }
    }
}
```

## События

Список событий определяется рендерером

```javascript
export default () => {
    return {
        events: {
            $dom: {
                // это событие задано ReactRenderer
                click: () => {
                    //
                }
            }
        }
    }
}
```