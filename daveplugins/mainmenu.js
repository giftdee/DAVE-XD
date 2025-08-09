"use strict";
const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// ===== persistent audio shuffle state =====
let shuffledAudios = [];
let currentAudioIndex = 0;
let audioListSignature = "";

// ===== helpers =====
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildShuffledAudios(audioFolder) {
  if (!fs.existsSync(audioFolder)) {
    shuffledAudios = [];
    audioListSignature = "";
    currentAudioIndex = 0;
    return;
  }
  const files = fs.readdirSync(audioFolder).filter(f => f.toLowerCase().endsWith(".mp3"));
  const signature = files.join("|");
  if (files.length === 0) {
    shuffledAudios = [];
    audioListSignature = "";
    currentAudioIndex = 0;
    return;
  }
  // Rebuild only if list changed or we've exhausted previous shuffle
  if (signature !== audioListSignature || shuffledAudios.length === 0) {
    shuffledAudios = shuffleArray(files.slice());
    currentAudioIndex = 0;
    audioListSignature = signature;
    console.log(`[MENU AUDIO] Shuffled ${shuffledAudios.length} audio files.`);
  }
}

function getNextAudioPath(audioFolder) {
  buildShuffledAudios(audioFolder);
  if (shuffledAudios.length === 0) return null;
  const file = shuffledAudios[currentAudioIndex];
  currentAudioIndex++;
  if (currentAudioIndex >= shuffledAudios.length) {
    // mark to reshuffle next time
    shuffledAudios = [];
    currentAudioIndex = 0;
    audioListSignature = "";
  }
  return path.join(audioFolder, file);
}

// Function to convert text to fancy uppercase font
const toFancyUppercaseFont = (text) => {
  const fonts = {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
    'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
  };
  return String(text || "").split('').map(char => fonts[char] || char).join('');
};

// Function to convert text to fancy lowercase font
const toFancyLowercaseFont = (text) => {
  const fonts = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ',
    'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
  };
  return String(text || "").split('').map(char => fonts[char] || char).join('');
};

zokou(
  {
    nomCom: "menu",
    categorie: "Dave-Menu",
    reaction: "⚡",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;

    // Safely load cm list from framework (some setups export it differently)
    let cm;
    try {
      ({ cm } = require(__dirname + "/../framework/zokou"));
    } catch (err) {
      cm = [];
      console.warn("[MENU] could not load cm from framework/zokou:", err && err.message);
    }

    console.log(`[DEBUG] menu command triggered by ${ms?.key?.participant || ms?.key?.remoteJid} in ${dest}`);

    try {
      // Command categorization
      const coms = {};
      if (!Array.isArray(cm) || cm.length === 0) {
        console.warn("[MENU] cm is empty or not an array; continuing with empty command list.");
      } else {
        cm.forEach((com) => {
          const cat = com.categorie || "Uncategorized";
          if (!coms[cat]) coms[cat] = [];
          coms[cat].push(com.nomCom || "(no-name)");
        });
      }

      // Mode (safe handling)
      const mode = ((s.MODE || "").toString().toLowerCase() === "yes") ? "private" : "public";

      // Timezone & greeting
      moment.tz.setDefault("Africa/Nairobi");
      const hour = moment().hour();
      let greeting = "ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ";
      if (hour >= 12 && hour < 18) greeting = "ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ!";
      else if (hour >= 18 && hour < 22) greeting = "ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ!";
      else if (hour >= 22 || hour < 5) greeting = "ɢᴏᴏᴅ ɴɪɢʜᴛ";

      const temps = moment().format("HH:mm:ss");
      const date = moment().format("DD/MM/YYYY");
      const img = 'https://files.catbox.moe/lidsgj.jpg';

      const infoMsg = `
⬣════════════════════⬣

  💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠

> ✦ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫:
@254111687009

> ✦ 𝐌𝐨𝐝𝐞:
${mode}

> ✦ 𝐓𝐢𝐦𝐞:
${temps} (EAT)

> ✦ 𝐑𝐀𝐌:
${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}

⬣════════════════════⬣
`;

      // Build menu text
      let menuMsg = `
⬣════════════════════⬣
  💠 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐌𝐄𝐍𝐔 💠

  Use ${prefixe || "."}help <command>
  to get command details

✦⭑✦⭑✦⭑✦⭑✦⭑✦⭑✦⭑
`;

      const categoryStyles = {
        "Dave-New": { icon: "🔹", decor: "┃" },
        "Dave-Sports": { icon: "🔹", decor: "┃" },
        "Dave-General": { icon: "🔹", decor: "┃" },
        "God": { icon: "🔹", decor: "┃" },
        "Dave-Mods": { icon: "🔹", decor: "┃" },
        "Dave-Fun": { icon: "🔹", decor: "┃" },
        "Dave-Search": { icon: "🔹", decor: "┃" },
        "Dave-Conversation": { icon: "🔹", decor: "┃" },
        "Dave-Group": { icon: "🔹", decor: "┃" },
        "Audio-Edit": { icon: "🔹", decor: "┃" },
        "Dave-coding": { icon: "🔹", decor: "┃" },
        "Dave-Heroku": { icon: "🔹", decor: "┃" },
        "Image-Edit": { icon: "🔹", decor: "┃" },
        "Dave-Ai": { icon: "🔹", decor: "┃" },
        "Dave-Images": { icon: "🔹", decor: "┃" },
        "Dave-Games": { icon: "🔹", decor: "┃" },
        "Dave-Tradeplace": { icon: "🔹", decor: "┃" },
        "Dave-Download": { icon: "🔹", decor: "┃" },
        "Dave-User": { icon: "🔹", decor: "┃" },
        "Dave-Menu": { icon: "🔹", decor: "┃" },
        "Dave-Logo": { icon: "🔹", decor: "┃" },
        "Dave-script": { icon: "🔹", decor: "┃" },
        "Dave-Bug": { icon: "🔹", decor: "┃" },
        "Dave-Hentai": { icon: "🔹", decor: "┃" },
        "Dave-Tools": { icon: "🔹", decor: "┃" },
        "Dave-System": { icon: "🔹", decor: "┃" },
        "Dave-Soccer": { icon: "🔹", decor: "┃" },
        "Adult": { icon: "🔹", decor: "┃" },
        "Dave-Sticker": { icon: "🔹", decor: "┃" },
        "Dave-screenshots": { icon: "🔹", decor: "┃" }
      };

      for (const cat in coms) {
        const style = categoryStyles[cat] || { icon: "🔹", decor: "⋯" };
        const fancyCat = toFancyUppercaseFont(cat.toUpperCase());
        menuMsg += `\n  ${style.decor} ${style.icon} *${fancyCat}* ${style.icon} ${style.decor}\n`;
        coms[cat].forEach((cmd) => {
          const fancyCmd = toFancyLowercaseFont(cmd);
          menuMsg += `  • ${fancyCmd}\n`;
        });
      }

      menuMsg += `
⬣━━━━━━━━━━━━━━━━━━━━⬣
> *Bot Developers*

  🔹 @254111687009 (Dave)
  🔹 @254104260236 (Gifted Dave)

> Powered by *Gifted Dave* 
⬣━━━━━━━━━━━━━━━━━━━━⬣
`;

      // prepare mentions
      const mentionedJids = [
        "254111687009@s.whatsapp.net",
        "254104260236@s.whatsapp.net",
      ];

      // Resolve mybotpic safely
      let lien = "";
      try {
        lien = (typeof mybotpic === "function") ? (mybotpic() || "") : (mybotpic || "");
      } catch (err) {
        console.warn("[MENU] mybotpic() threw:", err && err.message);
        lien = "";
      }

      // send menu (image/video/text) with externalAdReply for preview
      const messagePayloadBase = {
        caption: infoMsg + menuMsg + `\n${readmore}`, // include readmore to collapse long menus
        mentions: mentionedJids
      };

      if (lien && /\.(mp4|gif)$/i.test(lien)) {
        console.log(`[DEBUG] menu: Sending video menu`);
        await zk.sendMessage(dest, {
          video: { url: lien },
          ...messagePayloadBase,
          gifPlayback: true,
          contextInfo: {
            externalAdReply: {
              title: "💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠",
              body: "🔹Command List",
              thumbnailUrl: img,
              sourceUrl: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: ms });
        console.log(`[DEBUG] menu: Video menu sent successfully`);
      } else if (lien && /\.(jpe?g|png)$/i.test(lien)) {
        console.log(`[DEBUG] menu: Sending image menu`);
        await zk.sendMessage(dest, {
          image: { url: lien },
          ...messagePayloadBase,
          contextInfo: {
            externalAdReply: {
              title: "💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠",
              body: "🔹Command List",
              thumbnailUrl: img,
              sourceUrl: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: ms });
        console.log(`[DEBUG] menu: Image menu sent successfully`);
      } else {
        console.log(`[DEBUG] menu: Sending text menu`);
        await zk.sendMessage(dest, {
          text: infoMsg + menuMsg + `\n${readmore}`,
          mentions: mentionedJids
        }, { quoted: ms });
        console.log(`[DEBUG] menu: Text menu sent successfully`);
      }

      // ---------------- audio section ----------------
      const audioFolder = path.join(__dirname, "../kn_dave/");
      console.log(`[DEBUG] menu: Audio folder path: ${audioFolder}`);

      // Ensure folder exists
      if (!fs.existsSync(audioFolder)) {
        console.log(`[DEBUG] menu: Audio folder does not exist: ${audioFolder}`);
        repondre(`𝐀𝐮𝐝𝐢𝐨 𝐟𝐨𝐥𝐝𝐞𝐫 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝: ${audioFolder}`);
        return;
      }

      // Get next audio path using shuffle system (no immediate repeats until cycle completes)
      const audioPath = getNextAudioPath(audioFolder);

      if (!audioPath) {
        console.log(`[DEBUG] menu: No mp3 files found in folder: ${audioFolder}`);
        repondre(`𝐍𝐨 𝐚𝐮𝐝𝐢𝐨 𝐟𝐢𝐥𝐞𝐬 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 kn_dave 𝐟𝐨𝐥𝐝𝐞𝐫`);
        return;
      }

      console.log(`[DEBUG] menu: Selected audio to send: ${audioPath}`);

      // Verify and send audio
      if (fs.existsSync(audioPath)) {
        try {
          await zk.sendMessage(dest, {
            audio: { url: audioPath },
            mimetype: "audio/mpeg",
            ptt: true,
            fileName: `𝐃𝐀𝐕𝐄 𝐕𝐎𝐈𝐂𝐄 ✧`,
            caption: "✦⋆✗𝐃𝐀𝐕𝐄"
          }, { quoted: ms });
          console.log(`[DEBUG] menu: Audio sent successfully: ${audioPath}`);
        } catch (audioError) {
          console.error(`[DEBUG] menu: Error sending audio:`, audioError);
          repondre(`𝐄𝐫𝐫𝐨𝐫 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐯𝐨𝐢𝐜𝐞 𝐧𝐨𝐭𝐞: ${audioError.message || audioError}`);
        }
      } else {
        console.log(`[DEBUG] menu: Selected audio file does not exist: ${audioPath}`);
        repondre(`𝐀𝐮𝐝𝐢𝐨 𝐟𝐢𝐥𝐞 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝: ${audioPath}`);
      }

    } catch (e) {
      console.error(`[DEBUG] menu: Error:`, e);
      repondre(`◈ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 ◈\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫: ${e && e.message ? e.message : util.inspect(e)}`);
    }
  }
);