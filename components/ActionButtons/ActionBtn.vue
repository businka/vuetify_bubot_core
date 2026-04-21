<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ActionBtn',
  mixins: [ActionMixin],
  props: {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    name: {
      type: String,
    },
    color: {
      type: String,
    },
    data: {
      type: Object,
    },
    icon: {
      type: String,
    },
    primary: {
      type: Boolean,
      default: false
    },
    variant: String,
    size: String,
    density: {
      type: String,
      default: 'compact'
    },
    rounded: String,
    elevation: String,
    prependIcon: String,
    appendIcon: String
  },
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <v-btn
      :variant="variant"
      :color="color"
      :density="density"
      :title="title"
      :rounded="rounded"
      :elevation="elevation"
      :size="size"
      :icon="icon"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :text="text"
      class="text-none font-weight-regular"
      @click.stop="emitAction(name, data)"
  />
</template>
