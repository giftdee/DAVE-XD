const { zokou } = require("../framework/zokou");

// 𝐔𝐭𝐢𝐥𝐢𝐭𝐢𝐞𝐻 𝐌𝐨𝐝𝐮𝐥𝐞
// 𝐏�(o𝐰𝐞𝐫�(e𝐝 𝐛𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧

// Store bot message keys for the current chat
let botMessages = {};


const set = require('../set');
const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: "delete",
    aliases: ["del"],
    reaction: "❌",
    categorie: "Group",
    desc: "Delete a quoted message"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, verifAdmin, superUser, msgRepondu } = commandeOptions;

    if (!superUser && !verifAdmin) {
      return repondre("❌ Only bot owner or group admin can delete messages.");
    }

    if (!msgRepondu) {
      return repondre("⚠️ Reply to the message you want to delete.");
    }

    try {
      const key = {
        remoteJid: dest,
        fromMe: false,
        id: msgRepondu.key.id,
        participant: msgRepondu.key.participant
      };

      await zk.sendMessage(dest, { delete: key });
      repondre("✅ 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃: Message deleted.");
    } catch (e) {
      console.error(e);
      repondre("❌ Error deleting message.");
    }
  }
);

















zokou(
  {
    nomCom: "clear",
    aliases: ["delete", "del"],
    categorie: "Dave-Mods",
    reaction: "⚡",
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;

    // Initialize message tracking for this chat if not already
    if (!botMessages[dest]) {
      botMessages[dest] = [];
    }

    try {
      // Send initial message and store its key
      const message = await zk.sendMessage(
        dest,
        { text: "𝐂𝐥𝐞𝐚𝐫𝐢𝐧𝐠 𝐛𝐨𝐭 𝐦𝐞𝐻𝐇𝐚𝐠𝐞𝐻 𝐢𝐧 𝐭𝐡𝐢𝐇 𝐜𝐡𝐚𝐭..." },
        { quoted: ms }
      );
      botMessages[dest].push(message.key);

      // Delete all tracked bot messages in this chat
      let deletedCount = 0;
      for (const key of botMessages[dest]) {
        try {
          await zk.sendMessage(dest, { delete: key });
          deletedCount++;
          // Small delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (e) {
          console.error("Failed to delete message:", e);
        }
      }

      // Clear the tracked messages after deletion
      botMessages[dest] = [];

      // Send confirmation (won't be tracked to avoid infinite loop)
      await zk.sendMessage(
        dest,
        {
          text: `𝐒𝐮𝐜𝐜�(e𝐇𝐇𝐟𝐮𝐥𝐥𝐲 𝐜𝐥𝐞𝐚𝐫𝐞𝐝 ${deletedCount} 𝐛𝐨𝐭 𝐦𝐞𝐻𝐇�(a𝐠𝐞${deletedCount === 1 ? "" : "𝐻"}!\n\n𝐏𝐨𝐰�(e𝐫�(e𝐝 𝐛𝐲 gifted_dave`,
        },
        { quoted: ms }
      );
    } catch (error) {
      console.error("Error clearing messages:", error);
      repondre(
        `𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢�(l�(e 𝐜𝐥�(e𝐚𝐫𝐢𝐧𝐠 𝐦�(e𝐇𝐇𝐚𝐠�(e𝐇: ${error.message}`
      );
    }
  }
);

module.exports = { zokou };
