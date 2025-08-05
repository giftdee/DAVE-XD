const { zokou } = require('../framework/zokou');
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const { repondre } = require(__dirname + "/../framework/context");

const catbox = new Catbox();

// Common contextInfo configuration
const getContextInfo = (title = '', userJid = '', thumbnailUrl = '') => ({
  mentionedJid: [userJid],
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363400480173280@newsletter",
    newsletterName: "DAVE-XMD updates",
    serverMessageId: Math.floor(100000 + Math.random() * 900000),
  },
  externalAdReply: {
    showAdAttribution: true,
    title: conf.BOT || 'YouTube Downloader',
    body: title || "Media Downloader",
    thumbnailUrl: thumbnailUrl || conf.URL || '',
    sourceUrl: conf.GURL || '',
    mediaType: 1,
    renderLargerThumbnail: false
  }
});

async function uploadToCatbox(filePath) {
  try {
    if (!fs.existsSync(filePath)) throw new Error("File does not exist");
    const uploadResult = await catbox.uploadFile({ path: filePath });
    return uploadResult || null;
  } catch (error) {
    console.error('Catbox upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

async function searchYouTube(query) {
  try {
    const searchResults = await ytSearch(query);
    if (!searchResults?.videos?.length) {
      throw new Error('No video found for the specified query.');
    }
    return searchResults.videos[0];
  } catch (error) {
    console.error('YouTube search error:', error);
    throw new Error(`YouTube search failed: ${error.message}`);
  }
}

async function downloadFromApis(apis) {
  for (const api of apis) {
    try {
      const response = await axios.get(api, { timeout: 25000 });
      if (response.data?.success && response.data?.result?.download_url) {
        return response.data;
      }
    } catch (error) {
      console.warn(`API ${api} failed:`, error.message);
      continue;
    }
  }
  throw new Error('Failed to retrieve download URL from all sources.');
}

// Audio Download
zokou({
  nomCom: "play2",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "Download",
  reaction: "📥"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, userJid } = commandOptions;

  try {
    if (!arg[0]) return repondre(zk, dest, ms, "Please provide a song name.");

    const query = arg.join(" ");
    const video = await searchYouTube(query);

    await zk.sendMessage(dest, {
      text: "⬇️ Downloading audio... This may take a moment...",
      contextInfo: getContextInfo("Downloading", userJid, video.thumbnail)
    }, { quoted: ms });

    const apis = [
      `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?url=${encodeURIComponent(video.url)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(video.url)}`
    ];

    const downloadData = await downloadFromApis(apis);
    if (!downloadData || !downloadData.result) throw new Error("Invalid response from the API.");

    const { download_url, title } = downloadData.result;

    const messagePayloads = [
      {
        audio: { url: download_url },
        mimetype: 'audio/mp4',
        caption: `🎵 *${title}*`,
        contextInfo: getContextInfo(title, userJid, video.thumbnail)
      },
      {
        document: { url: download_url },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`.replace(/[^\w\s.-]/gi, ''),
        caption: `📁 *${title}* (Document)`,
        contextInfo: getContextInfo(title, userJid, video.thumbnail)
      }
    ];

    for (const payload of messagePayloads) {
      await zk.sendMessage(dest, payload, { quoted: ms });
    }

  } catch (error) {
    console.error('Audio download error:', error);
    repondre(zk, dest, ms, `Download failed: ${error.message}`);
  }
});

// Video Download
zokou({
  nomCom: "video",
  aliases: ["videodoc", "film", "mp4"],
  categorie: "Download",
  reaction: "📥"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, userJid } = commandOptions;

  try {
    if (!arg[0]) return repondre(zk, dest, ms, "Please provide a video name.");

    const query = arg.join(" ");
    const video = await searchYouTube(query);

    await zk.sendMessage(dest, {
      text: "⬇️ Downloading video... This may take a moment...",
      contextInfo: getContextInfo("Downloading", userJid, video.thumbnail)
    }, { quoted: ms });

    const apis = [
      `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`,
      `https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(video.url)}`,
      `https://api.giftedtech.web.id/api/download/dlmp4?url=${encodeURIComponent(video.url)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(video.url)}`
    ];

    const downloadData = await downloadFromApis(apis);
    if (!downloadData || !downloadData.result) throw new Error("Invalid response from the API.");

    const { download_url, title } = downloadData.result;

    const messagePayloads = [
      {
        video: { url: download_url },
        mimetype: 'video/mp4',
        caption: `🎥 *${title}*`,
        contextInfo: getContextInfo(title, userJid, video.thumbnail)
      },
      {
        document: { url: download_url },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`.replace(/[^\w\s.-]/gi, ''),
        caption: `📁 *${title}* (Document)`,
        contextInfo: getContextInfo(title, userJid, video.thumbnail)
      }
    ];

    for (const payload of messagePayloads) {
      await zk.sendMessage(dest, payload, { quoted: ms });
    }

  } catch (error) {
    console.error('Video download error:', error);
    repondre(zk, dest, ms, `Download failed: ${error.message}`);
  }
});

// Media Upload via URL
zokou({
  nomCom: 'url-link',
  categorie: "📥Download",
  reaction: '👨🏿‍💻'
}, async (dest, zk, commandOptions) => {
  const { msgRepondu, userJid, ms } = commandOptions;

  try {
    if (!msgRepondu || !msgRepondu.message) {
      return repondre(zk, dest, ms, "Please mention an image, video, or audio.");
    }

    const mediaTypes = [
      'videoMessage', 'gifMessage', 'stickerMessage',
      'documentMessage', 'imageMessage', 'audioMessage'
    ];

    const mediaType = mediaTypes.find(type => msgRepondu.message?.[type]);
    if (!mediaType) {
      return repondre(zk, dest, ms, "Unsupported media type.");
    }

    const mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.message[mediaType]);
    const fileUrl = await uploadToCatbox(mediaPath);
    await fs.unlink(mediaPath); // async delete

    await zk.sendMessage(dest, {
      text: `✅ Here's your file URL:\n${fileUrl}`,
      contextInfo: getContextInfo("Upload Complete", userJid)
    });

  } catch (error) {
    console.error("Upload error:", error);
    repondre(zk, dest, ms, `Upload failed: ${error.message}`);
  }
});
