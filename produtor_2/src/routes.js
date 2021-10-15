const express = require('express')

const routes = express.Router()

routes.post("/produtor_2", async (req,res) =>{
    try {

        if(req.cont_reply + 1 <= req.cont_recive){

            const message =  `CONFIRMANDO A MENSAGEM ${req.cont_reply+1}`

            await req.producer.send({
                topic: 'produtor-2-for-intermediator',
                messages: [
                    { value: message }
                ],
                acks: -1,
            })
            return res.json({ ok:true })
        }else{
            console.log("TODAS AS MENSAGENS JÁ FORAM CONFIRMADAS")
            return res.json({ ok:"TODAS AS MENSAGENS FORAM CONFIRMADAS" })
        }
    } catch(err){
        console.log(err)
        return res.json({ error: "Falha ao enviar mensagem do produtor 2"})
    }
})

module.exports = routes