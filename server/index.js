const express = require('express')

const app = express()

const port = 3002

app.get('/', (req, res) => {
    res.send('Hello Jeff!')
})

app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
})