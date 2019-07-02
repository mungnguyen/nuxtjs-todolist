const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const app = express()
const db = require('./models')
const api = require('./routes/api')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

api(app)
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express

  app.use(nuxt.render)

  // Listen the server
  db.sequelize.sync().then(function() {
    app.listen(3000, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })
}
start()
