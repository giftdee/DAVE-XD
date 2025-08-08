const util = require('util');
const { zokou } = require(__dirname + '/../framework/zokou');
const axios = require('axios');

zokou(
  {
    nomCom: 'fancy',
    categorie: 'Dave-Tools',
    reaction: '✨',
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    try {
      console.log('DEBUG - fancy triggered:', { arg, nomAuteurMessage });

      if (!arg[0]) {
        return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ YO ${nomAuteurMessage}, DON’T BE BLAND! Give me some text, like .fancy davw! 😡\n◈━━━━━━━━━━━━━━━━◈`);
      }

      const text = arg.join(' ').trim();
      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, jazzing up "${text}" like a pro! 🔍\n◈━━━━━━━━━━━━━━━━◈`);

      const apiUrl = `https://api.giftedtech.web.id/api/tools/fancy?apikey=gifted&text=${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success || !data.results || data.results.length === 0) {
        return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ OOPS, ${nomAuteurMessage}! No fancy styles for "${text}"! Try something cooler! 😣\n◈━━━━━━━━━━━━━━━━◈`);
      }

      // Pick a random stylized text
      const fancyText = data.results[Math.floor(Math.random() * data.results.length)].result;

      await zk.sendMessage(
        dest,
        {
          text: `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ BOOM, ${nomAuteurMessage}! Your text’s now a masterpiece! 🔥\n│❒ Fancy Text: ${fancyText}\n│❒ Powered by Gifted_dave\n◈━━━━━━━━━━━━━━━━◈`,
          footer: `Hey ${nomAuteurMessage}! I'm 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃, created by gifted_dave 😎`,
        },
        { quoted: ms }
      );

    } catch (e) {
      console.error('Fancy text error:', e);
      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL FLOP, ${nomAuteurMessage}! Something crashed: ${e.message} 😡 Fix it or bounce! 😣\n◈━━━━━━━━━━━━━━━━◈`);
    }
  }
);
