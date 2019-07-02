import Vuex from 'vuex'
import Vue from 'vue'
import todoModule from './module/todoModule'

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    modules: {
      todoModule
    }
  })
}

export default store
