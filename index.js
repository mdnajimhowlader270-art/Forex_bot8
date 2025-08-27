
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Function list (14 buttons)
const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "📊 Live Gold Price" }, { text: "🟢 Buy Signal" }],
      [{ text: "🔴 Sell Signal" }, { text: "📈 Chart Info" }],
      [{ text: "📍 Signal to Channel" }, { text: "📑 Signal History" }],
      [{ text: "💹 Market Update" }, { text: "📉 SL/TP Info" }],
      [{ text: "⚙️ Settings" }, { text: "❓ Help" }],
      [{ text: "📢 About Bot" }, { text: "🔔 Alerts" }],
      [{ text: "💬 Support" }, { text: "🚪 Exit" }]
    ],
    resize_keyboard: true
  }
};

// Start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome to Gold Signal Bot ✨", mainMenu);
});

// Handle buttons
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "📊 Live Gold Price") {
    try {
      const res = await axios.get("https://www.goldapi.io/api/XAU/USD", {
        headers: { "x-access-token": process.env.GOLD_API_KEY }
      });
      bot.sendMessage(chatId, `📊 Current Gold Price: *$${res.data.price}*`, { parse_mode: "Markdown" });
    } catch (err) {
      bot.sendMessage(chatId, "⚠️ Error fetching gold price.");
    }
  }

  if (text === "🟢 Buy Signal" || text === "🔴 Sell Signal") {
    const entry = 1930.0; // Example, ideally fetch live
    const tp = entry + 1.0;
    const sl = entry - 1.0;

    let signal = `
${text === "🟢 Buy Signal" ? "🟢 Buy Order" : "🔴 Sell Order"}
Entry: ${entry}
TP: ${tp}
SL: ${sl}
    `;
    bot.sendMessage(chatId, signal);

    // Simulated pip tracking
    for (let p = 20; p <= 100; p += 20) {
      setTimeout(() => {
        bot.sendMessage(chatId, `✅ +${p} pips hit 🎯`);
      }, p * 1000); // simulate seconds as pips
    }
  }

  if (text === "📍 Signal to Channel") {
    bot.sendMessage(process.env.CHANNEL_ID, "🚀 New Gold Signal Posted!");
    bot.sendMessage(chatId, "✅ Signal sent to channel.");
  }
});
