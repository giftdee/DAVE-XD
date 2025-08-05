const { zokou } = require("../framework/zokou");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const { repondre } = require(__dirname + "/../framework/context");

async function downloadFromApis(apis) {
  for (const api of apis) {
    try {
      const response = await axios.get(api, { timeout: 15000 });
      console.log(`Response from ${api}:\n`, JSON.stringify(response.data, null, 2));

      const result = response.data;
      const isSuccess = result?.success || result?.status || result?.result?.download_url || result?.result?.url;

      if (isSuccess && result.result) {
        return result;
      }
    } catch (error) {
      console.warn(`API ${api} failed:`, error.message);
    }
  }
  throw new Error('Failed to retrieve download URL from all sources.');
}

// .play2 or .song command
zokou(
  {
    nomCom: "play",
    categorie: "Downloader",
    reaction: "📥",
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg, verifDroitAdmin, nomAuteurMessage, userJid } = commandeOptions;

    const query = arg.join(" ");
    if (!query) return repondre("❌ Please provide the name of the song.");

    const video = await searchYouTube(query);
    if (!video) return repondre("❌ Song not found.");

    const thumbnail = video.thumbnail || conf.URL || "";
    await zk.sendMessage(dest, {
      text: "⬇️ Downloading audio... This may take a moment...",
      contextInfo: getContextInfo("Downloading", userJid, thumbnail)
    }, { quoted: ms });

    const apis = [
      `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?url=${encodeURIComponent(video.url)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(video.url)}`
    ];

    try {
      const downloadData = await downloadFromApis(apis);
      const download_url = downloadData.result.download_url || downloadData.result.url;
      const title = downloadData.result.title || video.title || "Audio";

      await zk.sendMessage(dest, {
        audio: { url: download_url },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: getContextInfo(title, userJid, thumbnail)
      }, { quoted: ms });

    } catch (e) {
      repondre("❌ Failed to download audio. Try again later.");
    }
  }
);

// .video command
zokou(
  {
    nomCom: "video",
    categorie: "Download",
    reaction: "📥",
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg, verifDroitAdmin, nomAuteurMessage, userJid } = commandeOptions;

    const query = arg.join(" ");
    if (!query) return repondre("❌ Please provide the name of the video.");

    const video = await searchYouTube(query);
    if (!video) return repondre("❌ Video not found.");

    const thumbnail = video.thumbnail || conf.URL || "";
    await zk.sendMessage(dest, {
      text: "⬇️ Downloading video... Please wait...",
      contextInfo: getContextInfo("Downloading", userJid, thumbnail)
    }, { quoted: ms });

    const apis = [
      `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`,
      `https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(video.url)}`,
      `https://api.giftedtech.web.id/api/download/dlmp4?url=${encodeURIComponent(video.url)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(video.url)}`
    ];

    try {
      const downloadData = await downloadFromApis(apis);
      const download_url = downloadData.result.download_url || downloadData.result.url;
      const title = downloadData.result.title || video.title || "Video";

      await zk.sendMessage(dest, {
        video: { url: download_url },
        mimetype: "video/mp4",
        caption: title,
        contextInfo: getContextInfo(title, userJid, thumbnail)
      }, { quoted: ms });

    } catch (e) {
      repondre("❌ Failed to download video. Try again later.");
    }
  }
);
