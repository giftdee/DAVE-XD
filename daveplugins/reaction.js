const axios = require("axios");
const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const { exec } = require("child_process");
const { unlink } = require("fs").promises;

// Sleep helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Converts a GIF buffer to an MP4 video buffer using ffmpeg
const GIFBufferToVideoBuffer = async (gifBuffer) => {
  const fileName = Math.random().toString(36);
  const gifPath = `./${fileName}.gif`;
  const mp4Path = `./${fileName}.mp4`;

  await fs.writeFileSync(gifPath, gifBuffer);

  exec(
    `ffmpeg -i ${gifPath} -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${mp4Path}`
  );

  await sleep(4000); // Wait for ffmpeg to finish

  const videoBuffer = await fs.readFileSync(mp4Path);

  // Clean up temporary files
  Promise.all([unlink(mp4Path), unlink(gifPath)]);

  return videoBuffer;
};

// Generates a command like 'hug', 'kiss', etc.
const generateReactionCommand = (name, emoji = "🎭") => {
  zokou(
    {
      nomCom: name,
      categorie: "Dave-Hentai",
      reaction: emoji,
    },
    async (chatId, client, info) => {
      const {
        auteurMessage: sender,
        auteurMsgRepondu: repliedTo,
        repondre: reply,
        ms: rawMsg,
        msgRepondu: hasReply,
      } = info;

      const apiURL = `https://api.waifu.pics/sfw/${name}`;

      try {
        const response = await axios.get(apiURL);
        const imageUrl = response.data.url;
        const imageBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
        const videoBuffer = await GIFBufferToVideoBuffer(imageBuffer);

        let messageOptions;
        if (hasReply) {
          const caption = `@${sender.split("@")[0]} ${name} @${repliedTo.split("@")[0]}`;
          messageOptions = {
            video: videoBuffer,
            gifPlayback: true,
            caption,
            mentions: [sender, repliedTo],
          };
        } else {
          const caption = `@${sender.split("@")[0]} ${name} everyone`;
          messageOptions = {
            video: videoBuffer,
            gifPlayback: true,
            caption,
            mentions: [sender],
          };
        }

        await client.sendMessage(chatId, messageOptions, { quoted: rawMsg });
      } catch (err) {
        reply("Error fetching data: " + err.message);
        console.error(err);
      }
    }
  );
};

// List of reactions with emojis
generateReactionCommand("bully", "👊");
generateReactionCommand("cuddle", "🤗");
generateReactionCommand("cry", "😢");
generateReactionCommand("hug", "😊");
generateReactionCommand("awoo", "🐺");
generateReactionCommand("kiss", "😘");
generateReactionCommand("lick", "👅");
generateReactionCommand("pat", "👋");
generateReactionCommand("smug", "😏");
generateReactionCommand("bonk", "🔨");
generateReactionCommand("yeet", "🚀");
generateReactionCommand("blush", "😊");
generateReactionCommand("smile", "😄");
generateReactionCommand("wave", "👋");
generateReactionCommand("highfive");
generateReactionCommand("handhold");
generateReactionCommand("nom", "👅");
generateReactionCommand("bite", "🦷");
generateReactionCommand("glomp", "🤗");
generateReactionCommand("slap", "👋");
generateReactionCommand("kill", "💀");
generateReactionCommand("kick", "🦵");
generateReactionCommand("happy", "😄");
generateReactionCommand("wink", "😉");
generateReactionCommand("poke", "👉");
generateReactionCommand("dance", "💃");
generateReactionCommand("cringe", "😬");
