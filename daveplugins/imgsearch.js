const { zokou } = require(__dirname + '/../framework/zokou');
const axios = require('axios');

zokou(
  {
    nomCom: 'img',
    categorie: 'Dave-Images',
    reaction: '📸',
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    try {
      if (!arg[0]) {
        return repondre(
          `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n❒ YO ${nomAuteurMessage}, give me something to search! Example:\n  .img cat`
        );
      }

      const query = arg.join(' ').trim();
      const apiUrl = `https://api.giftedtech.web.id/api/search/googleimage?apikey=gifted&query=${encodeURIComponent(query)}`;

      await repondre(
        `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n❒ Searching 🔍 for **${query}**... hang tight, ${nomAuteurMessage}!`
      );

      const { data } = await axios.get(apiUrl);

      if (!data.success || !data.results || data.results.length === 0) {
        return repondre(
          `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n❒ No images found for **${query}**. Try another search.`
        );
      }

      // If results are objects, pick a random and get the 'url' key
      const randomImage = data.results[Math.floor(Math.random() * data.results.length)];
      const imageUrl = typeof randomImage === 'string' ? randomImage : randomImage.url;

      await zk.sendMessage(
        dest,
        {
          image: { url: imageUrl },
          caption: `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n❒ Here’s your **${query}** image, ${nomAuteurMessage}! 🔥\n\nPowered by Gifted_dave`,
        },
        { quoted: ms }
      );

    } catch (e) {
      console.error('Image search error:', e);
      repondre(
        `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n❒ Error: ${e.message}`
      );
    }
  }
);