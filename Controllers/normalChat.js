//  const { token, apiKey } = require("../config.json")
const { main, main2 } = require("../Gemini_API/Gemini");
const {
  handleStart,
  handleBreak,
  handleBreakOver,
  handleEnd,
} = require("./handlers");

async function normalChats(message) {
  if (!message || !message.content) return;
  try {
    const fetchedMessages = await message.channel.messages.fetch({ limit: 11 });
    const context = [...fetchedMessages.values()].reverse();
    let contextString = "Server Last 10 Messages Start From here: ";
    for (let i = 0; i < context.length - 1; i++) {
      contextString += `Chat ${i + 1}. ${context[i].author.username} says "${context[i].content}"\n `;
    }
    contextString += `Ends Here`;
    //  console.log(contextString)
    const response = await main(
      message,
      message.author.username,
      contextString,
    );
    if (response === "[START_STUDY]") {
      await handleStart(message);
    } else if (response === "[START_BREAK]") {
      await handleBreak(message);
    } else if (response === "[END_BREAK]") {
      await handleBreakOver(message);
    } else if (response === "[END_SESSION]") {
      await handleEnd(message);
    } else {
      message.reply(response);
    }
  } catch (error) {
    console.log(`Normal Chats error : ${error}`);
    await message.reply(`Encountered an error`);
  }
}

module.exports = { normalChats };
