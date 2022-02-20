const express = require('express')
const cors = require('cors')
const ip = require('ip')
import { WebSocketServer } from 'ws'

const { Kafka, logLevel } = require('kafkajs')

const port = 3001
const wssPort = 3002
const host = process.env.HOST_IP || ip.address()

// WebSocket
// TODO use IPC with Electron App
wss = new WebSocketServer({ port: port })

wss.on('connection', (ws) => {
    console.log('websocket connected')

    ws.on('message', (data) => {
        console.log(`received ${data}`)
    })
    ws.send('test message sending to client')
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

const run = async (ws) => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
            ws.send(message.value)
        },
    })
}

run(wss).catch(e => console.error(`[example/consumer] ${e.message}`, e))

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