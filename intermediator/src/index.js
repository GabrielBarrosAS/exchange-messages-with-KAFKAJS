const { Kafka, logLevel  } = require('kafkajs')

// Conectando ao kafka que está rodando na máquina
const kafka = new Kafka({
    clientId: 'intermediator-client',
    brokers: ['kafka:9092'],
    logLevel: logLevel.NOTHING
})

const consumer = kafka.consumer({ groupId: 'intermediators' })
const producer = kafka.producer({
    allowAutoTopicCreation: true,
    idempotent: true,
    retry: {
        initialRetryTime: 1000,
        retries: 8
    }
})

async function run(){

    console.log("INTERMEDIATOR ONLINE")
    await producer.connect()
    await consumer.connect()

    await consumer.subscribe({topic: 'produtor-1-for-intermediator',fromBeginning: true})
    await consumer.subscribe({topic: 'produtor-2-for-intermediator',fromBeginning: true})

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            if (topic == 'produtor-1-for-intermediator'){
                console.log("RECEBI DO PRODUTOR 1")
                console.log(`${message.value}`)

                console.log("VOU INFORMAR AO PRODUTOR 2")
                
                try {
                    const message_recive =  `Produtor 1 enviou uma nova mensagem (${message.value})`

                    await producer.send({
                        topic: 'for-produtor-2',
                        messages: [
                            { value: message_recive}
                        ],
                        acks: -1,
                    })

                } catch(err){
                    console.log(err)
                }
            }else if(topic == 'produtor-2-for-intermediator'){
                console.log("RECEBI DO PRODUTOR 2")
                console.log(`${message.value}`)
                console.log("VOU INFORMAR A  CONFIRMAÇÃO AO PRODUTOR 1")

                try {
                    const message_recive =  message.value

                    await producer.send({
                        topic: 'for-produtor-1',
                        messages: [
                            { value: message_recive}
                        ],
                        acks: -1,
                    })

                } catch(err){
                    console.log(err)
                }

            }
        },
    })
}

run().catch(console.error)

