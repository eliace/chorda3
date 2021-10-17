# Компонент


## События жизненного цикла

- afterInit
- afterDestroy
- afterSyncIndexed
- afterSyncKeyed
- afterAddKeyed
- beforeRemoveKeyed
- afterRender

События жизненного цикла это единственное место, где мы имеем доступ к компоненту

## Создание собственных классов компонентов

Нам нужно добавить:
- обработку своих опций в патче
- правила слияния новых опций
- очистку при удалении

```javascript
const MyComponent extends Html {

}


```