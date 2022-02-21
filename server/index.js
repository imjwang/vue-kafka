const express = require('express')
const cors = require('cors')
const ip = require('ip')
const WebSocket = require('ws')


const { Kafka, logLevel } = require('kafkajs')

const port = 3001
const wssPort = 3002
const host = process.env.HOST_IP || ip.address()

const sub = {}

// WebSocket
// TODO use IPC with Electron App
const wss = new WebSocket.Server({ port: wssPort })
wss.on('connection', (ws) => {
    console.log('websocket connected')
    sub['key'] = ws

    ws.on('message', (data) => {
        console.log(`received ${data}`)
        //it's receiving a ping from frontend
        //ws.send(data.value)
        //ws.send(JSON.stringify(data))
    })
})

wss.on('close', () => {
    console.log('close')
})

wss.on('error', (e) => {
    console.log(e)
})

// Handle Message



/*
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

const topic = 'topic-test'
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
            'key' in sub ? sub['key'].send(JSON.stringify(message.key)) : console.log(`- ${prefix} ${message.key}#${message.value}`)
        },
    })
}

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