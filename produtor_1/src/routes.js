const express = require('express')

const routes = express.Router()

routes.post("/produtor_1", async (req,res) =>{
    try {

        const message =  `Mensagem ${req.contador}`

        await req.producer.send({
            topic: 'produtor-1-for-intermediator',
            messages: [
                { value: message }
                //{ key: 'key2', value: 'hey hey!' }
            ],
            acks: -1,
        })

        return res.json({ ok:true })
    } catch(err){
        console.log(err)
        return res.json({ error: "Falha ao enviar mensagem do produtor 1"})
    }
})

module.exports = routes