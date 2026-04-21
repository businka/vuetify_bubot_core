export default {
    props: {
        height: {
            type: String,
            default: '100%'
        },
        hideOperationsPanel: {
            type: Boolean,
            default: false
        },
        alwaysShowOperationsPanel: {
            type: Boolean,
            default: false
        },
        operationsPanelItems: {
            type: Array,
            default: () => []
        },
        rowActions: {
            type: Array,
            default: () => []
        },
        rowActionsField: {
            type: String,
            default: 'rowViewer'
        },
        rowActivateHandler: {
            type: Object,
            default: () => ({name: ''})
        },
        externalRowActivateHandler: {
            type: Function
        },
        toolbar: {
            type: Array,
            default: () => []
        },
        filterFields: {
            type: Array,
            default: () => []
        },
        filterConst: {
            type: Object,
            default: () => ({})
        },
        hideSelectAll: {
            type: Boolean,
            default: false
        },
        hideToolbar: {
            type: Boolean,
            default: false
        },
        showColumnHeaders: {
            type: Boolean,
            default: false
        },
        rowTemplate: {
            type: String,
            default: 'rowViewer'
        },
        dataSource: {
            type: Object,
            default: () => ({})
        },
        columns: {
            type: Array,
            default: () => []
        },
        active: {
            type: Object,
        },
        selected: {
            type: Array,
            default: () => []
        },
        autoActivate: {
            type: Object,
            default: () => ({})
        },
    },
}