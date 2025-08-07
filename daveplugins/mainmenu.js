const util = require("util"); const fs = require("fs-extra"); const { zokou } = require(__dirname + "/../framework/zokou"); const { format } = require(__dirname + "/../framework/mesfonctions"); const os = require("os"); const moment = require("moment-timezone"); const s = require(__dirname + "/../set"); const more = String.fromCharCode(8206); const readmore = more.repeat(4001);

// Fallback fancy font functions function toFancyUppercaseFont(text) { const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; const fancy = "𝟨𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"; return text .toUpperCase() .split("") .map((c) => { const i = normal.indexOf(c); return i !== -1 ? fancy[i] : c; }) .join(""); }

function toFancyLowercaseFont(text) { const normal = "abcdefghijklmnopqrstuvwxyz"; const fancy = "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"; return text .toLowerCase() .split("") .map((c) => { const i = normal.indexOf(c); return i !== -1 ? fancy[i] : c; }) .join(""); }

function greeting() { const hour = moment().hour(); if (hour < 12) return "Good Morning 🌄"; if (hour < 17) return "Good Afternoon ☀️"; if (hour < 20) return "Good Evening 🌇"; return "Good Night 🌙"; }

zokou( { nomCom: "menu2", categorie: "Dave-Menu", reaction: "💱", }, async (dest, zk, commandeOptions) => { let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions; let { cm } = require(__dirname + "/../framework/zokou");

var coms = {};
var mode = "public";
if (s.MODE.toLowerCase() !== "yes") {
  mode = "private";
}

cm.map((com) => {
  if (!coms[com.categorie]) {
    coms[com.categorie] = [];
  }
  coms[com.categorie].push(com.nomCom);
});

moment.tz.setDefault("EAT");
const temps = moment().format("HH:mm:ss");
const date = moment().format("DD/MM/YYYY");

const infoMsg = `

╭───────────⊷ ┋ *ʙᴏᴛ ɴᴀᴍᴇ :  𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ┋ ᴘʀᴇғɪx : [ ${s.PREFIXE} ] ┋ ᴍᴏᴅᴇ : ${mode} ┋ ᴅᴀᴛᴇ  : ${date} ┋ ᴘʟᴀᴛғᴏʀᴍ : ${os.platform()} ┋ ᴏᴡɴᴇʀ ɪs : DAVE ┋ ᴘʟᴜɢɪɴs ᴄᴍᴅ : ${cm.length} ╰───────────⊷\n`;

let menuMsg = ` *${greeting()}*`;

for (const cat in coms) {
  menuMsg += `\n*「 ${toFancyUppercaseFont(cat)} 」*\n╭───┈┈┈┈────⊷ `;
  for (const cmd of coms[cat]) {
    menuMsg += `\n*┋* ${toFancyLowercaseFont(cmd)}`;
  }
  menuMsg += `\n╰───┈┈┈┈────⊷`;
}

menuMsg += `\n> 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 \n`;

try {
  const lien = mybotpic();
  const mentionedJids = [
    "254111687009@s.whatsapp.net",
    "254104260236@s.whatsapp.net",
  ];

  if (lien.match(/\.(mp4|gif)$/i)) {
    await zk.sendMessage(dest, {
      video: { url: lien },
      caption: infoMsg + menuMsg,
      footer: "◄⏤͟͞ꭙͯ͢³➤⃝ ⃝⃪⃕𝚣⃪ꙴ-〭⃛〬𓆩〭⃛〬❥",
      mentions: mentionedJids,
      gifPlayback: true,
    }, { quoted: ms });
  } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    await zk.sendMessage(dest, {
      image: { url: lien },
      caption: infoMsg + menuMsg,
      footer: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
      mentions: mentionedJids,
    }, { quoted: ms });
  } else {
    await zk.sendMessage(dest, {
      text: infoMsg + menuMsg,
      mentions: mentionedJids,
    }, { quoted: ms });
  }

  const audioFolder = __dirname + "/../kn_dave/";

  if (!fs.existsSync(audioFolder)) {
    repondre(`𝐀𝐮𝐝𝐢𝐨 𝐟𝐨𝐥𝐝𝐞𝐫 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝: ${audioFolder}`);
    return;
  }

  const audioFiles = fs.readdirSync(audioFolder).filter(f => f.endsWith(".mp3"));
  if (audioFiles.length === 0) {
    repondre(`𝐍𝐨 𝐚𝐮𝐝𝐢𝐨 𝐟𝐢𝐥𝐞𝐬 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 kn_dave 𝐟𝐨𝐥𝐝𝐞𝐫`);
    return;
  }

  const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  const audioPath = audioFolder + randomAudio;

  if (fs.existsSync(audioPath)) {
    try {
      await zk.sendMessage(dest, {
        audio: { url: audioPath },
        mimetype: "audio/mpeg",
        ptt: true,
        fileName: `𝐃𝐀𝐕𝐄 𝐕𝐎𝐈𝐂𝐄 ✧`,
        caption: "✦⋆✗𝐃𝐀𝐕𝐄",
      }, { quoted: ms });
    } catch (audioError) {
      repondre(`𝐄𝐫𝐫𝐨𝐫 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐯𝐨𝐢𝐜𝐞 𝐧𝐨𝐭𝐞: ${audioError.message}`);
    }
  } else {
    repondre(`𝐀𝐮𝐝𝐢𝐨 𝐟𝐢𝐥𝐞 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝: ${randomAudio}\n𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐟𝐢𝐥𝐞𝐬: ${audioFiles.join(", ")}`);
  }
} catch (e) {
  repondre(`◈ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 ◈\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫: ${e.message}`);
}

} );

    
