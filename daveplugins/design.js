const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "gen",
    reaction: "💥",
    categorie: "Dave-Images",
  },
  async (jid, sock, data) => {
    const { repondre, arg, ms } = data;

    try {
      if (!arg || arg.length === 0) {
        return repondre("Please describe your image and DAVE-XMD will generate it.");
      }

      const prompt = arg.join(" ");
      const imageUrl = `https://www.samirxpikachu.run.place/ArcticFL?prompt=${encodeURIComponent(prompt)}`;

      const message = {
        image: { url: imageUrl },
        caption: "*powered by gifted_dave*",
      };

      const options = {
        quoted: ms,
      };

      await sock.sendMessage(jid, message, options);

    } catch (err) {
      console.error("Error:", err.message || "Unknown error");
      repondre("Oops, an error occurred while processing your request");
    }
  }
);
