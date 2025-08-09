const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");

zokou({ nomCom: "owner", categorie: "Dave-General", reaction: "❣️" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let msg = `╔════◇ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝐎𝐖𝐍𝐄𝐑𝐒* ◇════╗\n\n`;

        msg += `*👑 𝐌𝐚𝐢𝐧 𝐎𝐰𝐧𝐞𝐫:*\n• @254111687009\n\n`;
        msg += `*🌟 𝐒𝐞𝐜𝐨𝐧𝐝𝐚𝐫𝐲 𝐎𝐰𝐧𝐞𝐫:*\n• @254104260236\n\n`;

        let sudos = await getAllSudoNumbers();
        if (sudos.length > 0) {
            msg += `───── *𝐎𝐭𝐡𝐞𝐫 𝐒𝐮𝐝𝐨𝐬* ─────\n`;
            for (const sudo of sudos) {
                if (sudo) {
                    const sudonumero = sudo.replace(/[^0-9]/g, '');
                    if (!['254111687009', '254104260236'].includes(sudonumero)) {
                        msg += `• @${sudonumero}\n`;
                    }
                }
            }
        }
        msg += `╚════◇ *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃* ◇════╝`;

        const mentionedJid = [
            '254111687009@s.whatsapp.net',
            '254104260236@s.whatsapp.net',
            ...sudos.map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        ].filter(num => !['254111687009', '254104260236'].includes(num.replace(/@s\.whatsapp\.net/, '')));

        zk.sendMessage(
            dest,
            {
                image: { url: mybotpic() },
                caption: msg,
                mentions: mentionedJid
            },
            { quoted: ms }
        );
    } else {
        const vcard = 
`BEGIN:VCARD
VERSION:3.0
FN:${conf.OWNER_NAME}
TEL;type=CELL;waid=254111687009:254111687009
END:VCARD`;

        await zk.sendMessage(
            dest,
            {
                contacts: {
                    displayName: conf.OWNER_NAME,
                    contacts: [{ vcard }],
                },
            },
            { quoted: ms }
        );
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