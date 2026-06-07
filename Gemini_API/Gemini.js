const { GoogleGenAI } =  require("@google/genai");
//  const { token, apiKey } = require("../config.json")


const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({
    apiKey: apiKey
});

async function main(message, user, contextString) {
  try{
    const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `You are Garvit BOT in discord server BUT YOU CAN TALK BASED ON CURRENT USER QUERY, IF PAST 10 CONTEXTS ARE NOT RELEVANT GIVE OPINION BASED ON CURRENT QUERY. Reply in short unless it demands a longer explanation.\n
          CURRENT USER ${message.author.username}asks: ${message.content}\n ${contextString}`
    });
    const data = response.text;
    console.log(data);
    return data;
  }
  catch(error){
    console.log(`Gemini error ${error}`);
      return "Bot Ran into GEMINI API ERROR";
  }
}

async function main2(message, user) {
  try{
      const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `PROMPT: you are Garvit BOT in E-Library discord server, ${user} message you: ${message} reply in short unless it demands`,
    });

    return response.text;
  }
  catch(error){
    console.log(`Gemini error ${error}`);
      return "Bot Ran into GEMINI API ERROR";
  }
}



module.exports = { main, main2}
