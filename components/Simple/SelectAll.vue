<template>
  <div class="d-inline-flex">
    <v-checkbox
      :value="marked"
      small
      class="selectAll"
      @click="onClick"
    />
    <v-menu>
      <template v-slot:activator="{ on }">
        <span
          class="clickable"
          v-on="on"
        >{{ label }}</span>
      </template>
      <v-list>
        <v-list-item
          @click="emitMarkAll"
        >
          <v-list-item-content>{{ $t('MarkAll') }}</v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="emitMarkRemove"
        >
          <v-list-item-content>{{ $t('MarkRemove') }}</v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="emitMarkInvert"
        >
          <v-list-item-content>{{ $t('MarkInvert') }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import ActionMixin from '@/helpers/mixinTemplate/action'

export default {
  name: "SelectAll",
  mixins: [ActionMixin],
  props: {
    all: {
      type: Number,
      default: 0
    },
    selected: {
      type: Number,
      default: 1
    }
  },
  data: () => ({}),
  computed: {
    marked: function() {
      if (this.selected > 0) {
        return true
      } else {
        return false
      }
    },
    label: function() {
      if (this.selected > 0) {
        if (this.selected === this.all) {
          return this.$t('Marked all')
        } else {
          return this.$t('Marked') + ` (${this.selected})`
        }
      } else {
        return this.$t('Mark')
      }
    }
  },
  methods: {
    onClick() {
      if (this.marked) {
        this.emitMarkRemove()
      } else {
        this.emitMarkAll()
      }
    },
    emitMarkAll() {
      this.$emit('action', {name:'MarkAll'})
    },
    emitMarkRemove() {
      this.$emit('action', {name:'MarkRemove'})
    },
    emitMarkInvert() {
      this.$emit('action', {name:'MarkInvert'})
    }
  },

// components: { DataGrid, SearchForm, FilterButton },
// mount: {}
}
</script>

<style>
  .selectAll {
    vertical-align: middle;
  }

  .clickable:hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
