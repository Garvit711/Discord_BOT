
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { token } = require('./config.json');
const {main} = require("./Gemini")
const {talk} = require("./command")

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