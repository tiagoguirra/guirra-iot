const path = require('path')
const express = require('express')
const app = express()
const compression = require('compression')

const port = process.env.APP_PORT || 4001

app.use(compression())

app.use(express.static(path.resolve(__dirname, 'dist'), { maxAge: '31557600' }))
app.get('*', async function(req, res) {
  return res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.listen(port, function() {
  console.log('Aplicação rodando na porta ' + port)
})
