const { zokou } = require("../framework/zokou");
const { generateProfilePicture } = require("@whiskeysockets/baileys");
const fs = require("fs");

zokou({
  nomCom: "fullpp",
  aliases: ["updatepp", "ppfull"],
  reaction: '🍂',
  categorie: "Dave-New"
}, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu } = commandeOptions;

  if (!msgRepondu || !msgRepondu.imageMessage) {
    return repondre("❌ Please reply to an *image* to set as bot profile picture.");
  }

  try {
    const mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu);
    const { img } = await generateProfilePicture(mediaPath);

    await zk.updateProfilePicture(zk.user.id, img);

    fs.unlinkSync(mediaPath);
    repondre("✅ Bot profile picture updated successfully.");
  } catch (error) {
    repondre("❌ Failed to update profile picture:\n" + error.message);
  }
});
