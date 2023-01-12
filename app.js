const express = require('express')
const app = express()
const port = 8080
var eta = require("eta")

app.engine("eta", eta.renderFile)

app.set("view engine", "eta")

app.set("views", "./views")

app.get("/", function (req, res) {
  res.render("template", {
    favorite: "Eta"
  })
})

// app.use('/', express.static('static'))


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})