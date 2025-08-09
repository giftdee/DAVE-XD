const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const set = require('../set');

zokou(
  {
    nomCom: "owner",
    aliases: ["user", "creator"],
    reaction: "🦋",
    categorie: "Dave-General",
    desc: "Get owner contact information"
  },
  async (dest, zk, options) => {
    const { repondre, ms } = options;

    try {
      const ownerNumber = set.OWNER_NUMBER; // from set.js
      const ownerName = set.OWNER_NAME;     // from set.js

      const vcard =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        `FN:${ownerName}\n` +
        `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace("+", "")}:${ownerNumber}\n` +
        "END:VCARD";

      // Send vCard contact
      await zk.sendMessage(dest, {
        contacts: {
          displayName: ownerName,
          contacts: [{ vcard }]
        }
      }, { quoted: ms });

      // Send image with owner details
      await zk.sendMessage(dest, {
        image: { url: 'https://files.catbox.moe/nxzaly.jpg' },
        caption: `╭━━〔 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃* 〕━━┈⊷
┃❍╭─────────────·๏
┃❍┃• *Here is the owner details*
┃❍┃• *ɴᴀᴍᴇ* - ${ownerName}
┃❍┃• *ɴᴜᴍʙᴇʀ* ${ownerNumber}
┃❍┃• *𝖵ᴇʀsɪᴏɴ*: 1.0.0
┃❍└───────────┈⊷
╰──────────────┈⊷
> ©𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 BOT`,
        contextInfo: {
          mentionedJid: [`${ownerNumber.replace("+", "")}@s.whatsapp.net`],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363400480173280@newsletter',
            newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 UPDATES',
            serverMessageId: 143
          }
        }
      }, { quoted: ms });

      // Send audio
      await zk.sendMessage(dest, {
        audio: { url: 'https://files.catbox.moe/ddmjyy.mp3' },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: ms });

    } catch (error) {
      console.error(error);
      repondre(`❌ Error: ${error.message}`);
    }
  }
);


zokou({ nomCom: "dev", categorie: "Dave-General", reaction: "💘" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
        { nom: "Gifted_dave", numero: "254111687009" },
        { nom: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐃𝐞𝐯", numero: "254104260236" }
    ];

    let message = `╔════◇ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑𝐒* ◇════╗\n\n`;
    message += `*🚀 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐨𝐮𝐫 𝐝𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬 𝐟𝐨𝐫 𝐬𝐮𝐩𝐩𝐨𝐫𝐭:*\n\n`;
    
    for (const dev of devs) {
        message += `• *${dev.nom}*: https://wa.me/${dev.numero}\n`;
    }
    
    message += `\n*╚═══════ ✾*𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*✾═══════╝`;

    try {
        const lien = mybotpic();
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(
                dest,
                { 
                    video: { url: lien }, 
                    caption: message 
                },
                { quoted: ms }
            );
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
            await zk.sendMessage(
                dest,
                { 
                    image: { url: lien }, 
                    caption: message 
                },
                { quoted: ms }
            );
        } else {
            await repondre(message);
        }
    } catch (e) {
        console.error("❌ 𝐄𝐫𝐫𝐨𝐫:", e);
        repondre("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐝𝐞𝐯 𝐥𝐢𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.");
    }
});

zokou({ nomCom: "support", categorie: "Dave-General", reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions; 

    const supportMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃    💦 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 💦
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💦 Thank you for choosing
┃    *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 WhatsApp Bot!*
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔗 *Support Links* ⤵️
┃
┃ 📢 Channel:
┃ https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k
┃
┃ 👥 Support Group:
┃ https://chat.whatsapp.com/LNkkXQ1rDv3GQNFFbqLoMe?mode=ac_t
┃
┃ 🎬 YouTube:
┃ https://youtube.com/@davlodavlo19
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💦 Powered by *Gifted_dave*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    `;

    await repondre(supportMessage);
    await zk.sendMessage(
        auteurMessage,
        {
            text: `*📩 Support links sent to your DM!*\n\nPlease join our community for updates and support.`
        },
        { quoted: ms }
    );
});