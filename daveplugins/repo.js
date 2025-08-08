const { zokou } = require("../framework/zokou");
const axios = require('axios');
const moment = require("moment-timezone");
const set = require(__dirname + '/../set');
moment.tz.setDefault('' + set.TIMEZONE);

// 🎵 Audio list
const audios = [
  'https://files.catbox.moe/hpwsi2.mp3',
  'https://files.catbox.moe/xci982.mp3',
  'https://files.catbox.moe/utbujd.mp3',
  'https://files.catbox.moe/w2j17k.m4a',
  'https://files.catbox.moe/851skv.m4a',
  'https://files.catbox.moe/qnhtbu.m4a',
  'https://files.catbox.moe/lb0x7w.mp3',
  'https://files.catbox.moe/efmcxm.mp3',
  'https://files.catbox.moe/wdap4t.mp3',
  'https://files.catbox.moe/26oeeh.mp3',
  'https://files.catbox.moe/a1sh4u.mp3',
  'https://files.catbox.moe/vuuvwn.m4a',
  'https://files.catbox.moe/wx8q6h.mp3',
  'https://files.catbox.moe/uj8fps.m4a',
  'https://files.catbox.moe/dc88bx.m4a'
];

// 🔁 Get random audio
const randomAudio = () => audios[Math.floor(Math.random() * audios.length)];

zokou({
  nomCom: "ping",
  categorie: "Dave-New"
}, async (chatId, zk, { ms, userJid }) => {
  const time = moment().format("HH:mm:ss");
  const date = moment().format("DD/MM/YYYY");
  const ping = Math.floor(Math.random() * 100) + 1;

  try {
    await zk.sendMessage(chatId, {
      audio: { url: randomAudio() },
      mimetype: "audio/mp4",
      ptt: true,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363400480173280@newsletter",
          newsletterName: "DAVE-XMD updates",
          serverMessageId: 143
        },
        forwardingScore: 999,
        externalAdReply: {
          title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
          body: `💦 Pong: ${ping}ms\n📅 *Date:* ${date}\n⏰ *Time:* ${time}`,
          thumbnailUrl: "https://files.catbox.moe/lidsgj.jpg",
          mediaType: 1,
          renderSmallThumbnail: true
        }
      }
    }, { quoted: ms });
  } catch (err) {
    console.log("❌ Ping Command Error:", err);
    repondre("❌ Error: " + err);
  }
});

zokou({
  nomCom: "repo",
  categorie: "Dave-General",
  reaction: "💦",
  nomFichier: __filename
}, async (dest, zk, commandeOptions) => {
  const { pushname, repondre } = commandeOptions;
  const githubRepo = 'https://api.github.com/repos/giftdee/DAVE-XMD';

  try {
    const response = await axios.get(githubRepo);
    const data = response.data;

    const created = moment(data.created_at).format("DD/MM/YYYY");
    const updated = moment(data.updated_at).format("DD/MM/YYYY");

    const gitdata = `> *ɴᴀᴍᴇ:*    ${conf.BOT}\n\n> *sᴛᴀʀs:*  ${data.stargazers_count}\n\n> *ғᴏʀᴋs:*  ${data.forks_count}\n\n> *ᴡᴀᴛᴄʜᴇʀs:*  ${data.watchers}\n\n> *ᴜᴘᴅᴀᴛᴇᴅ:*  ${updated}\n\n> *Repo:* ${data.html_url}\n\n_Powered by DAVE TECH_`;

    await zk.sendMessage(dest, {
      image: { url: 'https://files.catbox.moe/lidsgj.jpg' },
      caption: gitdata,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 updates",
          serverMessageId: -1
        },
        forwardingScore: 999,
        externalAdReply: {
          title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
          body: "💦 DAVE-XMD repo link request 💦",
          thumbnailUrl: "https://files.catbox.moe/lidsgj.jpg",
          mediaType: 1,
          sourceUrl: data.html_url || "https://github.com/giftdee/DAVE-XMD"
        }
      }
    });

    await zk.sendMessage(dest, {
      audio: { url: randomAudio() },
      mimetype: "audio/mp4",
      ptt: true,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363400480173280@newsletter",
          newsletterName: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 updates",
          serverMessageId: -1
        }
      }
    });

  } catch (e) {
    console.error("Error fetching data:", e);
    await repondre("❌ Error fetching repository data. Please try again later.");
  }
});
