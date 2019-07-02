const db = require('../models')

const getAllTodo = (req, res) => {
  db.ToDo.findAll().then(result => {
    res.json(result)
  })
}

const getTodoById = (req, res) => {
  db.ToDo.findAll({
    where: {
      id: req.params.id
    }
  }).then(result => {
    res.json(result)
  })
}

const addTodo = (req, res) => {
  db.ToDo.create({
    title: req.body.title,
    body: req.body.body,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }).then(result => res.json(result))
}

const updateTodo = (req, res) => {
  db.ToDo.update(
    {
      title: req.body.title,
      body: req.body.body,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      doneDate: req.body.doneDate,
      tick: req.body.tick
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(result => {
    res.json(result)
  })
}

const deleteTodo = (req, res) => {
  db.ToDo.destroy({
    where: {
      id: req.params.id
    }
  }).then(result => {
    res.json(result)
  })
}

const Todo = {}

Todo.addTodo = addTodo
Todo.updateTodo = updateTodo
Todo.deleteTodo = deleteTodo
Todo.getAllTodo = getAllTodo
Todo.getTodoById = getTodoById

module.exports = Todo
