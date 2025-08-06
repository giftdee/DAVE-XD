const { zokou } = require('../framework/zokou');
const fs = require('fs');
const { getAnti, setAnti } = require('../bdd/antidel');

zokou({
    pattern: "antidelete",
    alias: ['antidel', 'del'],
    desc: "Toggle anti-delete feature",
    category: "Mods",
    filename: __filename
},
async (conn, mek, m, { from, reply, text, isCreator }) => {
    if (!isCreator) return reply('This command is only for the bot owner');

    try {
        const currentStatus = await getAnti();

        if (!text || text.toLowerCase() === 'status') {
            return reply(`*AntiDelete Status:* ${currentStatus ? '✅ ON' : '❌ OFF'}\n\nUsage:\n• .antidelete on - Enable\n• .antidelete off - Disable`);
        }

        const action = text.toLowerCase().trim();

        if (action === 'on') {
            await setAnti(true);
            return reply('✅ Anti-delete has been enabled');
        } 
        else if (action === 'off') {
            await setAnti(false);
            return reply('❌ Anti-delete has been disabled');
        } 
        else {
            return reply('Invalid command. Usage:\n• .antidelete on\n• .antidelete off\n• .antidelete status');
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("An error occurred while processing your request.");
    }
});

// Work for Blocklist contacts 
zokou({
  nomCom: "blocklist",
  aliases: ["listblock", "blacklist"],
  reaction: '🍂',
  categorie: "Mods"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  try {
    // Fetch the blocklist of contacts
    let blocklist = await zk.fetchBlocklist();

    // If the blocklist has users, proceed
    if (blocklist.length > 0) {
      // Start the message for blocked contacts
      let jackhuh = `*Blocked Contacts*\n`;

      await repondre(`You have blocked ${blocklist.length} contact(s), fetching and sending their details!`);

      // Map through the blocklist to fetch each blocked user's details
      const promises = blocklist.map(async (blockedUser) => {
        // Extract the phone number from the JID (remove '@s.whatsapp.net')
        const phoneNumber = blockedUser.split('@')[0];

        // Add the blocked user's phone number to the message
        jackhuh += `🤷  +${phoneNumber}\n`;  // List the phone number
      });

      // Wait for all the promises to complete
      await Promise.all(promises);

      // Send the final formatted message with the blocked contacts
      await repondre(jackhuh);
    } else {
      // If no blocked users, reply with a message
      await repondre("There are no blocked contacts.");
    }
  } catch (e) {
    // Catch any error and inform the user
    await repondre("An error occurred while accessing blocked users.\n\n" + e);
  }
});
