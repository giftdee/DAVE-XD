"use strict";
const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");
const s = require("../set");
const fs = require("fs-extra");
const path = require("path");

const readMore = String.fromCharCode(8206).repeat(4001);

// ===== audio URLs =====
const AUDIO_URLS = [
  'https://files.catbox.moe/j1l6zs.mp3',
  'https://files.catbox.moe/xci982.mp3',
  'https://files.catbox.moe/pfk29u.mp3',
  'https://files.catbox.moe/w2j17k.m4a',
  'https://files.catbox.moe/851skv.m4a',
  'https://files.catbox.moe/qnhtbu.m4a',
  'https://files.catbox.moe/lb0x7w.mp3',
  'https://files.catbox.moe/efmcxm.mp3',
  'https://files.catbox.moe/wdap4t.mp3',
  'https://files.catbox.moe/26oeeh.mp3',
  'https://files.catbox.moe/a1sh4u.mp3',
  'https://files.catbox.moe/vuuvwn.m4a',
  'https://files.catbox.moe/usthsf.mp3',
  'https://files.catbox.moe/uj8fps.m4a',
  'https://files.catbox.moe/dc88bx.m4a',
  'https://files.catbox.moe/514d3g.mp3',
  'https://files.catbox.moe/ea0enw.mp3'
];

// ===== persistent shuffle state for URLs (no-repeat until cycle completes) =====
let shuffledAudioUrls = [];
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

function buildShuffledAudioUrls(urls) {
  // stable signature (sorted) so reordering doesn't falsely trigger reshuffle
  const signature = urls.slice().sort().join("|");
  if (urls.length === 0) {
    shuffledAudioUrls = [];
    audioListSignature = "";
    currentAudioIndex = 0;
    return;
  }
  if (signature !== audioListSignature || shuffledAudioUrls.length === 0) {
    shuffledAudioUrls = shuffleArray(urls.slice());
    currentAudioIndex = 0;
    audioListSignature = signature;
    console.log(`[MENU AUDIO] Shuffled ${shuffledAudioUrls.length} audio URLs.`);
  }
}

function getNextAudioUrl(urls) {
  buildShuffledAudioUrls(urls);
  if (!shuffledAudioUrls || shuffledAudioUrls.length === 0) return null;
  const url = shuffledAudioUrls[currentAudioIndex];
  currentAudioIndex++;
  if (currentAudioIndex >= shuffledAudioUrls.length) {
    // mark to reshuffle next time
    shuffledAudioUrls = [];
    currentAudioIndex = 0;
    audioListSignature = "";
  }
  return url;
}

function extToMime(ext) {
  ext = ext.toLowerCase();
  if (ext === "mp3") return "audio/mpeg";
  if (ext === "m4a" || ext === "mp4") return "audio/mp4";
  if (ext === "ogg" || ext === "oga") return "audio/ogg";
  return "audio/mpeg";
}

// Convert text to fancy fonts
const toFancyUppercaseFont = (text) => {
    const fonts = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
        'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return String(text || "").split('').map(char => fonts[char] || char).join('');
};

const toFancyLowercaseFont = (text) => {
    const fonts = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ',
        'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return String(text || "").split('').map(char => fonts[char] || char).join('');
};

zokou({
    nomCom: "dave",
    categorie: "Dave-Menu",
    reaction: "💠",
    nomFichier: __filename
}, async (dest, zk, commandeOptions) => {
    // destructure optionally available fields; ms may be undefined in some setups
    const { repondre, prefixe, nomAuteurMessage, mybotpic, ms } = commandeOptions;

    // safe load cm
    let cm = [];
    try {
      const framework = require("../framework/zokou");
      cm = framework.cm || [];
    } catch (err) {
      console.warn("[MENU] failed to load cm:", err && err.message);
      cm = [];
    }

    // categorize commands
    const coms = {};
    cm.forEach((com) => {
        const cat = com.categorie || "Uncategorized";
        if (!coms[cat]) coms[cat] = [];
        coms[cat].push(com.nomCom || "(no-name)");
    });

    // mode & time
    const mode = ((s.MODE || "").toString().toLowerCase() === "yes") ? "private" : "public";
    moment.tz.setDefault("Africa/Nairobi");
    const hour = moment().hour();
    let greeting = "ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ";
    if (hour >= 12 && hour < 18) greeting = "ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ!";
    else if (hour >= 18) greeting = "ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ!";
    else if (hour >= 22 || hour < 5) greeting = "ɢᴏᴏᴅ ɴɪɢʜᴛ";

    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');
    const img = 'https://files.catbox.moe/lidsgj.jpg';

    const infoMsg = `
╔════════════════════════╗
       𝐃𝐀𝐕𝐄-𝐗𝐌𝐃
╚════════════════════════╝
╔════════ INFO ═════════╗
PREFIX   ➜ [ ${s.PREFIXE} ]
MODE     ➜ ${mode}
DATE     ➜ ${date}
PLATFORM ➜ ${os.platform()}
OWNER    ➜ Gifted-dave
PLUGINS  ➜ ${cm.length || 0}
╚════════════════════════╝\n`;

let menuMsg = `${greeting}`;

for (const cat in coms) {
    menuMsg += `
╔═【 ${toFancyUppercaseFont(cat)} 】═╗`;
    for (const cmd of coms[cat]) {
        menuMsg += `\n┃  ${toFancyLowercaseFont(cmd)}`;
    }
    menuMsg += `\n╚════════════════════╝`;
}

menuMsg += `\n\n> @𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 - 2025`;

    try {
        // prepare context info for forwarded newsletter + preview
        const menuContextInfo = {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400480173280@newsletter",
                newsletterName: "𝐃𝐀𝐕𝐄-𝐂𝐇𝐀𝐍𝐍𝐄𝐋",
                serverMessageId: -1
            },
            forwardingScore: 999,
            externalAdReply: {
                title: "💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠",
                body: "View channel",
                thumbnailUrl: img,
                sourceUrl: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        };

        // resolve mybotpic safely
        let lien = "";
        try { lien = (typeof mybotpic === "function") ? (mybotpic() || "") : (mybotpic || ""); } catch { lien = ""; }

        // send menu (image/video/text) with newsletter / externalAdReply so "View channel" appears
        if (lien && /\.(mp4|gif)$/i.test(lien)) {
            await zk.sendMessage(dest, {
                video: { url: lien },
                caption: infoMsg + menuMsg + `\n${readMore}`,
                contextInfo: menuContextInfo,
                gifPlayback: true
            }, { quoted: ms });
        } else if (lien && /\.(jpe?g|png)$/i.test(lien)) {
            await zk.sendMessage(dest, {
                image: { url: lien },
                caption: infoMsg + menuMsg + `\n${readMore}`,
                contextInfo: menuContextInfo
            }, { quoted: ms });
        } else {
            await zk.sendMessage(dest, {
                text: infoMsg + menuMsg + `\n${readMore}`,
                contextInfo: menuContextInfo
            }, { quoted: ms });
        }

        // --- pick a random audio URL from the provided list (no-repeat cycle) ---
        const audioUrl = getNextAudioUrl(AUDIO_URLS);
        if (!audioUrl) {
          console.log("[MENU] no audio URL available.");
          return;
        }

        // determine mimetype from extension
        const urlNoQuery = audioUrl.split("?")[0];
        const ext = urlNoQuery.split(".").pop().toLowerCase();
        const mimetype = extToMime(ext);

        // send audio as voice note (ptt)
        await zk.sendMessage(dest, {
          audio: { url: audioUrl },
          mimetype,
          ptt: true
        }, { quoted: ms });

        console.log("[MENU] audio sent:", audioUrl);

    } catch (error) {
        console.error("Menu error: ", error);
        try { repondre("💦💦 Menu error: " + String(error)); } catch {}
    }
});
