const { GoogleGenAI } =  require("@google/genai");
const { api } = require("./config.json")


const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({
    apiKey: apiKey
});

async function main(message, user) {
  try{
      const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `PROMPT: you are Garvit BOT in E-Library discord server, ${user} message you: ${message} reply in at max 500 words`,
    });

    return response.text;
  }
  catch(error){
    console.log(`Gemini error ${error}`);
      return "Bot Ran into an error";
  }
}

module.exports = { main }