export default {
  methods: {
   onConnect: function() {
      console.log(`connect. refs: ${Object.keys(this.$refs).length}`)
      for (let ref in this.$refs) {
        if (Object.prototype.hasOwnProperty.call(this.$refs, ref)) {
          let item = this.$refs[ref]
          let ocf = item.getAttribute('ocf')
          let uri = item.getAttribute('uri')
          if (ocf && uri) {
            this.$socket.sendObj({
              handler: 'Resource',
              method: 'observe',
              param: [uri]
            })
          }
        }
      }
    },
    initWebSocket: function() {
      this.$socket.onopen = () => {
        this.onConnect()
      }
      this.$socket.reconnect = () => {
        this.onConnect()
      }
      this.$socket.onmessage = (data) => {
        data = JSON.parse(data.data)
        let uri = `ocf://${data.to.di}${data.to.href}`
        if (Object.prototype.hasOwnProperty.call(this.$refs, uri)) {
          let elem = this.$refs[uri]
          let ocf = elem.getAttribute('ocf')
          switch (ocf) {
            case 'oic.r.switch.binary':
              if (data.cn.value) {
                elem.setAttribute('value', '1')
                this.$refs[uri].firstChild.style.fill = 'yellow'
              } else {
                elem.setAttribute('value', '0')
                this.$refs[uri].firstChild.style.fill = 'white'
              }
              break
          }
        }
      }
    }
  },
  mounted() {
    this.initWebSocket()
    if (this.$socket.readyState) {
      this.onConnect()
    }
  }
}
