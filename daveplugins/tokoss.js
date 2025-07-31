const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: 'info',
    categorie: 'General',
    reaction: '🗿'
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefix, nomAuteurMessage } = commandeOptions;

    try {
      // Group and Channel links
      const groupLink = 'https://chat.whatsapp.com/LNkkXQ1rDv3GQNFFbqLoMe?mode=ac_t';
      const channelLink = 'https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k';

      // Prepare the info message content
      const infoMsg = `
𝐃𝐀𝐕𝐄-𝐗𝐌𝐃

◈━━━━━━━━━━━━━━━━◈
│❒ Yo ${nomAuteurMessage}, here’s the dope on 𝔗𝔬𝔵𝔦𝔠 𝔐𝔇! 🔥
│❒ *📩 𝐆𝐫𝐨𝐮𝐩*: ${groupLink}
│❒ *📢 𝐂𝐡𝐚𝐧𝐧𝐞𝐥*: ${channelLink}
│❒ In need of vibe? Use *${prefix}owner*! 💱
│❒ Powered by kn_dave
◈━━━━━━━━━━━━━━━━◈
      `;

      // Send the info message
      await zk.sendMessage(
        dest,
        {
          text: infoMsg,
          footer: `Hey ${nomAuteurMessage}! I'm DAVE-XMD, created by Gifted_Dave⚠️`
        },
        { quoted: ms }
      );

    } catch (error) {
      console.error("Error in info command:", error.stack);
      await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL BUST, ${nomAuteurMessage}! 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃  tripped while dropping the info: ${error.message} 😡 Try again or flop! 😣\n◈━━━━━━━━━━━━━━━━◈`);
    }
  }
);
