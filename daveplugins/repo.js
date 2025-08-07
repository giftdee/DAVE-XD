'use strict';

const { zokou } = require("../framework/zokou");
const axios = require('axios');
const moment = require("moment-timezone");
const set = require(__dirname + '/../set');
moment.tz.setDefault('' + set.TIMEZONE);


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
          body: "💦 repo link request 💦",
          thumbnailUrl: "https://files.catbox.moe/lidsgj.jpg",
          mediaType: 1,
          sourceUrl: data.html_url || "https://github.com/giftdee/DAVE-XMD/fork"
        }
      }
    });

    await zk.sendMessage(dest, {
      audio: { url: "https://files.catbox.moe/26oeeh.mp3" },
      mimetype: "audio/mp4",
      ptt: true,
      caption: "*💦 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 song 💦",
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
