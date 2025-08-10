const { zokou } = require("../framework/zokou");
const { default: axios } = require('axios');

const BOT_NAME = "DAVE-XMD";

// === Twitter Download ===
zokou({ nomCom: "twitter", categorie: "Dave-Download", reaction: "🐦" }, async (dest, zk, { repondre, arg, ms }) => {
  // Get link from args or quoted text
  let link = arg.join(" ").trim();
  if (!link && ms.quoted?.text) {
    link = ms.quoted.text.trim();
  }

  // No link provided
  if (!link) {
    return repondre(`${BOT_NAME}\n\nPlease give a Twitter link.\nExample: .twitter https://twitter.com/user/status/12345`);
  }

  // Check if link is valid
  const validLink = /^https:\/\/(twitter|x)\.com\/[\w-]+\/status\/\d+/;
  if (!validLink.test(link)) {
    return repondre(`${BOT_NAME}\n\nInvalid Twitter link.\nExample: https://twitter.com/user/status/12345`);
  }

  try {
    const api = `https://api.giftedtech.web.id/api/download/aiodl2?apikey=gifted&url=${encodeURIComponent(link)}`;
    const res = await axios.get(api);

    if (!res.data.success || res.data.status !== 200) {
      return repondre(`${BOT_NAME}\n\nFailed to download from Twitter.\nError: ${res.data.message || "Unknown error"}`);
    }

    const media = res.data.result;
    return repondre(`${BOT_NAME}\n\nTwitter Download Success ✅\nTitle: ${media.title || "No title"}\nType: ${media.type || "Unknown"}\nURL: ${media.download_url}`);
  } catch (err) {
    return repondre(`${BOT_NAME}\n\nError: ${err.message || "Unknown error"}`);
  }
});

// === Instagram Download ===
zokou({ nomCom: "ig", categorie: "Dave-Download", reaction: "📸" }, async (dest, zk, { repondre, arg, ms }) => {
  // Get link from args or quoted text
  let link = arg.join(" ").trim();
  if (!link && ms.quoted?.text) {
    link = ms.quoted.text.trim();
  }

  // No link provided
  if (!link) {
    return repondre(`${BOT_NAME}\n\nPlease give an Instagram link.\nExample: .ig https://www.instagram.com/reel/ABC123`);
  }

  // Check if link is valid
  const validLink = /^https:\/\/(www\.)?instagram\.com\/(reel|p|tv)\/[\w-]+/;
  if (!validLink.test(link)) {
    return repondre(`${BOT_NAME}\n\nInvalid Instagram link.\nExample: https://www.instagram.com/reel/ABC123`);
  }

  try {
    const api = `https://api.giftedtech.web.id/api/download/instadl?apikey=gifted&type=video&url=${encodeURIComponent(link)}`;
    const res = await axios.get(api);

    if (!res.data.success || res.data.status !== 200) {
      return repondre(`${BOT_NAME}\n\nFailed to download from Instagram.\nError: ${res.data.message || "Unknown error"}`);
    }

    const media = res.data.result;
    return repondre(`${BOT_NAME}\n\nInstagram Download Success ✅\nType: ${media.type || "Unknown"}\nURL: ${media.download_url}`);
  } catch (err) {
    return repondre(`${BOT_NAME}\n\nError: ${err.message || "Unknown error"}`);
  }
});