import cadesAsync from './cadesAsync.store'
import cadesNpapi from './cadesNpapi.store'

export default {
  methods: {
    initCades() {
      if (Object.prototype.hasOwnProperty.call(this.$store.state, 'cades')) {
        const store = window.cadesplugin.CreateObjectAsync ? cadesAsync : cadesNpapi
        // alert(window.cadesplugin.CreateObjectAsync?'async':'npapi')
        this.$store.registerModule('cades', store)
      }
    }
  }
}
