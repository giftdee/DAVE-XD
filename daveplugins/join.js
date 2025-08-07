const { zokou } = require("../framework/zokou");

const DAVE_XMD = "DAVE-XMD";

zokou({ nomCom: "join", categorie: 'Dave-User', reaction: "⭐" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Extract invite link
  let inviteLink = arg.join(' ').trim();
  if (!inviteLink && ms.quoted && ms.quoted.text) {
    inviteLink = ms.quoted.text.trim();
  }

  if (!inviteLink) {
    const message = `
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Please provide a valid WhatsApp group invite link 🚫
│❒ Example: .join https://chat.whatsapp.com/ABC123xyz
◈━━━━━━━━━━━━━━━━◈
    `;
    return repondre(message);
  }

  // Validate invite link format
  const whatsappRegex = /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]+/;
  if (!whatsappRegex.test(inviteLink)) {
    const message = `
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Invalid WhatsApp group link 🚫
│❒ Please provide a valid WhatsApp group invite link, e.g., https://chat.whatsapp.com/ABC123xyz
◈━━━━━━━━━━━━━━━━◈
    `;
    return repondre(message);
  }

  try {
    const inviteCode = inviteLink.split('https://chat.whatsapp.com/')[1];
    const groupId = await zk.groupAcceptInvite(inviteCode);
    const groupMetadata = await zk.groupMetadata(groupId);
    const groupName = groupMetadata.subject;

    const message = `
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Successfully joined group 🤝
│❒ Group name: ${groupName}
│❒ Link: ${inviteLink}
◈━━━━━━━━━━━━━━━━◈
    `;
    return repondre(message);
  } catch (error) {
    const errorMessage = `
${DAVE_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ Failed to join group: ${error.message} 😓
│❒ Please check the link and try again.
◈━━━━━━━━━━━━━━━━◈
    `;
    return repondre(errorMessage);
  }
});
