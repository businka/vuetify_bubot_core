Страничка выводимая пользователю состоит из компонент. 
На страничке используются компоненты различных производителей. 
Целей данного фруймворка укрупнить компоненты для решения конкретных задач.
В конечном счете работая в интерфейсе пользователь решает определенную задачу.
Инструменты необходимые пользователю для решения задачи объедены в формы.

Форма это набор компонент - инструмент манипулированияединица данными для решения конкретной задачи.
Кроме этого уровень предоставления доступа к данным пользователю настраивается наличием
доступа к конкретной форме.

##Структура форма
* uid - уникальный идентификатор/ код формы
* template = имя шаблона основного компонента формы
* components - объект с параметрами вспомогательных компонентов формы. У каждой формы
свой набор вспомогательных компонент.
* 
