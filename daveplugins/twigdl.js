const { zokou } = require("../framework/zokou");
const { default: axios } = require('axios');

const DAVE_XMD = "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃";

// Twitter Download Command
zokou({ nomCom: "twitter", categorie: 'Download', reaction: "🐦" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  let twitterUrl = arg.join(' ').trim();
  if (!twitterUrl && ms.quoted && ms.quoted.text) {
    twitterUrl = ms.quoted.text.trim();
  }

  if (!twitterUrl) {
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Please provide a Twitter link 🚫
│❒ Example: .twitter https://twitter.com/elonmusk/status/1234567890
◈━━━━━━━━━━━━━━━━◈
    `);
  }

  const twitterRegex = /^https:\/\/(twitter|x)\.com\/[\w-]+\/status\/\d+/;
  if (!twitterRegex.test(twitterUrl)) {
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Invalid Twitter link format 🚫
│❒ Example: https://twitter.com/user/status/1234567890
◈━━━━━━━━━━━━━━━━◈
    `);
  }

  try {
    const apiUrl = `https://api.giftedtech.web.id/api/download/aiodl2?apikey=gifted&url=${encodeURIComponent(twitterUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.success || response.data.status !== 200) {
      return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Failed to download Twitter media 😓
│❒ Error: ${response.data.message || 'Unknown error'}
◈━━━━━━━━━━━━━━━━◈
      `);
    }

    const media = response.data.result;
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Twitter Download Success 🐦
│❒ Title: ${media.title || 'No title available'}
│❒ Type: ${media.type || 'unknown'}
│❒ URL: ${media.download_url}
◈━━━━━━━━━━━━━━━━◈
    `);
  } catch (error) {
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Error downloading Twitter media 😓
│❒ Error: ${error.message || 'Unknown error'}
◈━━━━━━━━━━━━━━━━◈
    `);
  }
});

// Instagram Download Command
zokou({ nomCom: "ig", categorie: 'Download', reaction: "📸" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  let igUrl = arg.join(' ').trim();
  if (!igUrl && ms.quoted && ms.quoted.text) {
    igUrl = ms.quoted.text.trim();
  }

  if (!igUrl) {
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Please provide an Instagram link 🚫
│❒ Example: .ig https://www.instagram.com/reel/C9bjQfRprHK/
◈━━━━━━━━━━━━━━━━◈
    `);
  }

  const igRegex = /^https:\/\/(www\.)?instagram\.com\/(reel|p|tv)\/[\w-]+/;
  if (!igRegex.test(igUrl)) {
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Invalid Instagram link format 🚫
│❒ Example: https://www.instagram.com/reel/C9bjQfRprHK/
◈━━━━━━━━━━━━━━━━◈
    `);
  }

  try {
    const apiUrl = `https://api.giftedtech.web.id/api/download/instadl?apikey=gifted&type=video&url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.success || response.data.status !== 200) {
      return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Failed to download Instagram media 😓
│❒ Error: ${response.data.message || 'Unknown error'}
◈━━━━━━━━━━━━━━━━◈
      `);
    }

    const media = response.data.result;
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Instagram Download Success 📸
│❒ Type: ${media.type || 'unknown'}
│❒ URL: ${media.download_url}
◈━━━━━━━━━━━━━━━━◈
    `);
  } catch (error) {
    return repondre(`
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Error downloading Instagram media 😓
│❒ Error: ${error.message || 'Unknown error'}
◈━━━━━━━━━━━━━━━━◈
    `);
  }
});