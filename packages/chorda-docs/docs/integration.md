# Интеграция

Задачи:
- Встроить изолированный компонент Chorda (свой контекст и рендерер)
- Встроить компонент Chorda (подключиться к контексту и рендереру)
- В Chorda подключить сторонний компонент

## React

```jsx
export const ReactComponent = () => {
    return <div class="app">
        <ChordaStandalone blueprint={MyBlueprint} context={/* корневой скоуп */}/>
    </div>
}
```


```jsx
export const ChordaComponent = () => {
    return {
        layout: () => {
            return <div class="my-react-component"/>
        }
    }
}
```

## Preact


## Inferno