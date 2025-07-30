const { zokou } = require("../framework/zokou");
const fetch = require("node-fetch");

zokou({
  nomCom: "weather",
  reaction: "🌡️",
  categorie: "Search"
}, async (m, command, msgSender) => {
  const location = command.join(" ");
  if (!location) {
    return m.reply("🌍 Please provide a location to check the weather.");
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`);
    const data = await res.json();

    if (!data || data.cod !== 200) {
      return m.reply("⚠️ Location not found. Please check the spelling.");
    }

    const city = data.name;
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const rain = data.rain ? data.rain['1h'] : 0;
    const cloudiness = data.clouds.all;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;
    const country = data.sys.country;

    await m.reply(
      `*🌦️ DAVE-XMD WEATHER UPDATES*\n\n` +
      `📍 *Location:* ${city}, ${country}\n` +
      `🌡️ *Temperature:* ${temp}°C\n` +
      `📝 *Description:* ${description}\n` +
      `💧 *Humidity:* ${humidity}%\n` +
      `💨 *Wind Speed:* ${windSpeed} m/s\n` +
      `🌧️ *Rain (1h):* ${rain} mm\n` +
      `☁️ *Cloudiness:* ${cloudiness}%\n` +
      `🌄 *Sunrise:* ${sunrise}\n` +
      `🌅 *Sunset:* ${sunset}\n` +
      `🗺️ *Coordinates:* ${latitude}, ${longitude}\n\n` +
      `🛠 *Powered by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*`
    );
  } catch (err) {
    console.error(err);
    m.reply("❌ Failed to fetch weather data. Try again later.");
  }
});