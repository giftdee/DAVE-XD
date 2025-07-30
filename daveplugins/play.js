const { zokou } = require('../framework/zokou');
const yts = require('yt-search');
const axios = require('axios');

zokou({
  nomCom: 'play',
  categorie: 'join',
  reaction: '🎧'
}, async (msg, sock, { ms, repondre, arg }) => {

  if (!arg[0]) return repondre('𝗣𝗹𝗲𝗮𝘀𝗲 insert a song name.');

  try {
    const songName = arg.join(' ');
    repondre('𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 searching for the song 🎵');

    const searchResults = await yts(songName);
    const videos = searchResults.videos;

    if (videos.length === 0)
      return repondre('𝗡𝗼 audio found. Try a different song! 😕');

    const video = videos[0];
    const url = video.url;

    const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted&url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status === 200 && data.success) {
      const audioUrl = data.result.download_url;

      await sock.sendMessage(msg, {
        audio: { url: audioUrl },
        mimetype: 'audio/mp4'
      }, { quoted: ms });

      await sock.sendMessage(msg, {
        text: '𝗝𝗼𝗶𝗻 for updates https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k'
      }, { quoted: ms });
    } else {
      repondre('𝗙𝗮𝗶𝗹𝗲𝗱 to download audio. Try again later. 😓');
    }
  } catch (err) {
    console.error('Error:', err);
    repondre('𝗔𝗻 error occurred while processing your request. 😵');
  }
});