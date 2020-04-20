import cadesAsync from './cadesAsync.store'
import cadesNpapi from './cadesNpapi.store'

export default {
  methods: {
    initCades() {
      if (!this.$store.state.hasOwnProperty('cades')) {
        const store = window.cadesplugin.CreateObjectAsync ? cadesAsync : cadesNpapi
        // alert(window.cadesplugin.CreateObjectAsync?'async':'npapi')
        this.$store.registerModule('cades', store)
      }
    }
  }
}
