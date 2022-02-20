const app = require('./express.js')
//const ws = require('./ws.controller')

const port = 3002

app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
})