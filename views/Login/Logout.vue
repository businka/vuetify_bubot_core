<template>
  <div></div>
</template>
<script>
export default {
  name: 'Logout',
  mounted() {
    this.$store.dispatch('User/logout', this.cert)
    this.$router.push({ path: '/' })
  }
}
</script>