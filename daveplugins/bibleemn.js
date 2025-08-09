"use strict";
const util = require('util');
const fs = require('fs-extra');
const path = require('path');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const Taphere = more.repeat(4001);

// ----- helper: safe require of framework command list -----
function safeLoadFrameworkCm() {
  try {
    const fw = require(__dirname + "/../framework/zokou");
    if (Array.isArray(fw.cm)) return fw.cm;
    if (Array.isArray(fw)) return fw;
    if (Array.isArray(fw.commands)) return fw.commands;
    return [];
  } catch (err) {
    console.warn("[Bible-Menu] safeLoadFrameworkCm: failed to load framework/zokou:", err && err.message);
    return [];
  }
}

// fancy-font helpers (kept but no extra emojis)
const toFancyUppercaseFont = (text) => {
  const fonts = {
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌',
    'N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙'
  };
  return String(text || "").split('').map(char => fonts[char] || char).join('');
};
const toFancyLowercaseFont = (text) => {
  const fonts = {
    'a': 'ᴀ','b': 'ʙ','c': 'ᴄ','d': 'ᴅ','e': 'ᴇ','f': 'ғ','g': 'ɢ','h': 'ʜ','i': 'ɪ','j': 'ᴊ','k': 'ᴋ','l': 'ʟ','m': 'ᴍ',
    'n': 'ɴ','o': 'ᴏ','p': 'ᴘ','q': 'ǫ','r': 'ʀ','s': 's','t': 'ᴛ','u': 'ᴜ','v': 'ᴠ','w': 'ᴡ','x': 'x','y': 'ʏ','z': 'ᴢ'
  };
  return String(text || "").split('').map(char => fonts[char] || char).join('');
};

// ---- NomCom registration ----
zokou({ nomCom: "Bible-Menu", categorie: "Dave-Menu" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions || {};
  const cm = safeLoadFrameworkCm();

  // Build commands map safely (used if you still want commands listed)
  const coms = {};
  try {
    if (Array.isArray(cm) && cm.length) {
      cm.forEach((c) => {
        const cat = c && c.categorie ? c.categorie : "Misc";
        if (!coms[cat]) coms[cat] = [];
        coms[cat].push(c && c.nomCom ? c.nomCom : "(no-name)");
      });
    }
  } catch (err) {
    console.warn("[Bible-Menu] grouping commands failed:", err && err.message);
  }

  // safe config
  const safePrefix = (s && s.PREFIXE) ? s.PREFIXE : ".";
  const mode = ((s && s.MODE) ? String(s.MODE).toLowerCase() : "") === "yes" ? "private" : "public";

  // time
  moment.tz.setDefault("Africa/Nairobi");
  const temps = moment().format('HH:mm:ss');
  const date = moment().format('DD/MM/YYYY');

  // Build framed Bible menu (no emojis)
  const header = "╭─────────────────────────────╮\n" +
                 "│        HOLY BIBLE MENU      │\n" +
                 "╰─────────────────────────────╯\n";

  const usageLine = `Usage: ${safePrefix}bible <book> <chapter>:<verse>\n\n`;

  // Old Testament list (kept short lines inside frame)
  const oldTestament = [
    "1. Genesis (MWANZO)",
    "2. Exodus (KUTOKA)",
    "3. Leviticus (WALAWI)",
    "4. Numbers (HESABU)",
    "5. Deuteronomy (TORATI)",
    "6. Joshua (JOSHUA)",
    "7. Judges (WAAMUZI)",
    "8. Ruth (RUTH)",
    "9. 1 Samuel (1SAMWELI)",
    "10. 2 Samuel (2SAMWEL)",
    "11. 1 Kings (1WAFALME)",
    "12. 2 Kings (2WAFALME)",
    "13. 1 Chronicles (1WATHESALONIKE)",
    "14. 2 Chronicles (2WATHESALONIKE)",
    "15. Ezra (EZRA)",
    "16. Nehemiah (NEHEMIA)",
    "17. Esther (ESTA)",
    "18. Job (AYUBU)",
    "19. Psalms (ZABURI)",
    "20. Proverbs (MITHALI)",
    "21. Ecclesiastes (MHUBIRI)",
    "22. Song of Solomon (WIMBO WA SULEMAN)",
    "23. Isaiah (ISAYA)",
    "24. Jeremiah (YEREMIA)",
    "25. Lamentations (MAOMBOLEZO)",
    "26. Ezekiel (EZEKIEL)",
    "27. Daniel (DANIEL)",
    "28. Hosea (HESEA)",
    "29. Joel (JOEL)",
    "30. Amos (AMOSI)",
    "31. Obadiah (OBADIA)",
    "32. Jonah (YONA)",
    "33. Micah (MIKA)",
    "34. Nahum (NAHUM)",
    "35. Habakkuk (HABAKUKI)",
    "36. Zephaniah (ZEFANIA)",
    "37. Haggai (HAGAI)",
    "38. Zechariah (ZAKARIA)",
    "39. Malachi (MALAKI)"
  ];

  const newTestament = [
    "1. Matthew (MATHAYO)",
    "2. Mark (MARKO)",
    "3. Luke (LUKA)",
    "4. John (JOHN)",
    "5. Acts (MATENDO)",
    "6. Romans (WARUMI)",
    "7. 1 Corinthians (1WAKORITHO)",
    "8. 2 Corinthians (2WAKORITHO)",
    "9. Galatians (WAGALATIA)",
    "10. Ephesians (WAEFESO)",
    "11. Philippians (WAFILIPI)",
    "12. Colossians (WAKOLOSAI)",
    "13. 1 Thessalonians (1WATHESALONIKE)",
    "14. 2 Thessalonians (2WATHESALONIKE)",
    "15. 1 Timothy (TIMOTHEO)",
    "16. 2 Timothy (2TIMOTHEO)",
    "17. Titus (TITO)",
    "18. Philemon (FILEMONI)",
    "19. Hebrews (WAEBRANIA)",
    "20. James (JAMES)",
    "21. 1 Peter (1PETER)",
    "22. 2 Peter (2PETER)",
    "23. 1 John (1JOHN)",
    "24. 2 John (2JOHN)",
    "25. 3 John (3JOHN)",
    "26. Jude (YUDA)",
    "27. Revelation (UFUNUO WA YOHANA)"
  ];

  // Build framed content body (wrap lines to fit nicely if needed)
  const bodyLines = [];
  bodyLines.push("─ Old Testament ─");
  oldTestament.forEach(l => bodyLines.push(l));
  bodyLines.push("");
  bodyLines.push("─ New Testament ─");
  newTestament.forEach(l => bodyLines.push(l));
  bodyLines.push("");
  bodyLines.push(`Mode: ${mode}   Date: ${date}   Time: ${temps}`);
  bodyLines.push(`Commands: ${Array.isArray(cm) ? cm.length : 0}`);
  bodyLines.push(`Powered by: Gifted Dave`);

  // Compose framed block: surround body lines with vertical bars and fixed width
  const maxInnerWidth = Math.max(
    ...[header.length, ...bodyLines.map(l => l.length)].map(l => typeof l === "number" ? l : 0),
    44
  );
  const padLine = (line) => {
    const inner = line || "";
    const pad = " ".repeat(Math.max(0, maxInnerWidth - inner.length));
    return `│ ${inner}${pad} │`;
  };

  const topBorder = "┌" + "─".repeat(maxInnerWidth + 2) + "┐";
  const bottomBorder = "└" + "─".repeat(maxInnerWidth + 2) + "┘";

  // Build final caption (use read/collapse token Taphere)
  const framedHeader = topBorder + "\n" + padLine("HOLY BIBLE MENU".padStart(Math.floor((maxInnerWidth + "HOLY BIBLE MENU".length)/2))) + "\n" + "├" + "─".repeat(maxInnerWidth + 2) + "┤\n";
  const framedBody = bodyLines.map(l => padLine(l)).join("\n") + "\n";
  const framedFooter = bottomBorder;

  const caption = framedHeader + framedBody + framedFooter + `\n\n${usageLine}${Taphere}`;

  // contextInfo including forwarded newsletter so "View channel" appears
  const contextInfo = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363400480173280@newsletter",
      newsletterName: "DAVEx CHANNEL",
      serverMessageId: -1
    },
    externalAdReply: {
      title: "DAVEx - Holy Bible",
      body: "Get verses with: " + safePrefix + "bible <book> <chapter>:<verse>",
      thumbnailUrl: "https://files.catbox.moe/lidsgj.jpg",
      sourceUrl: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
      mediaType: 1,
      renderLargerThumbnail: true
    }
  };

  try {
    // safe mybotpic resolution
    let chosenImage = "https://files.catbox.moe/uw4l17.jpeg";
    try {
      const candidate = (typeof mybotpic === "function") ? (mybotpic() || "") : (mybotpic || "");
      if (candidate) chosenImage = candidate;
    } catch (err) { /* ignore */ }

    const sendOpts = ms ? { quoted: ms } : {};

    // If chosenImage is video/gif send as video, else send as image
    if (/\.(mp4|gif)$/i.test(chosenImage)) {
      await zk.sendMessage(dest, {
        video: { url: chosenImage },
        caption,
        contextInfo,
        gifPlayback: true
      }, sendOpts);
    } else {
      await zk.sendMessage(dest, {
        image: { url: chosenImage },
        caption,
        contextInfo
      }, sendOpts);
    }

    console.log("[Bible-Menu] sent successfully to", dest);

  } catch (err) {
    console.error("[Bible-Menu] send error:", err);
    try { repondre("Menu error: " + (err && err.message ? err.message : util.inspect(err))); } catch {}
  }
});