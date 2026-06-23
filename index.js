
const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
} = require("discord.js");
// const { token , apiKey, MONGODB_URI } = require('./config.json');
const { main, main2 } = require("./Gemini_API/Gemini");
const { talk } = require("./Controllers/commandTalk");
const { normalChats } = require("./Controllers/normalChat");
const { commandBuild } = require("./CommandBuilder/commandBuild.js");
const { MongoDB } = require("./Models/connect.js");

const {
  handleStart,
  handleBreak,
  handleBreakOver,
  handleEnd,
} = require("./Controllers/handlers.js");
const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // console.log(message);
  console.log(`${message.author.globalName}/${message.author.username} asked: ${message}`);
  const msgLower = message.content.toLowerCase();
  const keyWord = "garvit";
  if (msgLower.includes(keyWord) || message.mentions.has(client.user.id)) {
    await normalChats(message);
  }
});

client.on("interactionCreate", async (interaction) => {
  await talk(interaction);
});

client.login(token);

const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

MongoDB(MONGODB_URI);

app.get("/", (req, res) => {
  res.status(200).send("OK");
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
