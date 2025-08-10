const {
  zokou
} = require("../framework/zokou");
const axios = require("axios");

zokou({
  nomCom: "getcmd",
  categorie: "Dave-System",
  reaction: "🛠"
}, async (dest, zk, commandeOptions) => {
  const {
    repondre,
    ms,
    arg,
    prefixe,
    nomAuteurMessage,
    auteurMessage
  } = commandeOptions;
  
  // Aggressive owner verification
  const OWNER_JID = "254111687009@s.whatsapp.net";
  const senderJid = auteurMessage || ms.key.participant || ms.key.remoteJid;
  
  // Strict owner check - works in both groups and DMs
  if (senderJid !== OWNER_JID) {
    return repondre(`𝐎𝐰𝐧𝐞𝐫 𝐎𝐧𝐥𝐲!\n\nThis command is restricted to the bot owner (@${OWNER_JID.split("@")[0]}).`);
  }

  if (!arg || arg.length === 0) {
    return repondre(`𝐄𝐱𝐚𝐦𝐩𝐥𝐞: ${prefixe}getcmd logo.js\n\nPlease provide a filename to retrieve from the plugins repo!`);
  }

  const filename = arg.join(" ").trim();
  if (!filename.endsWith(".js")) {
    return repondre("𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐅𝐢𝐥𝐞𝐧𝐚𝐦𝐞!\n\nPlease use a .js file name (e.g., logo.js).");
  }

  const repoOwner = "giftdee";
  const repoName = "DAVE-XMD";
  const folder = "daveplugins";
  const fileUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folder}/${filename}`;

  try {
    repondre(`𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐬 𝐨𝐟 "${filename}"...`);
    const response = await axios.get(fileUrl);
    const fileContent = response.data;
    
    const resultMessage = `
━━━━━━━━━━━━━━━━━━━
  🛠 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐅𝐢𝐥𝐞 𝐑𝐞𝐭𝐫𝐢𝐞𝐯𝐚𝐥 ⚡️

> 𝐅𝐢𝐥𝐞𝐧𝐚𝐦𝐞: *${filename}*
> 𝐒𝐨𝐮𝐫𝐜𝐞: 𝐆𝐢𝐭𝐇𝐮𝐛 𝐑𝐞𝐩𝐨

\`\`\`javascript
${fileContent}
\`\`\`

━━━━━━━━━━━━━━━━━━━
P𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 gifted_dave
O𝐰𝐧𝐞r: gifted_dave
`;
    await zk.sendMessage(dest, {
      text: resultMessage
    }, {
      quoted: ms
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    let errorMessage = "E𝐫𝐫o𝐫 r𝐞𝐭r𝐢𝐞v𝐢ng f𝐢𝐥e!";
    if (error.response && error.response.status === 404) {
      errorMessage = `F𝐢𝐥e "${filename}" no𝐭 fo𝐮nd in the r.e𝐩.o!`;
    } else {
      errorMessage += `\nD.e𝐭.a𝐢.l.s: ${error.message}`;
    }
    repondre(errorMessage);
  }
});

module.exports = {
  zokou: zokou
};