const { zokou } = require('../framework/zokou');

zokou({ nomCom: "btest", categorie: "Dave-General", reaction: "🛠️" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe } = commandeOptions;

  console.log(`[DEBUG] btest triggered by ${ms.key.participant || ms.key.remoteJid} in ${dest}`);

  
  const userName = ms.pushName || "Tester";

  
  if (!verifGroupe) {
    console.log(`[DEBUG] btest: Not a group chat`);
    repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ HEY, ${userName}! 😡 This works better in a group, but fine, let’s test these buttons! 🚀\n◈━━━━━━━━━━━━━━━━◈`);
  }

  // Prepare button message
  const buttonMessage = {
    contentText: `�zach𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ WELCOME, ${userName}! 😎 Time to test the POWER of 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃!\n│❒ Pick a button and unleash the chaos! 💥\n│❒ Powered by Gifted_dave\n◈━━━━━━━━━━━━━━━━◈`,
    footerText: "DAVE-XMD Testing Suite",
    buttons: [
      {
        buttonId: `ping_${ms.key.id}`,
        buttonText: { displayText: "⚡ Ping" },
        type: 1
      },
      {
        buttonId: `owner_${ms.key.id}`,
        buttonText: { displayText: "👑 Owner" },
        type: 1
      }
    ],
    headerType: 1,
viewOnce: true,
  };

  console.log(`[DEBUG] btest: Button message prepared:`, JSON.stringify(buttonMessage, null, 2));

  try {
    // Send button message
    await zk.sendMessage(dest, buttonMessage, ms);
    console.log(`[DEBUG] btest: Button message sent successfully`);
  } catch (e) {
    console.log(`[DEBUG] btest: Error sending button message: ${e.message}`);
   
    await repondre(`𝐃𝐀𝐕𝐄-�{𝐗M𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ THIS IS INFURIATING, ${userName}! 😤 Buttons failed: ${e.message}!\n│❒ Try these instead: .ping ⚡ or .owner 👑\n│❒ I’ll SMASH THIS TRASH SYSTEM! 🚫\n◈━━━━━━━━━━━━━━━━◈`);
  }
});
