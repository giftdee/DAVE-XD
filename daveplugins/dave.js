const { zokou } = require("../framework/zokou");
const { default: axios } = require("axios");

zokou({
  nomCom: "pair",
  aliases: ["session", "pair", "paircode", "qrcode"],
  reaction: '♂️',
  categorie: "General"
}, async (messageOrigin, zk, options) => {
  const {
    repondre: reply,
    arg: args
  } = options;

  try {
    if (!args || args.length === 0) {
      return reply("Example Usage: .pair 254700000000");
    }

    await reply("*Wait, 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 is generating your pair code ✅...*");

    const encodedNumber = encodeURIComponent(args.join(" "));
    const apiURL = `https://xdtoxicpairing2.onrender.com/code?number=${encodedNumber}`;

    const response = await axios.get(apiURL);
    const data = response.data;

    if (data && data.code) {
      const pairCode = data.code;
      await reply(`${pairCode}`);
      await reply("Here is your pair code. Copy and paste it into WhatsApp's 'Link Device' screen.");
    } else {
      throw new Error("Invalid response from API.");
    }

  } catch (err) {
    console.error("Error getting API response:", err.message);
    reply("Error getting response from API.");
  }
});
