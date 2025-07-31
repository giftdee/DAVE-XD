const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
{
nomCom: ['alive', 'uptime', 'runtime'],
categorie: 'General',
reaction: "⚡"
},
async (dest, zk, { ms, arg, repondre, superUser }) => {
const data = await getDataFromAlive();
const time = moment().tz('Etc/GMT').format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');
const mode = (s.MODE.toLowerCase() === "yes") ? "public" : "private";

if (!arg || !arg[0]) {
let aliveMsg;

if (data) {    
        const { message, lien } = data;    
        aliveMsg = `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ *🔥 𝔗𝔬𝔵𝔦𝔠 𝔐𝔇 𝐢𝐬 𝐀𝐋𝐈𝐕𝐄, Yo!* 🔥\n│❒ *👑 𝐎𝐰𝐧𝐞𝐫*: ${s.OWNER_NAME}\n│❒ *🌐 𝐌𝐨𝐝𝐞*: ${mode}\n│❒ *📅 𝐃𝐚𝐭𝐞*: ${date}\n│❒ *⏰ 𝐓𝐢𝐦𝐞 (GMT)*: ${time}\n│❒ *💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞*: ${message}\n│❒ *🤖 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧*\n◈━━━━━━━━━━━━━━━━◈`;    
        try {    
            if (lien) {    
                if (lien.match(/\.(mp4|gif)$/i)) {    
                    await zk.sendMessage(dest, {     
                        video: { url: lien },     
                        caption: aliveMsg     
                    }, { quoted: ms });    
                } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {    
                    await zk.sendMessage(dest, {     
                        image: { url: lien },     
                        caption: aliveMsg     
                    }, { quoted: ms });    
                } else {    
                    repondre(aliveMsg);    
                }    
            } else {    
                repondre(aliveMsg);    
            }    
        } catch (e) {    
            console.error("Error:", e);    
            repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ OOPS! 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 failed to show off: ${e.message} 😡 Try again! 😣\n◈━━━━━━━━━━━━━━━━◈`);    
        }    
    } else {    
        aliveMsg = `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ *🔥 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃  𝐢𝐬 𝐀𝐋𝐈𝐕𝐄, bois!* 🔥\n│❒ *👑 𝐎𝐰𝐧𝐞𝐫*: ${s.OWNER_NAME}\n│❒ *🌐 𝐌𝐨𝐝𝐞*: ${mode}\n│❒ *📅 𝐃𝐚𝐭𝐞*: ${date}\n│❒ *⏰ 𝐓𝐢𝐦𝐞 (GMT)*: ${time}\n│❒  Yo, I'm 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃, ready to vibe😎\n│❒ *🤖 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐕𝐄*\n◈━━━━━━━━━━━━━━━━◈`;    
        repondre(aliveMsg);    
    }    
} else {    
    if (!superUser) {     
        repondre(`𝐃𝐀𝐕𝐄-�{𝐗M𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ 🛑 bois, only 𝐃𝐀𝐕𝐄 can mess with 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃’s vibe! 😡\n◈━━━━━━━━━━━━━━━━◈`);     
        return;    
    }    

    const [texte, tlien] = arg.join(' ').split(';');    
    await addOrUpdateDataInAlive(texte, tlien);    
    repondre(`𝐃�{𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ ✅ 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 is alive ! 🔥\n◈━━━━━━━━━━━━━━━━◈`);    
}

}

);

  
