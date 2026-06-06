const { REST, Routes , SlashCommandBuilder} = require('discord.js');
const {token} = require("./config.json")
const {main} = require("./Gemini")
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
            Routes.applicationCommands('1512666816500203610'),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

  async function talk(interaction){
    if (!interaction.isChatInputCommand()) return;
   
    if(interaction.commandName === 'garvit'){
         await interaction.deferReply();
        try{
        const userInput = interaction.options.getString('input');
          const reply = await main(userInput, interaction.user.username)
          await interaction.editReply(`${reply}`)
        }
        catch(error){
            console.log("talk function error")
            await interaction.editReply(`I ran into an error`);
        }
    }
  }
  module.exports = {talk};
