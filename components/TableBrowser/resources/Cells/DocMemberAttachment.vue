<template>
  <div>
    <div class="row text-body2 text-primary text-bold">
      {{member.member_title}}
    </div>
    <div class="row text-caption text-secondary"
         v-for="item in props.row.attachment"
         :key="item.id"
    >
      {{item.file_title}}
    </div>
  </div>
</template>
<script>
export default {
  props: ['col', 'props', 'data'],
  computed: {
    member: function () {
      let i
      for (i = 0; i < this.props.row.members.length; ++i) {
        if (this.props.row.members[i].role === this.col.role) {
          return this.props.row.members[i]
        }
      }
      return ''
    }
  }
}
</script>
