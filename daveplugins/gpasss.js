const crypto = require("crypto");
const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "gpass",
  categorie: "Dave-New",
  reaction: "🔐",
  nomFichier: __filename
}, async (dest, zk, commandeOptions) => {
  const { repondre, args, quoted } = commandeOptions;

  try {
    let length = args[0] ? parseInt(args[0]) : 12;
    if (isNaN(length) || length < 8) {
      return repondre("⚠️ Please provide a valid length for the password (minimum 8 characters).");
    }

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset[crypto.randomInt(0, charset.length)];
    }

    await zk.sendMessage(dest, {
      text: `🔐 *Your Strong Password* 🔐\n\nHere is your generated password:\n\n${password}\n\n*Powered by Silva Spark MD*`
    }, { quoted });

  } catch (err) {
    console.error(err);
    repondre("❌ Error generating password: " + err.message);
  }
});