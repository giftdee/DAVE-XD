const { zokou } = require('../framework/zokou');
const axios = require('axios');

zokou({
  nomCom: "terminate",
  categorie: "Dave-Mods",
  reaction: "🔄",
  nomFichier: __filename
}, async (dest, zk, { isBotAdmins, isAdmins, isOwner, repondre }) => {
  try {
    if (!dest.endsWith("@g.us")) return repondre("❌ This command can only be used in groups.");
    if (!isBotAdmins) return repondre("❌ I need admin privileges to modify group settings.");
    if (!isAdmins && !isOwner) return repondre("❌ Only group admins or the bot owner can use this command.");

    const groupName = "🔥 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐂𝐋𝐀𝐍 🔥";
    const imageUrl = "https://i.imgur.com/pvIedwX.jpeg";
    const groupDescription = `
🌟 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝗖𝗹𝗮𝗻! 🌟

Where power meets code and legends unite.

⚡ Rise with 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 — crafting bots, creating history.

🔥 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐅𝐨𝐫𝐞𝐯𝐞𝐫! 🔥
    `;

    await zk.groupUpdateSubject(dest, groupName);
    repondre(`✅ Group name updated to: ${groupName}`);

    await zk.groupUpdateDescription(dest, groupDescription.trim());
    repondre("✅ Group description updated successfully.");

    if (imageUrl.startsWith("http")) {
      try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data, "binary");

        if (buffer.length === 0) return repondre("❌ Failed to download the image. The file is empty.");

        await zk.updateProfilePicture(dest, buffer);
        repondre("✅ Group profile picture updated successfully.");
      } catch (error) {
        repondre(`❌ Failed to download or set the group profile picture: ${error.message}`);
      }
    } else {
      repondre("❌ Invalid image URL provided.");
    }
  } catch (error) {
    repondre(`❌ Error updating group settings: ${error.message}`);
  }
});