// const { token, apiKey } = require("../config.json")
const { main, main2 } = require("../Gemini_API/Gemini");

async function talk(interaction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "garvit") {
    await interaction.deferReply();
    try {
      const userInput = interaction.options.getString("input");
      let reply = await main2(userInput, interaction.user.username || "user");
      await interaction.editReply(`${reply}`);
    } catch (error) {
      console.log(`talk error ${error}`);
      await interaction.editReply(`Network connection Issue`);
    }
  }
}

module.exports = { talk };
