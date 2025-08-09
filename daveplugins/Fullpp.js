const { zokou } = require("../framework/zokou");
const Jimp = require("jimp");
var { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');

zokou(
  {
    nomCom: "pp",
    categorie: "Owner",
    desc: "Change bot profile picture."
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;

    try {
      if (!ms.quoted) return repondre("Reply to an image to set as profile picture.");
      let media = await ms.quoted.download();

      // Read image with Jimp
      const jimp = await Jimp.read(media);
      const min = jimp.getWidth();
      const max = jimp.getHeight();
      const cropped = jimp.crop(0, 0, min, max);

      // Resize image
      const img = await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);

      // Send profile picture update
      await zk.query({
        tag: 'iq',
        attrs: {
          to: S_WHATSAPP_NET,
          type: 'set',
          xmlns: 'w:profile:picture',
        },
        content: [
          {
            tag: 'picture',
            attrs: { type: 'image' },
            content: img,
          },
        ],
      });

      repondre("✅ Profile picture updated successfully.");
    } catch (err) {
      console.error(err);
      repondre(`❌ Failed to change profile picture: ${err.message}`);
    }
  }
);