# Garvit Bot — Conversational AI & Study Tracker

A context-aware, highly interactive Discord bot powered by Google Gemini APIs and backed by MongoDB Atlas. It bridges the gap between structured utilities and natural human conversation, allowing users to execute tasks via slash commands or simply by chatting naturally in the server.

---

## 📸 Interface Preview

<img width="1299" height="987" alt="Screenshot 2026-06-08 155217" src="https://github.com/user-attachments/assets/3776a8ca-d77c-4ee9-b6f3-5197a785dbef" />



---

## 🚀 Key Features & Multi-Mode Interaction

The bot natively handles two styles of interaction depending on how your server members prefer to work.

### 1. Seamless Conversational Mode ("Garvit" Mentions) ✨

* **The Ultimate Perk:** Users don't need to remember rigid command syntaxes. Mentioning **"Garvit"** or explicitly tagging the bot triggers the conversational engine.
* **Deep Context Comprehension:** The bot dynamically processes the **last 10 messages** in the channel before responding. It understands ongoing conversations, remembers context, and follows up naturally using **Gemini 3.1 Flash Lite**.
* **Intelligent Intent Routing:** Instead of relying on fragile regex or keyword matching, Gemini acts as a dynamic routing layer. It analyzes natural language and converts user intent into backend operational triggers such as:

```text
[START_STUDY]
[START_BREAK]
[END_STUDY]
```

allowing the study tracker to operate seamlessly through free-form conversation.

---

### 2. Structured Interaction Mode (Slash Commands `/`)

* Powered by **Gemini 2.5 Flash** for fast and efficient execution.
* Managed through Discord's `interactionCreate` event.
* Provides a reliable command-based workflow for users who prefer direct utility commands.

---

## 📝 Automated Study Tracker Module

A persistent productivity tracker powered by **MongoDB Atlas** and tightly integrated with the conversational engine.

### Features

* **Frictionless Sessions**

  * Start, track, and complete study sessions through natural chat messages.
  * Backend session validation prevents overlapping study sessions.

* **Smart Dynamic Breaks**

  * Request timed breaks naturally:

    > "Garvit, create a break for me and notify me in 3 minutes."

  * The bot schedules an asynchronous reminder and pings the user exactly when the break ends.

* **Witty & Gamified Feedback**

  * Custom contextual responses keep users engaged.
  * Includes playful roast messages when users attempt actions that don't make sense.

Example:

> "You never started a study session. Stop imagining the victory edit 💀🔥"

---

## 🛠️ Tech Stack

### Badges

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square\&logo=nodedotjs\&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=flat-square\&logo=discord\&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square\&logo=googlegemini\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Database-47A248?style=flat-square\&logo=mongodb\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Framework-000000?style=flat-square\&logo=express\&logoColor=white)

### Stack Overview

| Component       | Technology                                                   |
| --------------- | ------------------------------------------------------------ |
| Runtime         | Node.js                                                      |
| AI Integration  | Google Gemini API (Gemini 3.1 Flash Lite & Gemini 2.5 Flash) |
| Database        | MongoDB Atlas (Mongoose ODM)                                 |
| Web Framework   | Express.js                                                   |
| Discord Library | Discord.js v14                                               |


## 📂 Project Architecture

```text
├── CommandBuilder/
│   └── commandBuild.js          # Dynamic slash command registration

├── Controllers/
│   ├── normalChat.js            # Context scraper & conversational router
│   ├── handlers.js              # Study Tracker business logic
│   └── commandTalk.js           # Slash command execution pipeline

├── Gemini_API/                  # Gemini API initialization & wrappers

├── Models/                      # MongoDB schemas & DB connection layer

├── index.js                     # Express server + Discord event gateway

└── package.json                 # Project manifest
```

---

## ⚙️ Setup & Local Installation

### Prerequisites

* Node.js (v18 or higher)
* MongoDB Atlas cluster
* Discord Bot Token
* Google Gemini API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/Garvit711/Discord_BOT.git
cd Discord_BOT
```

---

### 2. Install Dependencies

```bash
npm install
```
### 2.1 install the core packages:

```bash
npm install discord.js express mongoose
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
TOKEN=your_discord_bot_token
API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_atlas_connection_string
GUILD_ID=your_development_server_id
PORT=3000
```

---

### 4. Start the Bot

```bash
node index.js
```

If everything is configured correctly, the bot will connect to Discord, establish a MongoDB connection, and begin handling both conversational and slash-command interactions.

---
