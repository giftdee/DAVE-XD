const {
  zokou
} = require("./../framework/zokou");
const {
  format,
  runtime
} = require('../framework/mesfonctions');
const os = require('os');
const speed = require('performance-now');
const {
  performance
} = require('perf_hooks');
const conf = require('../set');

zokou(
  {
    nomCom: 'ping',
    categorie: 'General',
    reaction: '🌟',
    alias: ['p']
  },

  async (dest, zk, commandOptions) => {
    const {
      ms, arg, repondre
    } = commandOptions;
    const start = new Date().getTime();
    const msg = await zk.sendMessage(dest, {
      text: '*Testing Ping!!!*',
    }, {
      quoted: ms
    });
    const end = new Date().getTime();
    const ping = end - start;
    await zk.sendMessage(dest, {
      text: `*Pong*
 *${ping} ms*`, edit: {
        id: msg.key.id, remoteJid: dest
      }});
    await zk.sendMessage(dest, {
      react: {
        text: "⚙️", key: ms.key
      }})
  }
)


zokou({
  nomCom: "ping2",
  desc: "Check bot response speed",
  categorie: "General",
  reaction: "🌟",
  fromMe: true
}, async (dest, zk, { repondre, ms }) => {
    try {
       
        let loadingMsg = await zk.sendMessage(dest, { 
            text: "𝐓𝐞𝐬𝐭𝐢𝐧𝐠 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧..."
        }, { quoted: ms });

        // Simulate a single processing step
        await sleep(500);

        // Measure ping
        const timestamp = speed();
        await sleep(200);
        const pingResult = (speed() - timestamp).toFixed(2);

        // Determine connection quality
        let quality = "";
        if (pingResult < 100) quality = "𝐄𝐱𝐜𝐞𝐥𝐥𝐞𝐧𝐭";
        else if (pingResult < 300) quality = "𝐆𝐨𝐨𝐝";
        else if (pingResult < 600) quality = "𝐅𝐚𝐢𝐫";
        else quality = "𝐒𝐥𝐨𝐰";

       
        const resultMessage = `𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐓𝐢𝐦𝐞⚡: ${pingResult} 𝐦𝐬\n

𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐐𝐮𝐚𝐥𝐢𝐭𝐲🖥️: ${quality}\n`;

        // Update the initial message with the result
        await zk.sendMessage(dest, {
            text: resultMessage,
            edit: loadingMsg.key
        });

    } catch (error) {
        console.error("Ping error:", error);
        await repondre("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐭𝐞𝐬𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.");
    }
});

// Uptime command with simplified display and fancy font
zokou({
  nomCom: "uptime",
  desc: "Check bot runtime",
  categorie: "General",
  reaction: "🌟",
  fromMe: true
}, async (dest, zk, { repondre }) => {
    const formatRuntime = (seconds) => {
        seconds = Number(seconds);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor(seconds % 86400 / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const secs = Math.floor(seconds % 60);

        return `𝐔𝐩𝐭𝐢𝐦𝐞: ${days > 0 ? days + " 𝐝𝐚𝐲" + (days === 1 ? "" : "𝐬") + ", " : ""}${hours > 0 ? hours + " 𝐡𝐨𝐮𝐫" + (hours === 1 ? "" : "𝐬") + ", " : ""}${minutes > 0 ? minutes + " 𝐦𝐢𝐧𝐮𝐭𝐞" + (minutes === 1 ? "" : "𝐬") + ", " : ""}${secs > 0 ? secs + " 𝐬𝐞𝐜𝐨𝐧𝐝" + (secs === 1 ? "" : "𝐬") : ""}`;
    };

    await repondre(formatRuntime(process.uptime()));
});

// Screenshot command with minimal changes and fancy font
zokou({
  nomCom: "ss",
  desc: "Take website screenshot",
  categorie: "General",
  reaction: "📸",
  fromMe: true
}, async (dest, zk, { ms, arg, repondre }) => {
    if (!arg || arg.length === 0) {
        return repondre("𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐰𝐞𝐛𝐬𝐢𝐭𝐞 𝐔𝐑𝐋.");
    }

    try {
        const loadingMsg = await repondre("𝐂𝐚𝐩𝐭𝐮𝐫𝐢𝐧𝐠 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭...");

        const url = arg.join(" ");
        const apiUrl = `https://api.maher-zubair.tech/misc/sstab?url=${encodeURIComponent(url)}&dimension=720x720`;

        await sleep(1500);

        const screenshot = await getBuffer(apiUrl);

        await zk.sendMessage(dest, {
            image: screenshot,
            caption: `𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭 𝐨𝐟 ${url}`
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            delete: loadingMsg.key
        });

    } catch (error) {
        console.error("Screenshot error:", error);
        repondre("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐚𝐩𝐭𝐮𝐫𝐞 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭.");
    }
});

zokou(
  {
    nomCom: 'desc',
    reaction: '🌟',
    alias: ['General']
  },

  async (dest, zk, commandOptions) => {
    const { ms, arg, repondre } = commandOptions;

    const tumbUrl = 'https://files.catbox.moe/l8t446.mp4';
    const used = process.memoryUsage();
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
      return cpu;
    });
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total;
      last.speed += cpu.speed / length;
      last.times.user += cpu.times.user;
      last.times.nice += cpu.times.nice;
      last.times.sys += cpu.times.sys;
      last.times.idle += cpu.times.idle;
      last.times.irq += cpu.times.irq;
      return last;
    }, {
      speed: 0,
      total: 0,
      times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
    });

    let timestamp = speed();
    let latensi = speed() - timestamp;
    let neww = performance.now();
    let oldd = performance.now();

    const response = `
Response Speed ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}

💻 Info Server
    RAM: ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}

_NodeJS Memory Usage_
    ${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
    ${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
    ${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
    `.trim();

    await zk.sendMessage(dest, {
      text: response,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: `${conf.BOT}`,
          body: `${latensi.toFixed(4)} Second`,
          thumbnailUrl: `${tumbUrl}`,
          sourceUrl: global.link,
          mediaType: 1,
          renderLargerThumbnail: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: "DAVE-XMD Updates",
          serverMessageId: 143
        }
      }
    }, { quoted: ms });
  }
);

zokou(
  {
    nomCom: 'runtime',
    reaction: '🌟',
    alias: ['General']
  },
  async (dest, zk, commandOptions) => {
    const { ms } = commandOptions;
    const tumbUrl = 'https://files.catbox.moe/l8t446.mp4';
    const runtimetext = `🚨 *Bot Has Been Running For ${runtime(process.uptime())}* 🚨`;

    await zk.sendMessage(dest, {
      text: runtimetext,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: `${conf.BOT}`,
          body: `「 RUNTIME 」`,
          thumbnailUrl: tumbUrl,
          sourceUrl: global.link,
          mediaType: 1,
          renderLargerThumbnail: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: "DAVE-XMD Updates",
          serverMessageId: 143
        }
      }
    }, { quoted: ms });
  }
);
