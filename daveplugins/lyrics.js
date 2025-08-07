const util = require('util');
const { zokou } = require(__dirname + '/../framework/zokou');
const axios = require('axios');

zokou(
  {
    nomCom: 'lyrics',
    categorie: 'Dave-search',
    reaction: '🎵',
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    try {
      if (!arg[0]) {
        return repondre(
          `🔥 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 🔥\n\n❒ Yo ${nomAuteurMessage}, don’t test my patience 🥱\n❒ Dave said send legit songs like *Ochuodho*, not random trash 😏\n❒ Try: .lyrics Faded`
        );
      }

      const query = arg.join(' ').trim();
      await repondre(
        `🎧 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 🎧\n\n❒ Hold tight ${nomAuteurMessage}, fetching lyrics for *${query}* like a real boss 🔍`
      );

      const apiUrl = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success || !data.result) {
        return repondre(
          `💀 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 💀\n\n❒ Bruh ${nomAuteurMessage}, I searched the streets — no lyrics for *${query}* 🚫\n❒ Try a real hit next time 🔁`
        );
      }

      const lyrics = data.result.trim();
      if (!lyrics) {
        return repondre(
          `😤 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 😤\n\n❒ Damn ${nomAuteurMessage}, lyrics for *${query}* are missing in action 🔍\n❒ Send better heat next round 🔥`
        );
      }

      let formattedLyrics = lyrics;
      if (formattedLyrics.length > 4000) {
        formattedLyrics = formattedLyrics.slice(0, 4000) + '... [Too hot for full drop]';
      }

      await zk.sendMessage(
        dest,
        {
          text: `🎤 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 🎤\n\n❒ Boom 💥 ${nomAuteurMessage}, here’s the lyrics to *${query}*:\n\n${formattedLyrics}\n\n➥ Powered by your OG, Gifted Dave 😎`,
        },
        { quoted: ms }
      );
    } catch (e) {
      console.error('Lyrics error:', e);
      await repondre(
        `💢 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 💢\n\n❒ Yo ${nomAuteurMessage}, something crashed while grinding the bars 😵‍💫\n❒ Error: ${e.message}`
      );
    }
  }
);
