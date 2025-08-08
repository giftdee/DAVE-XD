const util = require("util");
const fs = require("fs-extra");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// Function to convert text to fancy uppercase font
const toFancyUppercaseFont = (text) => {
    const fonts = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
        'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};

// Function to convert text to fancy lowercase font
const toFancyLowercaseFont = (text) => {
    const fonts = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ',
        'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};

zokou(
  {
    nomCom: "menu",
    categorie: "Dave-Menu",
    reaction: "⚡",
  },
  async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");

    console.log(`[DEBUG] menu command triggered by ${ms.key.participant || ms.key.remoteJid} in ${dest}`);

    // Command categorization
    var coms = {};
    var mode = "public";
    if (s.MODE.toLocaleLowerCase() !== "yes") {
      mode = "private";
    }

    cm.map(async (com) => {
      if (!coms[com.categorie]) {
        coms[com.categorie] = [];
      }
      coms[com.categorie].push(com.nomCom);
    });

    // Set timezone and get current time
    moment.tz.setDefault("EAT");
    const temps = moment().format("HH:mm:ss");

    // Info section
    let infoMsg = `   
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

    // Menu section
let menuMsg = `
⬣════════════════════⬣
    💠 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐌𝐄𝐍𝐔 💠

  Use ${prefixe}help <command>
     to get command details

✦⭑✦⭑✦⭑✦⭑✦⭑✦⭑✦⭑
`;

    // Category styles with mature, realistic decor
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
  "Dave-Sticker": { icon: "🔹", decor: "┃" }
};
    // Build menu with all categories and vertical command listing
    for (const cat in coms) {
  const style = categoryStyles[cat] || { icon: "🔹", decor: "⋯" };

  // Fancy uppercase category name
  const fancyCat = toFancyUppercaseFont(cat.toUpperCase());

  menuMsg += `\n  ${style.decor} ${style.icon} *${fancyCat}* ${style.icon} ${style.decor}\n`;

  // Fancy lowercase each command
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

    try {
      const lien = mybotpic();
      const mentionedJids = [
        "254111687009@s.whatsapp.net",
        "254104260236@s.whatsapp.net",
      ];

      // Send menu based on media type
      if (lien.match(/\.(mp4|gif)$/i)) {
        console.log(`[DEBUG] menu: Sending video menu`);
        await zk.sendMessage(
          dest,
          {
            video: { url: lien },
            caption: infoMsg + menuMsg,
            footer: "◖⧽💠 𝘿𝘼𝙑𝙀-𝕏𝙈𝘿 💠⧼◗",
            mentions: mentionedJids,
            gifPlayback: true,
          },
          { quoted: ms }
        );
        console.log(`[DEBUG] menu: Video menu sent successfully`);
      } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        console.log(`[DEBUG] menu: Sending image menu`);
        await zk.sendMessage(
          dest,
          {
            image: { url: lien },
            caption: infoMsg + menuMsg,
            footer: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
            mentions: mentionedJids,
          },
          { quoted: ms }
        );
        console.log(`[DEBUG] menu: Image menu sent successfully`);
      } else {
        console.log(`[DEBUG] menu: Sending text menu`);
        await zk.sendMessage(
          dest,
          {
            text: infoMsg + menuMsg,
            mentions: mentionedJids,
          },
          { quoted: ms }
        );
        console.log(`[DEBUG] menu: Text menu sent successfully`);
      }

      // Send random audio as a voice note
      const audioFolder = __dirname + "/../kn_dave/";
      console.log(`[DEBUG] menu: Audio folder path: ${audioFolder}`);

      // Check if folder exists
      if (!fs.existsSync(audioFolder)) {
        console.log(`[DEBUG] menu: Audio folder does not exist: ${audioFolder}`);
        repondre(`𝐀𝐮𝐝𝐢𝐨 𝐟𝐨𝐥𝐝𝐞𝐫 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝: ${audioFolder}`);
        return;
      }

      // Get all MP3 files in the folder
      const audioFiles = fs.readdirSync(audioFolder).filter(f => f.endsWith(".mp3"));
      console.log(`[DEBUG] menu: Available audio files: ${audioFiles}`);

      if (audioFiles.length === 0) {
        console.log(`[DEBUG] menu: No MP3 files found in folder`);
        repondre(`𝐍𝐨 𝐚𝐮𝐝𝐢𝐨 𝐟𝐢𝐥𝐞𝐬 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 kn_dave 𝐟𝐨𝐥𝐝𝐞𝐫`);
        return;
      }

      // Randomly select an audio file
      const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
      const audioPath = audioFolder + randomAudio;

      console.log(`[DEBUG] menu: Randomly selected audio: ${randomAudio}`);
      console.log(`[DEBUG] menu: Full audio path: ${audioPath}`);

      // Verify file exists
      if (fs.existsSync(audioPath)) {
        console.log(`[DEBUG] menu: Audio file exists, sending as voice note`);
        try {
          const audioMessage = await zk.sendMessage(
            dest,
            {
              audio: { url: audioPath },
              mimetype: "audio/mpeg",
              ptt: true,
              fileName: `𝐃𝐀𝐕𝐄 𝐕𝐎𝐈𝐂𝐄 ✧`,
              caption: "✦⋆✗𝐃𝐀𝐕𝐄",
            },
            { quoted: ms }
          );
          console.log(`[DEBUG] menu: Audio sent successfully: ${randomAudio}`);
          console.log(`[DEBUG] menu: Audio message details: ${JSON.stringify(audioMessage)}`);
        } catch (audioError) {
          console.error(`[DEBUG] menu: Error sending audio: ${audioError}`);
          repondre(`𝐄𝐫𝐫𝐨𝐫 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐯𝐨𝐢𝐜𝐞 𝐧𝐨𝐭𝐞: ${audioError.message}`);
        }
      } else {
        console.log(`[DEBUG] menu: Selected audio file not found at: ${audioPath}`);
        repondre(`𝐀𝐮𝐝𝐢𝐨 𝐟𝐢𝐥𝐞 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝: ${randomAudio}\n𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐟𝐢𝐥𝐞𝐬: ${audioFiles.join(", ")}`);
      }
    } catch (e) {
      console.error(`[DEBUG] menu: Error: ${e}`);
      repondre(`◈ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 ◈\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫: ${e.message}`);
    }
  }
);
         

              
      
