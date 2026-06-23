//  const { token, apiKey } = require("../config.json")
const { main, main2 } = require("../Gemini_API/Gemini");
const { StudySession, userModes } = require("../Models/connect");
const {
  handleStart,
  handleBreak,
  handleBreakOver,
  handleEnd,
  handleSessionTime
} = require("./handlers");
const { modeSwitch } = require("./modes");
const { setReminder, changeReminder } = require("./reminders");

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
    const userId = message.author.id;
    const guildId = message.guildId;
    const channelId = message.channelId;

    const user = await userModes.findOneAndUpdate(
    { userId, guildId, channelId }, 
    { $setOnInsert: { mode: 1 }},
    { upsert: true, returnDocument: 'after'}    
   );
    //  console.log(contextString)
    const currentMode = user.mode;
    const response = await main(
      message,
      message.author.username,
      contextString,
      currentMode,
    );
    if (response === "[START_STUDY]") {
      await handleStart(message);
    } else if (response.includes("START_BREAK")) {
      await handleBreak(message, response);
    } else if (response === "[END_BREAK]") {
      await handleBreakOver(message);
    } else if (response === "[END_SESSION]") {
      await handleEnd(message);
    } else if(response === "[STUDY_TIME]"){
       await handleSessionTime(message);
    }
    else if(response.includes("SET_REMINDER")){
       await setReminder(message, response)
    }
    else if(response.includes("CHANGE_REMINDER") ){
       await changeReminder(message, response)
    }
    else if(response.includes("CHANGE_MODE")){
        const match = response.match(/\d+/);
        const reqMode = match ? parseInt(match[0]) : 2;
        await modeSwitch(user, reqMode, message);
    }
    else {
      message.reply(response);
    }
  } catch (error) {
    console.log(`Normal Chats error : ${error}`);
    await message.reply(`Network Connection Error`);
  }
}

module.exports = { normalChats };
