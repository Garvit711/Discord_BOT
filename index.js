
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
// const { token } = require('./config.json');
const {main} = require("./Gemini")
const {talk} = require("./command")


const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// client.on('messageCreate', async (message)=>{
//     if(message.author.bot) return;
//     let reply = await main(message.content)
//     message.reply({
//         content: `${reply}`
//     })
// })

  client.on('interactionCreate', async(interaction) =>{
      await talk(interaction);
  })

client.login(token);

const express = require('express')
const PORT = process.env.PORT || 3000;
const app = express()
app.get('/', (req, res)=>{
  res.status(200).send('OK');
})
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



