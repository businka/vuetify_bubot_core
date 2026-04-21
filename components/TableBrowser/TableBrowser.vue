<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from './resources/BrowserActionMixin'
import DefaultProperties from "./resources/DefaultProperties";
import ExtException from '../Simple/ExtExceptionSnackbar'
import BrowserToolBar from './resources/ToolBar'
import OperationsPanel from './resources/OperationsPanel'
import RowViewer from './resources/Cells/RowViewer'
import RowEditor from './resources/Cells/RowEditor'
import TableBrowserTemplate from './resources/TableBrowserTemplate'
import {isEmptyObject} from "bubot-helper/BaseHelper";
import {findInArrayObj, findIndexInArrayObj} from "bubot-helper/ArrayHelper";

export default {
  name: 'TableBrowser',
  components: {
    ExtException,
    BrowserToolBar,
    OperationsPanel,
    RowViewer,
    RowEditor
  },
  mixins: [DefaultProperties, ActionMixin, BrowserActionMixin, TableBrowserTemplate],
  emits: ['update:selected', 'update:active'],
  data() {
    return {
      dataTableHeight: 0,
    }
  },

  computed: {
    actionColumn() {
      return this.rowActions || this.rowActionsField ? 1 : 0
    }
  },



  methods: {
    updateDataTableHeight() {
      this.dataTableHeight = this.$refs.parentDiv?.clientHeight || 0;
    }
  }
}
</script>