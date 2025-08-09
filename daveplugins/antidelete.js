const { zokou } = require('../framework/zokou');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const messageStore = new Map();
const CONFIG_PATH = path.join(__dirname, '../media/antidelete.json');
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

// Folder size check
const getFolderSizeInMB = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let totalSize = 0;
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
            }
        }
        return totalSize / (1024 * 1024);
    } catch {
        return 0;
    }
};

// Clean temp folder every minute if >100MB
setInterval(() => {
    try {
        if (getFolderSizeInMB(TEMP_MEDIA_DIR) > 100) {
            fs.readdirSync(TEMP_MEDIA_DIR).forEach(file => {
                fs.unlinkSync(path.join(TEMP_MEDIA_DIR, file));
            });
        }
    } catch (err) {
        console.error('Temp cleanup error:', err);
    }
}, 60 * 1000);

function loadAntideleteConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return { enabled: false, mode: 'private' };
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
    } catch {
        return { enabled: false, mode: 'private' };
    }
}

function saveAntideleteConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (err) {
        console.error('Config save error:', err);
    }
}

// Command
zokou({
    nomCom: "antidelete",
    categorie: "Dave-Mods",
    reaction: "🛡️"
}, async (dest, zk, { repondre, arg, ms }) => {
    const config = loadAntideleteConfig();

    if (!ms.key.fromMe) {
        return repondre('Only the bot owner can use this command.');
    }

    const mode = arg[0]?.toLowerCase();

    if (!mode) {
        return repondre(`*ANTIDELETE SETUP*\n\nCurrent: ${config.enabled ? '✅ ON' : '❌ OFF'}\nMode: ${config.mode || 'private'}\n\n.antidelete all – Send to chat\n.antidelete private – Send to inbox\n.antidelete off – Disable`);
    }

    if (mode === 'off') {
        config.enabled = false;
    } else if (mode === 'all' || mode === 'private') {
        config.enabled = true;
        config.mode = mode;
    } else {
        return repondre('❌ Invalid command.');
    }

    saveAntideleteConfig(config);
    repondre(`✅ Antidelete ${mode === 'off' ? 'disabled' : 'enabled in ' + mode + ' mode'}!`);
});

// Store incoming messages
async function storeMessage(message) {
    const config = loadAntideleteConfig();
    if (!config.enabled || !message.key?.id) return;

    const messageId = message.key.id;
    let content = '';
    let mediaType = '';
    let mediaPath = '';
    const sender = message.key.participant || message.key.remoteJid;

    try {
        if (message.message?.conversation) {
            content = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        } else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            const buffer = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
            await writeFile(mediaPath, buffer);
        }

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender,
            group: message.key.remoteJid.endsWith('@g.us') ? message.key.remoteJid : null,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('storeMessage error:', err);
    }
}

// Handle delete events
async function handleMessageRevocation(zk, revocationMessage) {
    const config = loadAntideleteConfig();
    if (!config.enabled) return;

    try {
        const messageId = revocationMessage.message?.protocolMessage?.key?.id;
        if (!messageId) return;

        const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
        const ownerNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';

        if (deletedBy.includes(zk.user.id) || deletedBy === ownerNumber) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const sender = original.sender;
        const senderName = sender.split('@')[0];
        const groupName = original.group ? (await zk.groupMetadata(original.group)).subject : '';

        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
            hour12: true,
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const destination = config.mode === 'private' ? ownerNumber : (original.group || sender);

        let text = `*🔰 ANTIDELETE ALERT 🔰*\n\n` +
            `*🗑️ Deleted By:* @${deletedBy.split('@')[0]}\n` +
            `*👤 Sender:* @${senderName}\n` +
            `*🕒 Time:* ${time}\n`;

        if (groupName) text += `*👥 Group:* ${groupName}\n`;
        if (original.content) text += `\n*💬 Message:*\n${original.content}`;

        await zk.sendMessage(destination, {
            text,
            mentions: [deletedBy, sender]
        });

        if (original.mediaType && fs.existsSync(original.mediaPath)) {
            const mediaOptions = {
                caption: `*🗑️ Deleted ${original.mediaType}*\nFrom: @${senderName}`,
                mentions: [sender]
            };

            switch (original.mediaType) {
                case 'image':
                    await zk.sendMessage(destination, { image: { url: original.mediaPath }, ...mediaOptions });
                    break;
                case 'video':
                    await zk.sendMessage(destination, { video: { url: original.mediaPath }, ...mediaOptions });
                    break;
                case 'sticker':
                    await zk.sendMessage(destination, { sticker: { url: original.mediaPath }, ...mediaOptions });
                    break;
            }

            fs.unlinkSync(original.mediaPath);
        }

        messageStore.delete(messageId);
    } catch (err) {
        console.error('handleMessageRevocation error:', err);
    }
}

module.exports = { storeMessage, handleMessageRevocation };