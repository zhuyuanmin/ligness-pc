import { createStore } from 'vuex'

export default createStore({
  state () {
    return {
      activeKey: '1'
    }
  },
  mutations: {
    setActiveKey (state, payload) {
      state.activeKey = payload
    }
  },
  actions: {

  }
})
