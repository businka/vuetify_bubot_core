#Long operations
Длительные операции которые требуют вывода сопроводительной информации во время выполнения (в т.ч. прогресс бар) или
результата выполнения операции, или отправки команды отмены операции.

Action
* uid - идентификатор экземпляра операции
* objType
* objName
* action
* title
* title_\[lang]
* description
* title_\[lang]
* message - сообщение детализирующее текущий статус
* status
 * pending - в ожидании
 * run - выполняется
 * cancel - отменено
 * error - ошибка
 * success - завершено успешно
* mode
* form
* type
* template - имя шаблона
* components


Возможности
* Запустить операцию с визуализацией в модальном окне
* Добавить операцию в список операций с возможностью открыть для просмотра в модальном окне
* Прервать операцию в процессе выполнения.
* Запросить действие у пользователя.
* После окончания операции выполнить действие определенное в процессе исполнения:
 * окрыть форму и передать в неё результат
 * просто закрыть
 * ничего не далать ждать закрытия пользователем

## API BL
### Выполнение
Message
* type: "call"


## Vuex
state

LongOperations
* uid
  * 
