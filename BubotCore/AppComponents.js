import { defineAsyncComponent } from 'vue'

export default function registerComponents(app) {
  app.component('RightDrawerFormViewer', defineAsyncComponent(() => import('./components/FormViewer/RightDrawerFormViewer')))
  app.component('RightDrawerFormViewer2', defineAsyncComponent(() => import('./components/FormViewer/RightDrawerFormViewer2')))
  app.component('RightDrawerFormViewer3', defineAsyncComponent(() => import('./components/FormViewer/RightDrawerFormViewer3')))
  app.component('TestForm', defineAsyncComponent(() => import('./components/FormViewer/TestForm')))
  app.component('SimpleForm', defineAsyncComponent(() => import('./components/JsonEditor/SimpleForm')))
  app.component('SimpleTabsForm', defineAsyncComponent(() => import('./components/JsonEditor/SimpleTabsForm')))
  app.component('JsonTabsForm', defineAsyncComponent(() => import('./components/JsonEditor/JsonTabsForm')))
// app.component('DocViewer', defineAsyncComponent(() => import('./components/DocViewer/DocViewer')))
//
// app.component('Tree', defineAsyncComponent(() => import('./components/TreeBrowser/TreeBrowser')))
  app.component('ToolBar', defineAsyncComponent(() => import('./components/Simple/ToolBar')))
  app.component('MassOperationsBar', defineAsyncComponent(() => import('./components/Simple/MassOperationsBar')))
// app.component('FilterBar', defineAsyncComponent(() => import('./components/Filter/FilterBar')))
  app.component('TableBrowser', defineAsyncComponent(() => import('./components/TableBrowser/TableBrowser')))
// app.component('DataGrid', defineAsyncComponent(() => import('./components/DataGrid/DataGrid')))
  app.component('SelectBrowser', defineAsyncComponent(() => import('./components/Panel/SelectBrowser')))
// app.component('TreeDataGrid', defineAsyncComponent(() => import('./components/DataGrid/TreeDataGrid')))
// app.component('TabsBrowser', defineAsyncComponent(() => import('./components/TabsBrowser/TabsBrowser')))
//
//
// app.component('BtnLink', defineAsyncComponent(() => import('./components/DocViewer/BtnLink')))
// app.component('FieldLink', defineAsyncComponent(() => import('./components/Simple/FieldLink')))
// app.component('JsonObjectLink', defineAsyncComponent(() => import('./components/JsonEditor/JsonObjectLink')))
//
//
  app.component('JsonEditor', defineAsyncComponent(() => import('./components/JsonEditor/JsonEditor')))
  app.component('JsonForm', defineAsyncComponent(() => import('./components/JsonEditor/JsonForm')))
// app.component('ParamsEditor', defineAsyncComponent(() => import('./components/ParamsEditor/ParamsEditor')))


// app.component('RowCellDefault', defineAsyncComponent(() => import('./components/Cells/RowCellDefault')))
// app.component('RowCellTitle', defineAsyncComponent(() => import('./components/Cells/RowCellTitle')))
// app.component('RowCellNumber', defineAsyncComponent(() => import('./components/Cells/RowCellNumber')))
// app.component('RowCellFieldLink', defineAsyncComponent(() => import('./components/Cells/RowCellFieldLink')))
// app.component('RowCellIcon', defineAsyncComponent(() => import('./components/Cells/RowCellIcon')))
// app.component('RowCellDateTime', defineAsyncComponent(() => import('./components/Cells/RowCellDateTime')))


// app.component('ActionBtnDefault', defineAsyncComponent(() => import('./components/ActionButtons/ActionBtnDefault')))
  app.component('ActionTitle', defineAsyncComponent(() => import('./components/ActionButtons/ActionTitle')))
  app.component('ActionBtn', defineAsyncComponent(() => import('@/BubotCore/components/ActionButtons/ActionBtn')))
  app.component('ActionBtnMenu', defineAsyncComponent(() => import('./components/ActionButtons/ActionBtnMenu')))
}

