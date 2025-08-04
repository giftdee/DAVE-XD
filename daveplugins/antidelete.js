const { zokou } = require('../framework/zokou');
const fs = require('fs');

let antiDeleteActive = false; // Variable to store the state of the anti-delete command

zokou({
  nomCom: "anti-delete",
  categorie: "General",
  reaction: "😏"
}, async (originMessage, zk, commandOptions) => {
  const { ms, arg } = commandOptions;

  // Check if an argument is provided to turn on or off the command
  if (arg[0]) {
    const action = arg[0].toLowerCase();
    if (action === "on") {
      antiDeleteActive = true;
      await zk.sendMessage(originMessage, "Anti-delete command is now *enabled*.");
      return;
    } else if (action === "off") {
      antiDeleteActive = false;
      await zk.sendMessage(originMessage, "Anti-delete command is now *disabled*.");
      return;
    }
  }

  // Check if anti-delete is active
  if (!antiDeleteActive) {
    await zk.sendMessage(originMessage, "Anti-delete is currently *disabled*.");
    return;
  }

  // Detect deleted message
  if (
    ms.message.protocolMessage &&
    ms.message.protocolMessage.type === 0 &&
    (conf.ADM).toLowerCase() === 'yes'
  ) {
    if (ms.key.fromMe || ms.message.protocolMessage.key.fromMe) {
      console.log('Deleted message was from the bot. Skipping...');
      return;
    }

    console.log('A message was deleted.');
    const key = ms.message.protocolMessage.key;

    try {
      const storePath = './store.json';
      const data = fs.readFileSync(storePath, 'utf8');
      const jsonData = JSON.parse(data);
      const messages = jsonData.messages[key.remoteJid];

      let msg;

      for (let i = 0; i < messages.length; i++) {
        if (messages[i].key.id === key.id) {
          msg = messages[i];
          break;
        }
      }

      if (!msg) {
        console.log('Deleted message not found in store.');
        return;
      }

      const senderId = msg.key.participant.split('@')[0];
      const caption = `🛡️ *Anti-delete triggered by DAVE-XMD*\nMessage from @${senderId}`;
      const imageCaption = {
        image: { url: './media/deleted-message.jpg' },
        caption,
        mentions: [msg.key.participant]
      };

      await zk.sendMessage(idBot, imageCaption);
      await zk.sendMessage(idBot, { forward: msg }, { quoted: msg });

    } catch (error) {
      console.error("Error retrieving deleted message:", error);
    }
  }
});
