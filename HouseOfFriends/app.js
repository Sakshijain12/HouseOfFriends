const express = require('express')

const app = express()

app.use(express.json())

//Route Imports
const login = require("./routes/loginRoute")

app.use("/api/v1",login)

module.exports = app