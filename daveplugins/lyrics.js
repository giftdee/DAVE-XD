const util = require('util');
const { zokou } = require('../framework/zokou');
const axios = require('axios');

zokou(
  {
    nomCom: 'lyrics',
    categorie: 'Search',
    reaction: '🎵',
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    try {
      console.log('DEBUG - lyrics triggered:', { arg, nomAuteurMessage });

      if (!arg[0]) {
        return repondre(`YO ${nomAuteurMessage}, please give me song titles like Alan Walker Faded`);
      }

      const query = arg.join(' ').trim();
      await repondre(` Yoh ${nomAuteurMessage}, hunting for "${query}" lyrics like a rockstar! 🔍`);

      const apiUrl = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success || !data.result) {
        return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n│❒ UGH, ${nomAuteurMessage}! No lyrics for "${query}"! Pick a real song! 😣\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈`);
      }

      const lyrics = data.result.trim();
      if (!lyrics) {
        return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\nNO YET, ${nomAuteurMessage}! Lyrics for "${query}" are missing! Try another banger! 😤`);
      }

      // Truncate if too long for WhatsApp (4096 char limit)
      let formattedLyrics = lyrics;
      if (formattedLyrics.length > 4000) {
        formattedLyrics = formattedLyrics.slice(0, 4000) + '... [truncated]';
      }

      await zk.sendMessage(
        dest,
        {
          text: `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n🔥BOOM, ${nomAuteurMessage}! Got the lyrics for "${query}"! 🎤\nLyrics:\n${formattedLyrics}\n\n> Powered by Gifted Dave`,
          footer: `Hey ${nomAuteurMessage}! Here is Lucky Xforce lyrics`,
        },
        { quoted: ms }
      );

    } catch (e) {
      console.error('Lyrics search error:', e);
      await repondre(`EPIC CRASH, ${nomAuteurMessage}! Something blew up: ${e.message} 😡 Get it fixed!`);
    }
  }
);
