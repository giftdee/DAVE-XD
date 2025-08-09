const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "getpp",
    categorie: "Dave-General",
    reaction: "📷",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, msgRepondu, auteurMsgRepondu, mybotpic, nomAuteurMessage } = commandeOptions;

    if (!msgRepondu) {
      return repondre(
        `📸 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nReply to a message to fetch the user's profile picture.`
      );
    }

    let ppuser;
    let caption;
    try {
      ppuser = await zk.profilePictureUrl(auteurMsgRepondu, 'image');
      caption = `📷 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nHere's the profile pic of @${auteurMsgRepondu.split("@")[0]}`;
    } catch {
      ppuser = mybotpic(); // fallback image
      caption = `💠 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nCouldn't access @${auteurMsgRepondu.split("@")[0]}'s profile picture. Sending default bot image.`;
    }

    await zk.sendMessage(
      dest,
      {
        image: { url: ppuser },
        caption,
        footer: `💠 Powered by Gifted Dave`,
        mentions: [auteurMsgRepondu],
      },
      { quoted: ms }
    );
  }
);
