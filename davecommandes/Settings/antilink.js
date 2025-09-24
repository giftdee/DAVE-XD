const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;

    const formatStylishReply = (message) => {
      return `◈━━━━━━━━━━━━━━━━◈\n│❒ ${message}\n┗━━━━━━━━━━━━━━━┛`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("Database is fucked, no settings found. Fix it, loser.") },
          { quoted: m, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();
      const isEnabled = settings.antilink === true;

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (isEnabled === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Yo, genius! 😈 Antilink is already ${value.toUpperCase()}! Stop wasting my time, moron. 🖕`) },
            { quoted: m, ad: true }
          );
        }

        await updateSetting('antilink', action);
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Antilink ${value.toUpperCase()}! 🔥 ${action ? 'Links in groups? They’re toast now! 💀' : 'Links can roam free, you’re not worth policing. 😴'}`) },
          { quoted: m, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}antilink on`, buttonText: { displayText: "ON 🥶" }, type: 1 },
        { buttonId: `${prefix}antilink off`, buttonText: { displayText: "OFF 😴" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(`Antilink Status: ${isEnabled ? 'ON 🥶' : 'OFF 😴'}. Pick a vibe, noob! 😈`),
          footer: "> Pσɯҽɾԃ Ⴆყ 𝙳𝙰𝚅𝙴-x𝙳",
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: m, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("Shit broke, couldn’t update antilink. Database or something’s fucked. Try later.") },
        { quoted: m, ad: true }
      );
    }
  });
};