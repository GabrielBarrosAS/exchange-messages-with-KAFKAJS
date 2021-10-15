## Desenvolvi esse sistema de troca de mensagens usando KAFKAJS enquanto estudava a ferramenta para uso futuro em atividades práticas de Sistemas Distribuídos.
#### PRODUTOR 1:
 - É uma API que recebe uma requisição em localhost:3333/produtor_1
 - Envia para a entidade INTERMEDIATOR uma mensagem da forma "MENSAGEM ${I}", onde o valor de I é o valor de um contador de mensagens
 - Cada requisição gera uma nova mensagem
 - PRODUTOR 1 escuta o tópico "for-produtor-1" que recebe confirmação de cada mensagem enviada
 #### INTERMEDIATOR:
 - Escuta dois tópicos: "produtor-1-for-intermediator" e "produtor-2-for-intermediator". Canais de recebimento de mensagem para cada produtor
 - Quando recebe uma nova mensagem em "produtor-1-for-intermediator", envia uma mensagem ao PRODUTOR 2
 - Quando recebe uma confirmação mensagem em "produtor-2-for-intermediator", envia uma mensagem ao PRODUTOR 1
 #### PRODUTOR 2:
 - É uma API que recebe uma requisição em localhost:3334/produtor_2
 - Confirma ao INTERMEDIATOR que recebeu uma mensagem "I", sempre que uma requisição é feita
 - As mensagens são confirmadas em ordem, devido aos contadores existentes no componente

![alt text](https://github.com/GabrielBarrosAS/exchange-messages-with-KAFKAJS/blob/main/Fluxo%20de%20trabalho%20KAFKAJS.jpg)
