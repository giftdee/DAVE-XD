const util = require("util");
const fs = require("fs-extra");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);


const readMore = String.fromCharCode(8206).repeat(4001);

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

zokou({ 
    nomCom: "menu", 
    categorie: "Dave-Menu", 
    reaction: "😹", 
    nomFichier: __filename 
}, async (dest, zk, commandeOptions) => {
    const { repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const { cm } = require("../framework/zokou");
    let coms = {};
    let mode = "public";

    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }

    cm.map(async (com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault("Africa/Nairobi");
    const hour = moment().hour();
    let greeting = "ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ";
    if (hour >= 12 && hour < 18) greeting = "ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ!";
    else if (hour >= 18) greeting = "ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ!";
    else if (hour >= 22 || hour < 5) greeting = "ɢᴏᴏᴅ ɴɪɢʜᴛ";

    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    const infoMsg = `╭───────────⊷
*┋* *ʙᴏᴛ ɴᴀᴍᴇ :  𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ⚡*
*┋* *ᴘʀᴇғɪx :* [ ${s.PREFIXE} ]
*┋* *ᴍᴏᴅᴇ :* ${mode}
*┋* *ᴅᴀᴛᴇ  :* ${date}
*┋* *ᴘʟᴀᴛғᴏʀᴍ :* ${os.platform()}
*┋* *ᴏᴡɴᴇʀ :* 𝘿𝘼𝙑𝙇𝙊
*┋* *ᴄᴍᴅꜱ ʟᴏᴀᴅᴇᴅ :* ${cm.length}
╰───────────⊷\n`;

    let menuMsg = ` *${greeting}*`;

    for (const cat in coms) {
        menuMsg += `
*「 ${toFancyUppercaseFont(cat)} 」*
╭───┈┈┈┈────⊷ `;
        for (const cmd of coms[cat]) {
            menuMsg += `          
*┋* ${toFancyLowercaseFont(cmd)}`;   
        }
        menuMsg += `
╰───┈┈┈┈────⊷`;
    }

    menuMsg += `
> 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n`;
   
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
            footer: "◄⏤͟͞ꭙͯ͢³➤⃝ ⃝⃪⃕𝚣⃪ꙴ-〭⃛〬𓆩〭⃛〬❥",
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
