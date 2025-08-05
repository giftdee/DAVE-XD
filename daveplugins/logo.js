const { zokou } = require("../framework/zokou");
const { default: axios } = require("axios");

zokou({
  nomCom: "logo",
  categorie: "Tools",
  reaction: "🔥"
}, async (m, sock, commandInfo) => {
  const { repondre, arg, ms } = commandInfo;

  if (!arg || arg.length === 0) {
    return repondre("Please provide a name to generate the logo.\nExample: `.logo DAVE-XMD`");
  }

  try {
    const name = arg.join(" ");
    const apiUrl = `https://www.api.vyturex.com/api/logo?name=${encodeURIComponent(name)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.result) {
      return repondre("❌ Failed to generate logo. Try a different name.");
    }

    await sock.sendMessage(m, {
      image: { url: data.result },
      caption: `Here is your logo for *${name}*\n_Powered by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃_`
    }, { quoted: ms });

  } catch (error) {
    console.error("Error generating logo:", error.message);
    return repondre("❌ Error while generating logo. Please try again later.");
  }
});
