const { zokou } = require('../framework/zokou');
const fetch = require('node-fetch');
const s = require("../set");

zokou({
  nomCom: "praytime",
  alias: ["prayertimes", "prayertime", "ptime"],
  desc: "Get prayer times, weather & location info — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
  categorie: "God",
  reaction: "✅",
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre, args }) => {
  try {
    const city = args.length ? args.join(" ") : "bhakkar";
    const apiUrl = `https://api.nexoracle.com/islamic/prayer-times?city=${encodeURIComponent(city)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) return repondre("❌ Failed to fetch prayer times, try again later.");

    const data = await response.json();
    if (data.status !== 200) return repondre("❌ Could not get prayer times. Please check the city name.");

    const prayerTimes = data.result.items[0];
    const weather = data.result.today_weather;
    const location = data.result.city;

    let message = `*🕌 Prayer Times for ${location}, ${data.result.state}*\n\n`;
    message += `📍 *Location*: ${location}, ${data.result.state}, ${data.result.country}\n`;
    message += `🕋 *Method*: ${data.result.prayer_method_name}\n\n`;

    message += `🌅 *Fajr*: ${prayerTimes.fajr}\n`;
    message += `🌄 *Shurooq*: ${prayerTimes.shurooq}\n`;
    message += `☀️ *Dhuhr*: ${prayerTimes.dhuhr}\n`;
    message += `🌇 *Asr*: ${prayerTimes.asr}\n`;
    message += `🌆 *Maghrib*: ${prayerTimes.maghrib}\n`;
    message += `🌃 *Isha*: ${prayerTimes.isha}\n\n`;

    message += `🧭 *Qibla Direction*: ${data.result.qibla_direction}°\n`;

    const temp = weather.temperature !== null ? `${weather.temperature}°C` : 'N/A';
    message += `🌡️ *Temperature*: ${temp}\n`;

    await zk.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/8fy6up.jpg' },
      caption: message,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐏𝐫𝐚𝐲𝐞𝐫𝐓𝐢𝐦𝐞',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

    // Optional prayer time audio
    await zk.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/xci982.mp3' },
      mimetype: 'audio/mp3',
      ptt: false
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    repondre("❌ Error fetching prayer times and weather.");
  }
});