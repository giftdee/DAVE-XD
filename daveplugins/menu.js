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

    try {
      await repondre(
        `🔍 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nFetching profile pic of @${auteurMsgRepondu.split("@")[0]}...`,
        { mentions: [auteurMsgRepondu] }
      );

      let ppuser;
      try {
        ppuser = await zk.profilePictureUrl(auteurMsgRepondu, 'image');
      } catch {
        ppuser = mybotpic();
        await repondre(
          `⚠️ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nCouldn't access @${auteurMsgRepondu.split("@")[0]}'s profile picture. Sending default bot image.`,
          { mentions: [auteurMsgRepondu] }
        );
      }

      await zk.sendMessage(
        dest,
        {
          image: { url: ppuser },
          caption: `📷 *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nHere's the profile pic of @${auteurMsgRepondu.split("@")[0]}`,
          footer: `🤖 Powered by Gifted Dave`,
          mentions: [auteurMsgRepondu],
        },
        { quoted: ms }
      );

    } catch (error) {
      console.error("Error in .getpp command:", error);
      await repondre(
        `❌ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*\n\nAn error occurred while fetching the profile picture.\n> _${error.message}_`
      );
    }
  }
);
