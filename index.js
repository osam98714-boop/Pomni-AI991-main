import { Client } from 'meowsab';
import express from 'express';
import cors from 'cors';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== API Server ========== */
const app = express();
app.use(cors());

app.get('/get-code', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.status(400).json({ error: "الرجاء إدخال الرقم" });
    
    try {
        // نستخدم نظام البوتات الفرعية لإنتاج كود الإقران
        const code = await global.subBots.pairCode(number);
        res.json({ code: code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '966554031217', // Bot number
  prefix: [".", "/", "!"],
  fromMe: false, 
  owners: [
    { name: "LF", lid: "185800855674961@lid", jid: "966576041803@s.whatsapp.net" },
    { name: "LBot", lid: "185800855674961@lid", jid: "966554031217@s.whatsapp.net" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "♡ 𝑳𝑶𝒀𝑫 🎪 〈", 
  nameChannel: "𝑳𝑭990 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🎪", 
  idChannel: "",
  urls: {
    repo: "https://github.com/deveni0/Pomni-AI",
    api: "https://emam-api.web.id"
  }
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
  if (client.commandSystem) { 
    sub(client);
  }
}, 2000);

/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
