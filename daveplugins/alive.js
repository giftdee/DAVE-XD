const util = require("util");
const { zokou } = require('../framework/zokou');
const { format } = require(__dirname + "/../framework/mesfonctions");
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const fs = require("fs");
const path = require("path");

zokou(
  {
    nomCom: 'alive',
    categorie: 'General'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser } = commandeOptions;
    const data = await getDataFromAlive();

    // 🌍 Set default timezone
    moment.tz.setDefault('Etc/GMT');
    const timeNow = moment().format('HH:mm:ss');
    const dateNow = moment().format('DD/MM/YYYY');
    const mode = s.MODE.toLowerCase() === 'yes' ? 'public' : 'private';

    if (!arg || !arg[0] || arg.join('') === '') {
      if (data) {
        const { message, lien } = data;

        const aliveText = `
╭━━ ⪩ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 ⪨ ━━╮
┃ 🧑 Owner: ${s.OWNER_NAME}
┃ 🤖 Bot: ${s.bot}
┃ 🛠 Mode: ${mode}
┃ 📅 Date: ${dateNow}
┃ 🕒 Time: ${timeNow} GMT
┃ 🌍 Location: Global
╰━━━━━━━━━━━━━━━━━━╯

${message || 'Bot is running smoothly ✅'}
`;

        try {
          if (lien?.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, { video: { url: lien }, caption: aliveText }, { quoted: ms });
          } else if (lien?.match(/\.(jpeg|jpg|png)$/i)) {
            await zk.sendMessage(dest, { image: { url: lien }, caption: aliveText }, { quoted: ms });
          } else {
            await repondre(aliveText);
          }

          // 🎵 Send random audio after the text/media
          const randomNum = Math.floor(Math.random() * 9) + 1;
          const audioPath = path.join(__dirname, '..', 'kn_dave', `menu${randomNum}.mp3`);

          if (fs.existsSync(audioPath)) {
            await zk.sendMessage(dest, {
              audio: { url: audioPath },
              audio: { url: audioPath },
              mimetype: "audio/mpeg",
              ptt: true
            }, { quoted: ms });
          }
        } catch (err) {
          console.error("❌ Error sending alive message:", err);
          repondre("❌ Failed to send alive message. Check your media URL or file.");
        }
      } else {
        if (!superUser) {
          return repondre("⚠️ No alive message saved. Only the owner can set it.");
        }
        repondre("ℹ️ Use `.alive message;lien` to save a custom alive message and image/video.");
      }
    } else {
      if (!superUser) {
        return repondre("❌ Only the owner can update the alive message.");
      }

      const inputText = arg.join(' ').split(';')[0];
      const inputLink = arg.join(' ').split(';')[1];

      if (!inputText || !inputLink) {
        return repondre("⚠️ Invalid format. Use: `.alive your_message;media_url`");
      }

      await addOrUpdateDataInAlive(inputText, inputLink);
      repondre("✅ Alive message saved successfully.");
    }
  }
);
