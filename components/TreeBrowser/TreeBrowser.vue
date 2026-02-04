<script>
import {defineComponent, inject} from 'vue'
import Service from "../DataSource/Service"
import { updateObject } from "bubot-helper/BaseHelper"

export default defineComponent({
  name: 'TreeBrowser',

  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    active: {
      type: Object,
    }
  },

  emits: ['update:modelValue', 'update:active'],

  data() {
    return {
      editRow: null,
      massOperationVisible: false,
      items: [],
      source: null,
      options: {},
      needUpdate: false
    }
  },

  computed: {
    internalSelected: {
      get() {
        return this.modelValue || []
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
    internalActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit('update:active', val)
      }
    }
  },

  beforeMount() {
    this.init()
  },

  watch: {
    dataSource: function () {
      this.init()
      this.needUpdate = true
    }
  },

  methods: {
    init() {
      this.items = []
      this.options = {}

      const dataSource = updateObject(
          {appName: inject('appName')},
          {filterConst: {}},
          this.dataSource,
          this.options
      )

      this.source = new Service(dataSource, this.$store)
      this.fetch(null)
      this.internalActive = [{"_id": "1C"}]
    },
    async fetch(item) {
      let filter = {}
      let result

      if (item) {
        filter['ParentId'] = item._id
        result = item.children
      } else {
        result = this.items
      }

      const res = await this.source.list(filter)

      for (let index = 0; index < res['Rows'].length; index++) {
        let row = res['Rows'][index]
        if (row['IsFolder']) {
          row.children = []
        }
        result.push(row)
      }
    },

    // actionMassOperationsBarVisible(action) {
    //   this.$store.commit(`${this.store.namespace}/massOperationsBarVisible`, {
    //     uid: this.store.uid,
    //     value: action
    //   })
    // },

    // getSelected() {
    //   return this.$refs[this.store.uid].selection
    // },

    // async actionMassDelete() {
    //   const selected = this.getSelected()
    //   for (let elem in selected) {
    //     if (Object.prototype.hasOwnProperty.call(selected, elem)) {
    //       await this.$store.dispatch(`${this.namespace}/delete`, {
    //         store: this.store,
    //         params: this.params,
    //         data: elem
    //       }, {root: true})
    //     }
    //   }
    // },

    // async actionCreate(data) {
    //   await this.$store.dispatch(`${this.namespace}/create`, {
    //     store: this.store,
    //     params: this.params,
    //     data
    //   }, {root: true})
    // },

    // async actionUpdateRow(data) {
    //   console.log('update row ' + data.index)
    //   this.editRow = null
    //   await this.$store.dispatch(`${this.namespace}/updateRow`, {
    //     store: this.store,
    //     params: this.params,
    //     data: data
    //   }, {root: true})
    // }
  }
})
</script>

<template>
  <div class="fill-height d-flex flex-column">
<!--    <div class="toolbar mb-2">-->
<!--      1234-->
<!--      &lt;!&ndash; Тулбар здесь &ndash;&gt;-->
<!--    </div>-->
      <v-treeview
          v-model:active="internalActive"
          v-model:selected="internalSelected"
          :items="items"
          density="compact"
          :return-object="true"
          :selectable="massOperationVisible"
          :load-children="fetch"
          item-title="Title"
          item-value="_id"
          :open-on-click="false"
          class="fill-height pt-0"
      >
        <template #prepend="{ item, open }">
          <v-icon
              v-if="item.children !== undefined"
              :icon="open ? 'mdi-folder-open' : 'mdi-folder'"
              size="small"
              class="mr-2"
          />
        </template>
      </v-treeview>
  </div>
</template>

<style lang="scss">
.v-toolbar__content {
  padding-left: 0;
}

.jay-space-right {
  margin-right: 8px;
}

.bordered {
  border-bottom: 1px solid var(--v-delimiter-base);
}
</style>