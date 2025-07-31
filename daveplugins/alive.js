const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const process = require("process");

zokou(
  {
    nomCom: ['alive', 'uptime', 'runtime'],
    categorie: 'General',
    reaction: "⚡"
  },
  async (dest, zk, { repondre }) => {
    const uptimeMs = process.uptime() * 1000;
    const duration = moment.duration(uptimeMs);
    const uptimeFormatted = `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`;

    const msg = `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 UPTIME: ${uptimeFormatted}`;
    await repondre(msg);
  }
);
