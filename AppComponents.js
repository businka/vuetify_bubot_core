import Vue from 'vue'

Vue.component('RightDrawerFormViewer', () => import('./components/FormViewer/RightDrawerFormViewer'))
Vue.component('RightDrawerFormViewer2', () => import('./components/FormViewer/RightDrawerFormViewer2'))
Vue.component('RightDrawerFormViewer3', () => import('./components/FormViewer/RightDrawerFormViewer3'))
Vue.component('TestForm', () => import('./components/FormViewer/TestForm'))
Vue.component('SimpleForm', () => import('./components/JsonEditor/SimpleForm'))
Vue.component('SimpleTabsForm', () => import('./components/JsonEditor/SimpleTabsForm'))
Vue.component('JsonTabsForm', () => import('./components/JsonEditor/JsonTabsForm'))
// Vue.component('DocViewer', () => import('./components/DocViewer/DocViewer'))
//
// Vue.component('Tree', () => import('./components/TreeBrowser/TreeBrowser'))
Vue.component('ToolBar', () => import('./components/Simple/ToolBar'))
Vue.component('MassOperationsBar', () => import('./components/Simple/MassOperationsBar'))
// Vue.component('FilterBar', () => import('./components/Filter/FilterBar'))
Vue.component('Browser', () => import('./components/Layouts/Browser'))
// Vue.component('DataGrid', () => import('./components/DataGrid/DataGrid'))
Vue.component('SelectBrowser', () => import('./components/Panel/SelectBrowser'))
// Vue.component('TreeDataGrid', () => import('./components/DataGrid/TreeDataGrid'))
// Vue.component('TabsBrowser', () => import('./components/TabsBrowser/TabsBrowser'))
//
//
// Vue.component('BtnLink', () => import('./components/DocViewer/BtnLink'))
// Vue.component('FieldLink', () => import('./components/Simple/FieldLink'))
// Vue.component('JsonObjectLink', () => import('./components/JsonEditor/JsonObjectLink'))
//
//
Vue.component('JsonEditor', () => import('./components/JsonEditor/JsonEditor'))
Vue.component('JsonForm', () => import('./components/JsonEditor/JsonForm'))
// Vue.component('ParamsEditor', () => import('./components/ParamsEditor/ParamsEditor'))



// Vue.component('RowCellDefault', () => import('./components/Cells/RowCellDefault'))
// Vue.component('RowCellTitle', () => import('./components/Cells/RowCellTitle'))
// Vue.component('RowCellNumber', () => import('./components/Cells/RowCellNumber'))
// Vue.component('RowCellFieldLink', () => import('./components/Cells/RowCellFieldLink'))
// Vue.component('RowCellIcon', () => import('./components/Cells/RowCellIcon'))
// Vue.component('RowCellDateTime', () => import('./components/Cells/RowCellDateTime'))


// Vue.component('ActionBtnDefault', () => import('./components/ActionButtons/ActionBtnDefault'))
Vue.component('ActionTitle', () => import('./components/ActionButtons/ActionTitle'))
Vue.component('ActionBtn', () => import('./components/ActionButtons/ActionBtn'))
Vue.component('ActionBtnMenu', () => import('./components/ActionButtons/ActionBtnMenu'))

