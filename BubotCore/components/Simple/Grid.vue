<template>
  <q-table
    v-if="form.columns"
    :title="form.title"
    :data="form.rows"
    :columns="form.columns"
    row-key="id"
  >
    <template v-slot:body="props">
      <q-tr
        :props="props"
        @click.native.stop="action(name, 'onClick', props.row)"
      >
        <q-td
          v-for="col in props.cols"
          :key="col.field"
        >
          {{ props.row[col.field] }}
        </q-td>
        <q-menu
          context-menu
          anchor="top right"
        >
          {{ props.row.id }}
        </q-menu>
      </q-tr>
    </template>
  </q-table>
</template>

<style>
</style>

<script>
import DataSourceMixin from '../../helpers/mixinTemplate/form'

// import { defaultSource } from '../datasource/DataSource.vue'

export default {
  mixins: [DataSourceMixin],
  // props: {
  //   source: {
  //     type: Object,
  //     default: defaultSource()
  //   }
  // },
  methods: {
    onRowClick (event) {
      console.log(event)
    },
    action (componentName, actionName, actionParam) {
      if (this.$refs[componentName]) {
        this.$refs[componentName][actionName](actionParam)
      } else {
        this.$emit('action', componentName, actionName, actionParam)
      }
    }
  }
}
</script>
