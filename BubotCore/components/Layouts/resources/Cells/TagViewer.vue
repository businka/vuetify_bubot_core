<script>
export default {
  name: 'TagViewer',
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
  }
}
</script>

<style scoped>

</style>


<template>
  <v-chip-group>
    <v-chip
      v-for="tag in value"
      :key="tag.id"
      show-arrows
      x-small
      :color="tag.color"
      :ripple="false"
    >
      {{tag.title}}
    </v-chip>
  </v-chip-group>
</template>
