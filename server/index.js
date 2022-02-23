const express = require('express')
const cors = require('cors')
const ip = require('ip')
const WebSocket = require('ws')


const { Kafka, logLevel } = require('kafkajs')

const port = 3001
const wssPort = 3002
const host = process.env.HOST_IP || ip.address()

const clients = {}

// WebSocket
// TODO use IPC with Electron App
// TODO Make async so we can await connetion result and don't need to check in kafka consumer
const wss = new WebSocket.Server({ port: wssPort })
wss.on('connection', (ws) => {
    console.log('websocket connected')

    ws.on('message', (data) => {
        //If receive msg, register websocket instance with the msg as the key
        console.log(`registering ${data} to websocket clients`)
        clients[data] = ws
    })
})

wss.on('close', () => {
    console.log('close')
})

wss.on('error', (e) => {
    console.log(e)
})

/* Routes not needed for current purpose
const app = express()

// Use JSON
app.use(express.json())
// Allow CORs
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello Jeff!')
})

app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
})*/

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: [`${host}:9092`],
    clientId: 'example-consumer',
})

const topic = 'topic-test2'
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: false })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            const mess = {
                'topic': topic,
                'key': message.key.toString(),
                'data': message.value.toString()
            }
            // send message
            // TODO send data without verifying key exists
            const wsx = Object.values(clients)
            if (wsx.length > 0) {
                wsx.forEach((v) => {
                    v.send(JSON.stringify(mess))
                })
            }
            else {
                console.log(`- ${prefix} ${message.key}#${message.value}`)
            }
        },
    })
}
// TODO Should run only after websocket connects, else should throw error
run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
    process.on(type, async e => {
        try {
            console.log(`process.on ${type}`)
            console.error(e)
            await consumer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})

signalTraps.forEach(type => {
    process.once(type, async () => {
        try {
            await consumer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})