const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "getpp",
    categorie: "General",
    reaction: "📷",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, msgRepondu, auteurMsgRepondu, mybotpic, nomAuteurMessage } = commandeOptions;

    // Check if the message is a reply
    if (!msgRepondu) {
      return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, reply to someone’s message to snag their profile pic! 😡 Don’t make 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃  do extra work! 🤔\n◈━━━━━━━━━━━━━━━━◈`);
    }

    try {
      // Notify the user that the profile picture is being fetched
      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 \n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃’s hunting for @${auteurMsgRepondu.split("@")[0]}’s profile pic! 📸 Hold tight! 🔍\n◈━━━━━━━━━━━━━━━━◈`, { mentions: [auteurMsgRepondu] });

      // Fetch the profile picture of the replied person
      let ppuser;
      try {
        ppuser = await zk.profilePictureUrl(auteurMsgRepondu, 'image');
      } catch {
        ppuser = mybotpic();
        await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 \n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, @${auteurMsgRepondu.split("@")[0]}’s profile pic is locked tight! 😣 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ’s got you my pic instead! 😎\n◈━━━━━━━━━━━━━━━━◈`, { mentions: [auteurMsgRepondu] });
      }

      // Send the profile picture
      await zk.sendMessage(
        dest,
        {
          image: { url: ppuser },
          caption: `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 \n\n◈━━━━━━━━━━━━━━━━◈\n│❒ BOOM, ${nomAuteurMessage}! Snagged @${auteurMsgRepondu.split("@")[0]}’s profile pic! 🔥\n│❒ Powered by kn_dave\n◈━━━━━━━━━━━━━━━━◈`,
          footer: `Hey ${nomAuteurMessage}! I'm DAVE-XMD, created by gifted_�{dave 😎`,
          mentions: [auteurMsgRepondu],
        },
        { quoted: ms }
      );

    } catch (error) {
      console.error("Error in .getpp command:", error);
      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 \n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL BUST, ${nomAuteurMessage}! 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 crashed while grabbing the pic: ${error.message} 😡 Try again or flop! 😣\n◈━━━━━━━━━━━━━━━━◈`);
    }
  }
);
