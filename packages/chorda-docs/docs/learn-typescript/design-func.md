# Дизайн-функция

Для декомпозиции дерева компонентов нам приходится прибегать к функциям, создающим частичный чертеж компонента - дизайн-функции

:::info Почему чертежа недостаточно?

Чертеж имеет большой расширяемый набор опций, с одной стороны это обеспечивает полноту настройки компонента и возможность ее расширения, но с другой - очень сложно работать с компонентами используя только опции. Приходится постоянно держать в памяти какая опция за что отвечает в данном чертеже

Гораздо проще работать с набором специфичных свойств для данного компонента. Дизайн функция является отображением этих свойств на чертеж. По сути это builder для чертежа

:::

### Свойства

Свойства так же как и чертеж опеределяются с генериками, т.к. они могут содержать значения чертежей

Как аргумент дизайн-функции свойства являются местом, где происходит настройка (сужение или расширение) скоупа вложенных компонентов

### Генерики

Typescript на данный момент не умееет в частичное применение генериков

Для распространения скоупа на вложенные компоненты используются наборы свойств дизайн функции, в том числе их генерики, а не генерики чертежей

### Типовая структура (3-хкомпонентные примеси)

Смесь обычной дизайн-функции состоит из 3-х компонентов:
1. опции, не зависящие от входных свойств (можно считать эту часть аналогичной html-шаблонам, как правило здесь опции, отвечающие за структуру)
2. опции расширения (обычно задаются свойством `as`)
3. опции, зависящие от входных свойств (здесь собственно и сосредотачивается определение поведения компонента)

:::tip
Если мы используем 3-хкомпонентную дизайн-функцию в вырожденном режиме (без аргументов), то от нее отпадают расширение и поведение. Остается только структура, которую можно использовать как "глупый" компонент в других смесях
:::