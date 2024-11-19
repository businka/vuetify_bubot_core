
## Props
#### hideOperationsPanel 
type: Boolean

default: false
#### alwaysShowOperationsPanel
type: Boolean

default: false

####  operationsPanelItems
type: Array
####  rowActions
type: Array
####  rowActionsField
type: String

default: 'rowViewer'
#### rowActivateHandler
type: Object

default:
* name - имя formViewer который будет использоваться для открытия формы или "inline" для редактирования по месту
* form 

#### toolbarItemsBeforeSearch
type: Array

#### toolbarItemsBeforeFilter
type: Array

item:
* name - название действия
* icon - иконка
* title - заголовок
* data - параметры действия

#### filterFields
type: Array

#### hideSelectAll
type: Boolean

default: false
#### hideToolbar
type: Boolean

default: false

#### hideSearchString
type: Boolean

default: false

#### showColumnHeaders
type: Boolean

default: false

#### rowTemplate
type: String

default: 'rowViewer'

#### dataSource
type: Object

#### columns
type: Array
