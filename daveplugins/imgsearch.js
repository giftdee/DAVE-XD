// img.js
const util = require('util');
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
      console.log('DEBUG - img triggered:', { arg, nomAuteurMessage });

      if (!arg[0]) {
        return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ YO ${nomAuteurMessage}, STOP SLACKING! Give me a query, like .img cat! 😡\n◈━━━━━━━━━━━━━━━━◈`);
      }

      const query = arg.join(' ').trim();
      const apiUrl = `https://api.giftedtech.web.id/api/search/googleimage?apikey=gifted&query=${encodeURIComponent(query)}`;

      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Hold up, ${nomAuteurMessage}! Grabbing your ${query} image like a pro! 🔍\n◈━━━━━━━━━━━━━━━━◈`);

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success || !data.results || data.results.length === 0) {
        return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ NO IMAGES, ${nomAuteurMessage}! Your ${query} query is TRASH! Try again! 😣\n◈━━━━━━━━━━━━━━━━◈`);
      }

      // Pick a random image URL from results
      const imageUrl = data.results[Math.floor(Math.random() * data.results.length)];

      await zk.sendMessage(
        dest,
        {
          image: { url: imageUrl },
          caption: `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ BAM, ${nomAuteurMessage}! Your ${query} image is STRAIGHT FIRE! 🔥\n│❒ Powered by Gifted_dave\n◈━━━━━━━━━━━━━━━━◈`,
          footer: `Hey ${nomAuteurMessage}! I'm DAVE-XMD, created by gifted_dave 😎`,
        },
        { quoted: ms }
      );

    } catch (e) {
      console.error('Image search error:', e);
      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL DISASTER, ${nomAuteurMessage}! Something broke: ${e.message} 😡 Fix it or scram!\n◈━━━━━━━━━━━━━━━━◈`);
    }
  }
);
