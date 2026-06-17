const { REST, Routes , SlashCommandBuilder} = require('discord.js');
// const {token} = require("./config.json")
// const { token, apiKey, CLIENTID } = require("../config.json")
const {main, main2} = require("../Gemini_API/Gemini")

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;
const CLIENTID = process.env.CLIENTID;

const command = new SlashCommandBuilder()
  .setName("garvit")
  .setDescription("talk to garvit bot")
  .addStringOption((option)=>
    option.setName('input').setDescription("Write your message").setRequired(true)
  )
  const commands = [command.toJSON()];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENTID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();