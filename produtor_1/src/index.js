const express = require('express')
const routes = require('./routes')
const { Kafka, logLevel  } = require('kafkajs')

var contador = 0 //INDICA QUANTAS MENSAGENS FORAM ENVIADAS
const app = express()

// CONECTANDO AO KAFKA QUE ESTÁ RODANDO DE FORMA VIRTUAL (DOCKER-COMPOSE UP)
const kafka = new Kafka({
    clientId: 'produtor-1-client',
    brokers: ['kafka:9092'],
    logLevel: logLevel.NOTHING
})
// CONECTANDO AO KAFKA QUE ESTÁ RODANDO DE FORMA VIRTUAL (DOCKER-COMPOSE UP)

// INSTANCIÂNDO UM PRODUTOR E UM CONSUMIDOR KAFKA PARA O SERVIÇO "PRODUTOR 1"
const consumer = kafka.consumer({ groupId: 'produtor-1' })
const producer = kafka.producer({
    allowAutoTopicCreation: true,
    idempotent: true,
    retry: {
        initialRetryTime: 1000,
        retries: 8
    }
})
// INSTANCIÂNDO UM PRODUTOR E UM CONSUMIDOR KAFKA PARA O SERVIÇO "PRODUTOR 1"

// MIDDLEWARE QUE É EXECUTADO SEMPRE QUE OCORRE UMA REQUISIÇÃO NA ROTA RAIZ
app.use((req,res,next)=>{
    contador+=1
    req.producer = producer
    req.contador = contador
    return next()
})
// MIDDLEWARE QUE É EXECUTADO SEMPRE QUE OCORRE UMA REQUISIÇÃO NA ROTA RAIZ

app.use(routes)

//FUNÇÃO QUE CONECTA AS INTÂNCIAS DE PRODUTOR E CONSUMIDOR AO KAFKA
async function run(){

    await producer.connect()
    await consumer.connect()

    await consumer.subscribe({topic: 'for-produtor-1',fromBeginning: true})

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic == 'for-produtor-1'){
                console.log("RECEBI DO INTERMEDIADOR")
                console.log(`${message.value}`)
            }
        },
    })

    app.listen(3333,() =>{
        console.log("PRODUTOR 1 INICIADO !!!")
    })
}

run().catch(console.error)