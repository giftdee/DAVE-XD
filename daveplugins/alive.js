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
    nomCom: "alive",
    categorie: "General",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, superUser } = commandeOptions;

    const data = await getDataFromAlive();

    if (!arg || !arg[0] || arg.join("") === "") {
      if (data) {
        const { message, lien } = data;

        const mode = (s.MODE || "").toLowerCase() === "yes" ? "public" : "private";
        moment.tz.setDefault("Etc/GMT");
        const temps = moment().format("HH:mm:ss");
        const date = moment().format("DD/MM/YYYY");

        const alivemsg = `
*Owner* : ${s.OWNER_NAME}
*Mode* : ${mode}
*Date* : ${date}
*Hours (GMT)* : ${temps}
*Bot* : ${s.bot}
*Forks* : ${forks}

${message}

*𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 2025*`;

        // Send media if there's a link
        if (lien?.match(/\.(mp4|gif)$/i)) {
          try {
            await zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
          } catch (e) {
            repondre("🥵 Menu error: " + e);
          }
        } else if (lien?.match(/\.(jpeg|png|jpg)$/i)) {
          try {
            await zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
          } catch (e) {
            repondre("🥵 Menu error: " + e);
          }
        } else {
          await repondre(alivemsg);
        }

        // 🔊 Send random menu audio from kn_dave
        const audioPath = path.join(__dirname, "../kn_dave");
        const files = fs.readdirSync(audioPath).filter(f => /^menu\d\.mp3$/i.test(f));

        if (files.length > 0) {
          const randomAudio = files[Math.floor(Math.random() * files.length)];
          const audioFilePath = path.join(audioPath, randomAudio);

          await zk.sendMessage(dest, { audio: { url: audioFilePath }, mimetype: "audio/mpeg", ptt: true }, { quoted: ms });
        }

      } else {
        if (!superUser) {
          return repondre("🤖 Bot is alive and running 24/7! To customize this message, ask the owner.");
        }
        return repondre("ℹ️ Use `.alive your message;text_or_video_link` to set a custom alive response.");
      }
    } else {
      if (!superUser) {
        return repondre("❌ Only the owner can update the alive message.");
      }

      const texte = arg.join(" ").split(";")[0];
      const tlien = arg.join(" ").split(";")[1];

      await addOrUpdateDataInAlive(texte, tlien);
      repondre("✅ Alive message successfully updated!");
    }
  }
);
