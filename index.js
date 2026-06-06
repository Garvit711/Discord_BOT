
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
// const { token } = require('./config.json');
const {main} = require("./Gemini")
const {talk} = require("./command")


const token = process.env.TOKEN || require('./configure/config.json').token;
const apiKey = process.env.API_KEY || require('./configure/config.json').apiKey;

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

const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running alive!\n');
}).listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
});
