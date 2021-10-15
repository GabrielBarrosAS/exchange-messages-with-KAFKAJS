const express = require('express')
const routes = require('./routes')
const { Kafka, logLevel  } = require('kafkajs')

const app = express()
var cont_recive = 0
var cont_reply = 0

const kafka = new Kafka({
    clientId: 'produtor-2-client',
    brokers: ['kafka:9092'],
    logLevel: logLevel.NOTHING
})

const consumer = kafka.consumer({ groupId: 'produtor-2' })
const producer = kafka.producer({
    allowAutoTopicCreation: true,
    idempotent: true,
    retry: {
        initialRetryTime: 1000,
        retries: 8
    }
})

app.use((req,res,next)=>{

    req.producer = producer
    req.cont_recive = cont_recive
    req.cont_reply = cont_reply

    if(cont_reply < cont_recive){    
        cont_reply +=1
    }
    
    return next()
})

app.use(routes)

async function run(){

    await producer.connect()
    await consumer.connect()

    await consumer.subscribe({topic: 'for-produtor-2',fromBeginning: true})

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic == 'for-produtor-2'){
                console.log("RECEBI DO INTERMEDIADOR")
                console.log(`${message.value}`)
                cont_recive += 1
            }
        },
    })

    app.listen(3334,() =>{
        console.log("PRODUTOR 2 INICIADO !!!")
    })
}

run().catch(console.error)