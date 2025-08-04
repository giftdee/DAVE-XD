const { zokou } = require("../framework/zokou");
const { getSettings, updateSetting } = require("../lib/database/settings");

zokou(
  {
    nomCom: "autolike",
    categorie: "automation",
    desc: "Toggle auto-like for status updates",
    fromMe: true,
  },
  async (zk, m, args) => {
    try {
      const settings = await getSettings();

      if (!settings || Object.keys(settings).length === 0) {
        return await zk.sendMessage(
          m.chat,
          { text: "⚠️ No settings found in database." },
          { quoted: m }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === "on" || value === "off") {
        const isOn = value === "on";
        if (settings.autolike === isOn) {
          return await zk.sendMessage(
            m.chat,
            { text: `Autolike is already ${value.toUpperCase()}.` },
            { quoted: m }
          );
        }

        await updateSetting("autolike", isOn);
        return await zk.sendMessage(
          m.chat,
          { text: `✅ Autolike has been turned ${value.toUpperCase()}.` },
          { quoted: m }
        );
      }

      // If no args provided
      return await zk.sendMessage(
        m.chat,
        {
          text: `Current status: Autolike is ${settings.autolike ? "ON 🟢" : "OFF 🔴"}.\n\nUse:\n- autolike on\n- autolike off`,
        },
        { quoted: m }
      );
    } catch (err) {
      console.error(err);
      return await zk.sendMessage(
        m.chat,
        { text: "❌ Error: Could not toggle Autolike." },
        { quoted: m }
      );
    }
  }
);
