const { GoogleGenAI } = require("@google/genai");
// const { token, apiKey } = require("../config.json")

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

async function main(message, user, contextString) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `You are Garvit BOT in a Discord server. Analyze the current user query and classify their intent.

CLASSIFICATION RULES:
- If they want to start/begin studying, reply ONLY with: [START_STUDY]
- If they want to take a break, update a break time, or extend a break, reply ONLY with: [START_BREAK]
- If they are returning from a break or resuming study, reply ONLY with: [END_BREAK]
- If they want to wrap up, stop, or finish their study session, reply ONLY with: [END_SESSION]
- If it is just normal conversation, a greeting, or a question unrelated to controlling the session state, do NOT send a token. Instead, reply naturally and concisely as a supportive study buddy based on the current query.

CURRENT USER ${message.author.globalName} asks: ${message.content}
${contextString}`,
    });
    const data = response.text;
    console.log(data);
    return data;
  } catch (error) {
    console.log(`Gemini error ${error}`);
    return "Bot Ran into GEMINI API ERROR";
  }
}

async function main2(message, user) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `PROMPT: you are Garvit BOT in E-Library discord server, ${user} message you: ${message} reply in short unless it demands`,
    });

    return response.text;
  } catch (error) {
    console.log(`Gemini error ${error}`);
    return "Bot Ran into GEMINI API ERROR";
  }
}

module.exports = { main, main2 };
