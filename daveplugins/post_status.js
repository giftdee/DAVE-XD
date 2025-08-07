const { zokou } = require('../framework/zokou');
const { OWNER_NUMBER } = require('../set'); // wherever you store owner numbers

zokou({
  nomCom: "tostatus",
  alias: ["poststatus", "status", "story", "repost", "reshare"],
  react: '📝',
  desc: "Posts replied media to bot's status",
  categorie: "Dave-Mods",
  filename: __filename
}, async (dest, zk, { ms, msgRepondu, arg, sender }) => {
  try {
    if (!OWNER_NUMBER.includes(sender)) {
      return await zk.sendMessage(dest, {
        text: "*📛 This is an owner-only command.*"
      }, { quoted: ms });
    }

    const quoted = msgRepondu || ms;
    const mimeType = (quoted.msg || quoted).mimetype || '';

    if (!mimeType) {
      return await zk.sendMessage(dest, {
        text: "*❗Please reply to an image, video, or audio.*"
      }, { quoted: ms });
    }

    const buffer = await zk.downloadMediaMessage(quoted);
    const mtype = quoted.mtype;
    const caption = quoted.text || '';

    let statusContent = {};

    switch (mtype) {
      case "imageMessage":
        statusContent = { image: buffer, caption };
        break;
      case "videoMessage":
        statusContent = { video: buffer, caption };
        break;
      case "audioMessage":
        statusContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quoted.ptt || false
        };
        break;
      default:
        return await zk.sendMessage(dest, {
          text: "Only *image*, *video*, or *audio* files can be posted to status."
        }, { quoted: ms });
    }

    await zk.sendMessage("status@broadcast", statusContent);

    await zk.sendMessage(dest, {
      text: "✅ Status uploaded successfully!"
    }, { quoted: ms });

  } catch (error) {
    console.error("Status Error:", error);
    await zk.sendMessage(dest, {
      text: "❌ Failed to post status:\n" + error.message
    }, { quoted: ms });
  }
});
