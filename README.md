# Garvit Bot — AI-Powered Discord Companion

Garvit Bot is an intelligent, modern Discord application integrated with Google's advanced Gemini AI Engine (`gemini-2.5-flash`). this bot delivers fast, contextual, and human-like conversational responses straight to your Discord server via slash commands.

---

## 🚀 Features

* **Modern Slash Command Interface:** Complete native integration using Discord's global command architecture via `/garvit [input]`.
* **Asynchronous Defer Handling:** Gracefully handles AI text-generation delays with interaction deferrals (`deferReply`), bypassing Discord's strict 3-second timeout limit.
* **Personalized Context:** Seamlessly extracts user attributes (like usernames) to make interactions feel tailor-made and highly engaging.
* **Secure Configuration Management:** Leverages a segregated configuration system, ensuring sensitive production credentials never leak onto GitHub.

---

## 🛠️ Architecture & Tech Stack

* **Runtime environment:** Node.js (v22+)
* **Framework:** Discord.js v14
* **AI Processing:** Google Gen AI SDK (`gemini-2.5-flash`)
* **Version Control Protection:** Advanced tracking masking (`.gitignore`)

### 📂 Repository File Blueprint

```text
├── configure/               # ❌ HIDDEN FROM GIT (Contains your real API keys)
│   └── config.json          
├── .gitignore               # Ensures private credentials stay off GitHub
├── Gemini.js                # Core connection handler to Gemini API
├── command.js               # Command structure builder & execution handler
├── index.js                 # Gateway initialization & bot runtime engine
├── config.json              # 📄 PUBLIC TEMPLATE (Dummy values for repository) add API keys here
└── README.md                # Documentation
```

---

## ⚙️ Local Setup Instructions

Follow these quick steps to deploy and run your own local instance:

### 1. Clone the Repository
```bash
git clone https://github.com/Garvit711/Discord_BOT.git
cd Discord_BOT
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create your Secure Local Credentials Vault
```json
{
  "token": "YOUR_ACTUAL_DISCORD_BOT_TOKEN",
  "apiKey": "YOUR_ACTUAL_GEMINI_API_KEY"
}
```

### 4. Launch the Application Engine
Bring your bot online!

```bash
node index.js
```
