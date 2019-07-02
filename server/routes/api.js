module.exports = function(app) {
  const ToDo = require('../controller/todoController')

  app.get('/api/getAllTodo', ToDo.getAllTodo)
  app.get('/api/getTodoById/:id', ToDo.getTodoById)
  app.post('/api/addTodo', ToDo.addTodo)
  app.put('/api/updateTodo/:id', ToDo.updateTodo)
  app.delete('/api/deleteTodo/:id', ToDo.deleteTodo)
}
