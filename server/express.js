const express = require('express')
const cors = require('cors')

const app = express()

// Use JSON
app.use(express.json())
// Allow CORs
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello Jeff!')
})


module.exports = app