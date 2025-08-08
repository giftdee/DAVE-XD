const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

const more = String.fromCharCode(8206);
const Taphere = more.repeat(4001);

const audios = [
  "https://files.catbox.moe/mdm9ix.mp3",
  "https://files.catbox.moe/e9ujt4.mp3",
  "https://files.catbox.moe/ihezg1.mp3"
];

zokou({ nomCom: "Bible-menu", categorie: "Dave-Menu" }, async (dest, zk, commandeOptions) => {
  let { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
  let { cm } = require(__dirname + "/../framework/zokou");

  var coms = {};
  var mode = (s.MODE).toLowerCase() !== "yes" ? "private" : "public";

  cm.map((com) => {
    if (!coms[com.categorie]) coms[com.categorie] = [];
    coms[com.categorie].push(com.nomCom);
  });

  moment.tz.setDefault("Africa/Nairobi");
  const temps = moment().format('HH:mm:ss');
  const date = moment().format('DD/MM/YYYY');

  let bibleList = `
╭─────❖ 𝐁𝐈𝐁𝐋𝐄 𝐁𝐎𝐎𝐊𝐒 ❖─────◆
│
│ 🕯️ 𝐎𝐋𝐃 𝐓𝐄𝐒𝐓𝐀𝐌𝐄𝐍𝐓:
│
│ 1. Genesis (MWANZO)
│ 2. Exodus (KUTOKA)
│ 3. Leviticus (LAWIA)
│ 4. Numbers (HESABU)
│ 5. Deuteronomy (KUMBUKUMBU)
│ 6. Joshua (YOSHUWA)
│ 7. Judges (WAAMUZI)
│ 8. Ruth (RUTHU)
│ 9. 1 Samuel (1 SAMWELI)
│ 10. 2 Samuel (2 SAMWELI)
│ 11. 1 Kings (1 WAFALME)
│ 12. 2 Kings (2 WAFALME)
│ 13. 1 Chronicles (1 NYAKATI)
│ 14. 2 Chronicles (2 NYAKATI)
│ 15. Ezra (EZRA)
│ 16. Nehemiah (NEHEMIA)
│ 17. Esther (ESTA)
│ 18. Job (AYUBU)
│ 19. Psalms (ZABURI)
│ 20. Proverbs (MITHALI)
│ 21. Ecclesiastes (MHUBIRI)
│ 22. Song of Solomon (WIMBO)
│ 23. Isaiah (ISAYA)
│ 24. Jeremiah (YEREMIA)
│ 25. Lamentations (MAOMB)
│ 26. Ezekiel (EZEKIELI)
│ 27. Daniel (DANIELI)
│ 28. Hosea (HOSEA)
│ 29. Joel (YOELI)
│ 30. Amos (AMOSI)
│ 31. Obadiah (ABADIA)
│ 32. Jonah (YONA)
│ 33. Micah (MIKA)
│ 34. Nahum (NAHUMU)
│ 35. Habakkuk (HABAKUKI)
│ 36. Zephaniah (SEFANIA)
│ 37. Haggai (HAGAI)
│ 38. Zechariah (ZEKARIA)
│ 39. Malachi (MALAKI)
│
│ ✝️ 𝐍𝐄𝐖 𝐓𝐄𝐒𝐓𝐀𝐌𝐄𝐍𝐓:
│
│ 1. Matthew (MATHAYO)
│ 2. Mark (MARKO)
│ 3. Luke (LUKA)
│ 4. John (YOHANA)
│ 5. Acts (MATENDO)
│ 6. Romans (WARUMI)
│ 7. 1 Corinthians (1 WAKORINTHO)
│ 8. 2 Corinthians (2 WAKORINTHO)
│ 9. Galatians (WAGALATIA)
│ 10. Ephesians (WAEFESO)
│ 11. Philippians (WAFILIPI)
│ 12. Colossians (WAKOLOSAI)
│ 13. 1 Thessalonians (1 WATHESALONIKE)
│ 14. 2 Thessalonians (2 WATHESALONIKE)
│ 15. 1 Timothy (1 TIMOTHEO)
│ 16. 2 Timothy (2 TIMOTHEO)
│ 17. Titus (TITO)
│ 18. Philemon (FILEMONI)
│ 19. Hebrews (WAEBRANIA)
│ 20. James (YAKOBO)
│ 21. 1 Peter (1 PETER)
│ 22. 2 Peter (2 PETER)
│ 23. 1 John (1 YOHANA)
│ 24. 2 John (2 YOHANA)
│ 25. 3 John (3 YOHANA)
│ 26. Jude (YUDA)
│ 27. Revelation (UFUNUO)
│
│ ➤ Use: ${prefixe}bible john 3:16
│ ➤ Powered by: 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃
╰───────────────────────────────◆
`;

  try {
    // Send framed Bible list with image and button preview
    await zk.sendMessage(dest, {
      image: { url: "https://files.catbox.moe/lidsgj.jpg" },
      caption: bibleList,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363400480173280@newsletter",
          newsletterName: "@𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
          serverMessageId: -1
        },
        forwardingScore: 999,
        externalAdReply: {
          title: "🛐 Bible Books Menu",
          body: "Provided by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
          thumbnailUrl: "https://files.catbox.moe/lidsgj.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

    // Send a random Bible-themed audio
    const randomAudio = audios[Math.floor(Math.random() * audios.length)];
    await zk.sendMessage(dest, {
      audio: { url: randomAudio },
      mimetype: 'audio/mp4',
      ptt: true
    });

  } catch (error) {
    console.error("Menu error:", error);
    repondre("🚫 Error in menu: " + error);
  }
});
