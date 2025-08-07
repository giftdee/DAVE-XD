"use strict";
const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");
const s = require("../set");
const axios = require("axios");

const toFancyUppercaseFont = (text) => {
    const fonts = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
        'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};
const toFancyLowercaseFont = (text) => {
    const fonts = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ',
        'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};

zokou({
    nomCom: "menu",
    categorie: "General",
    reaction: "🛡️",
    nomFichier: __filename
}, async (dest, zk, commandeOptions) => {
    const { repondre, prefixe } = commandeOptions;
    const { cm } = require("../framework/zokou");

    let coms = {};
    let mode = (s.MODE.toLowerCase() === "yes") ? "public" : "private";

    cm.map(com => {
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
*┋* *ʙᴏᴛ ɴᴀᴍᴇ :  𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ⚡*
*┋* *ᴘʀᴇғɪx :* [ ${s.PREFIXE} ]
*┋* *ᴍᴏᴅᴇ :* ${mode}
*┋* *ᴅᴀᴛᴇ  :* ${date}
*┋* *ᴘʟᴀᴛғᴏʀᴍ :* ${os.platform()}
*┋* *ᴏᴡɴᴇʀ :* 𝘿𝘼𝙑𝙇𝙊
*┋* *ᴄᴍᴅꜱ ʟᴏᴀᴅᴇᴅ :* ${cm.length}
╰───────────⊷\n`;

    let menuMsg = `*${greeting}*\n`;

    for (const cat in coms) {
        menuMsg += `\n*「 ${toFancyUppercaseFont(cat)} 」*\n╭───┈┈┈┈────⊷`;
        for (const cmd of coms[cat]) {
            menuMsg += `\n*┋* ${toFancyLowercaseFont(cmd)}`;
        }
        menuMsg += `\n╰───┈┈┈┈────⊷`;
    }

    menuMsg += `\n\n> 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n`;

    const audioList = [
        "https://files.catbox.moe/zki2qy.mp3",
        "https://files.catbox.moe/l5lya0.m4a",
        "https://files.catbox.moe/3fwkj2.mp3",
        "https://files.catbox.moe/mnnv60.mp3"
    ];
    const randomAudio = audioList[Math.floor(Math.random() * audioList.length)];

    try {
        const audioBuffer = (await axios.get(randomAudio, { responseType: 'arraybuffer' })).data;

        await zk.sendMessage(dest, {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: commandeOptions });

        await zk.sendMessage(dest, {
            image: { url: "https://files.catbox.moe/lidsgj.jpg" },
            caption: infoMsg + menuMsg,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400480173280@newsletter",
                    newsletterName: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 updates",
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
                    body: "Cmd List",
                    thumbnailUrl: "https://files.catbox.moe/3o37c5.jpeg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (error) {
        console.error("Menu error: ", error);
        repondre("🥵 Menu error: " + error.message);
    }
});
