const { zokou } = require("../framework/zokou");
const {getAllSudoNumbers,isSudoTableNotEmpty} = require("../bdd/sudo")
const conf = require("../set");

zokou({ nomCom: "owner", categorie: "Dave-General", reaction: "💦" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let msg = `*My Super-User*\n\n*Owner Number*\n- 🌟 @${conf.NUMERO_OWNER}\n\n------ *Other Sudos* -----\n`;

        let sudos = await getAllSudoNumbers();

        for (const sudo of sudos) {
            if (sudo) {
                let sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `- 💼 @${sudonumero}\n`;
            }
        }

        const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        const mentionedJid = sudos.map(sudo => sudo.replace(/[^0-9]/g, '') + "@s.whatsapp.net").concat([ownerjid]);

        zk.sendMessage(dest, {
            image: { url: mybotpic() },
            caption: msg,
            mentions: mentionedJid
        });
    } else {
        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:' + conf.OWNER_NAME + '\n' +
            'ORG:undefined;\n' +
            'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' +
            'END:VCARD';

        zk.sendMessage(dest, {
            contacts: {
                displayName: conf.OWNER_NAME,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});


zokou({ nomCom: "dev", categorie: "Dave-General", reaction: "💘" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
        { nom: "Gifted_dave", numero: "254111687009" },
        { nom: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐃𝐞𝐯", numero: "254104260236" }
    ];

    let message = `╔════◇ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑𝐒* ◇════╗\n\n`;
    message += `*🚀 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐨𝐮𝐫 𝐝𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫𝐬 𝐟𝐨𝐫 𝐬𝐮𝐩𝐩𝐨𝐫𝐭:*\n\n`;
    
    for (const dev of devs) {
        message += `• *${dev.nom}*: https://wa.me/${dev.numero}\n`;
    }
    
    message += `\n*╚═══════ ✾*𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*✾═══════╝`;

    try {
        const lien = mybotpic();
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(
                dest,
                { 
                    video: { url: lien }, 
                    caption: message 
                },
                { quoted: ms }
            );
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
            await zk.sendMessage(
                dest,
                { 
                    image: { url: lien }, 
                    caption: message 
                },
                { quoted: ms }
            );
        } else {
            await repondre(message);
        }
    } catch (e) {
        console.error("❌ 𝐄𝐫𝐫𝐨𝐫:", e);
        repondre("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐝𝐞𝐯 𝐥𝐢𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.");
    }
});

zokou({ nomCom: "support", categorie: "Dave-General", reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions; 

    const supportMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃    💦 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 💦
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💦 Thank you for choosing
┃    *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 WhatsApp Bot!*
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔗 *Support Links* ⤵️
┃
┃ 📢 Channel:
┃ https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k
┃
┃ 👥 Support Group:
┃ https://chat.whatsapp.com/LNkkXQ1rDv3GQNFFbqLoMe?mode=ac_t
┃
┃ 🎬 YouTube:
┃ https://youtube.com/@davlodavlo19
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💦 Powered by *Gifted_dave*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    `;

    await repondre(supportMessage);
    await zk.sendMessage(
        auteurMessage,
        {
            text: `*📩 Support links sent to your DM!*\n\nPlease join our community for updates and support.`
        },
        { quoted: ms }
    );
});
