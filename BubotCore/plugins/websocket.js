import VueNativeSock from 'vue-native-websocket'
import Vue from 'vue'
import AppConst from '../../AppConst'
// import store from '../../store'

Vue.use(VueNativeSock, `ws://${window.location.host}/${AppConst.appName}/ws`, {
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  // reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
  // store: store,
  format: 'json'
})


// export function sendRequestMutationCallBack(message, callback) {}
