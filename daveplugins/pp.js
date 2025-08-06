const { zokou } = require('../framework/zokou');
const gis = require('g-i-s');
const conf = require(__dirname + '/../set');
const { generateProfilePicture } = require("../framework/dl/Function");
const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');


// Request for image dowload 
zokou({
  nomCom: "img",
  aliases: ["image", "images"],
  categorie: "Images",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Which image?');
    return;
  }

  const searchTerm = arg.join(" ");
  gis(searchTerm, (error, results) => sendImage(error, results));

  function sendImage(error, results) {
    if (error) {
      repondre("Oops, an error occurred.");
      return;
    }

    if (!results || results.length === 0) {
      repondre("No images found.");
      return;
    }

    for (let i = 0; i < Math.min(results.length, 5); i++) {
      zk.sendMessage(dest, {
        image: { url: results[i].url },
        caption: `DOWNLOAD AND ENJOY BY 🛡️𝐃𝐀𝐕𝐄-𝐗𝐌𝐃🛡️`,
        contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363400480173280@newsletter',
         newsletterName: "DAVE-XMD updates",
         serverMessageId: 143,
          }
        }
      }, { quoted: ms });
    }
  }
});
