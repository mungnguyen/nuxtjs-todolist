import axios from 'axios'

// init state
const state = () => ({
  list: [],
  todo: '',
  id: ''
})

// getter
const getters = {}

const mutations = {
  getAllTodo(state, list) {
    state.list = list
  },

  setTodo(state, todo) {
    state.todo = todo
  },

  addTodo(state, todo) {
    state.list.push(todo)
  },

  setId(state, id) {
    state.id = id
  }
}

const actions = {
  //   async nuxtServerInit({ dispatch }) {
  //     await dispatch('core/load')
  //   },
  getAllTodo({ commit }) {
    axios.get('/api/getAllTodo').then(res => {
      commit('getAllTodo', res.data)
    })
  },

  getTodoById({ commit }, id) {
    axios.get('/api/getTodoById/' + id).then(res => {
      commit('setTodo', res.data)
    })
  },

  addTodo({ dispatch }, todo) {
    axios.post('/api/addTodo', todo).then(res => {
      dispatch('getAllTodo')
    })
  },

  updateTodo({ dispatch }, todo) {
    axios.put('/api/updateTodo/' + todo.id, todo).then(() => {
      dispatch('getAllTodo')
      dispatch('getTodoById', todo.id)
    })
  },

  deleteTodo({ dispatch }, id) {
    axios.delete('/api/deleteTodo/' + id).then(dispatch('getAllTodo'))
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
