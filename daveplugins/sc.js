const { zokou } = require("../framework/zokou");
const { format } = require("../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require("../set");

zokou({ 
    nomCom: "sc", 
    categorie: "General",
    reaction: "📂" 
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, mybotpic, nomAuteurMessage } = commandeOptions;
    
    try {
        const mode = s.MODE.toLowerCase() === "yes" ? "public" : "private";
        moment.tz.setDefault('Etc/GMT');
        const time = moment().format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        const repoInfo = `
𝐃𝐀𝐕𝐄-𝐗𝐌𝐃

◈━━━━━━━━━━━━━━━━◈
│❒ Yo ${nomAuteurMessage}, here’s the lowdown on 𝔗𝔬𝔵𝔦𝔠 𝔐𝔇’s source code! 📂
│❒ *🔗 𝐆𝐢𝐭𝐇𝐮𝐛*: https://github.com/giftdee/DAVE-XMD
│❒ *📢 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐂𝐡𝐚𝐧𝐧𝐞𝐥*: https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k
│❒ *🖥️ 𝐑𝐀𝐌 𝐔𝐬𝐚𝐠𝐞*: ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}
│❒ *🌐 𝐌𝐨𝐝�{e*: ${mode}
│❒ *📅 𝐃𝐚𝐭�{e*: ${date}
│❒ *⏰ 𝐓𝐢�{m𝐞 (GMT)*: ${time}
│❒ *👑 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬*: @254111687009 (kn_dave), @254104260236 (DAVE-XMD)
│❒ Powered by kn_dave
◈━━━━━━━━━━━━━━━━◈
        `;

        const media = mybotpic();
        
        if (media.match(/\.(mp4|gif|jpeg|png|jpg)$/i)) {
            await zk.sendMessage(
                dest,
                { 
                    [media.match(/\.(mp4|gif)$/i) ? 'video' : 'image']: { url: media },
                    caption: repoInfo,
                    footer: `Hey ${nomAuteurMessage}! I'm DAVE-XMD, created by gifted_dave 😎`,
                    mentions: [
                        '254111687009@s.whatsapp.net',
                        '254104260236@s.whatsapp.net'
                    ],
                    gifPlayback: media.match(/\.gif$/i) ? true : undefined
                },
                { quoted: ms }
            );
        } else {
            await repondre(repoInfo);
        }
    } catch (error) {
        console.error("Error in sc command:", error);
        await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL BUST, ${nomAuteurMessage}! 𝔗𝔬𝔵𝔦𝔠 𝔐𝔇 crashed while fetching source code info: ${error.message} 😡 Try again or flop! 😣\n◈━━━━━━━━━━━━━━━━◈`);
    }
});