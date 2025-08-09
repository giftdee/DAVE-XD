const { zokou } = require('../framework/zokou');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

async function resizeImage(imagePath) {
  const image = await jimp.read(imagePath);
  const resized = image.crop(0, 0, image.getWidth(), image.getHeight()).scaleToFit(720, 720);
  return {
    img: await resized.getBufferAsync(jimp.MIME_JPEG),
    preview: await resized.normalize().getBufferAsync(jimp.MIME_JPEG),
  };
}

async function getBuffer(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

zokou({
  nomCom: "fullpp",
  alias: ["mypp", "dp"],
  desc: "Set your profile picture without compression (owner only) — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
  categorie: "WhatsApp",
  reaction: "📸",
  ownerOnly: true,
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;

    if (!quotedImage) {
      return repondre("📸 Please *reply to an image* to set it as your profile picture.");
    }

    const buffer = await getBuffer(quotedImage, "image");
    const mediaPath = path.join(__dirname, "..", "temp", `${Date.now()}.jpg`);
    await fs.ensureDir(path.dirname(mediaPath));
    await fs.writeFile(mediaPath, buffer);

    const resized = await resizeImage(mediaPath);

    await zk.query({
      tag: "iq",
      attrs: {
        to: 's.whatsapp.net',
        type: "set",
        xmlns: "w:profile:picture",
      },
      content: [{
        tag: "picture",
        attrs: { type: "image" },
        content: resized.img,
      }],
    });

    await zk.sendMessage(from, { text: "✅ Profile picture updated successfully!" }, { quoted: m });

    await fs.unlink(mediaPath);
  } catch (error) {
    console.error("[FULLPP ERROR]", error);
    await zk.sendMessage(from, { text: "❌ Failed to update profile picture." }, { quoted: m });
  }
});

zokou({
  nomCom: "privacy",
  desc: "Displays your current privacy settings — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
  categorie: "WhatsApp",
  ownerOnly: true,
  reaction: "🔒",
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const privacy = await zk.fetchPrivacySettings(true);
    const name = zk.user?.name || "User";

    const caption = `*Privacy Settings*\n\n` +
      `*Name:* ${name}\n` +
      `*Online:* ${privacy.online}\n` +
      `*Profile:* ${privacy.profile}\n` +
      `*Last Seen:* ${privacy.last}\n` +
      `*Read Receipts:* ${privacy.readreceipts}\n` +
      `*Status:* ${privacy.status}\n` +
      `*Group Add:* ${privacy.groupadd}\n` +
      `*Call Add:* ${privacy.calladd}`;

    const avatar = await zk.profilePictureUrl(zk.user.id, 'image').catch(() =>
      'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg'
    );

    await zk.sendMessage(from, {
      image: { url: avatar },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
      }
    }, { quoted: m });

  } catch {
    await zk.sendMessage(from, { text: '❌ Failed to fetch privacy settings.' }, { quoted: m });
  }
});


zokou({
  nomCom: 'pin',
  desc: 'Pin a chat.',
  categorie: 'Whatsapp',
  ownerOnly: true,
  reaction: '📌',
  nomFichier: __filename,
  get flashOnly() {
    return franceking();
  }
}, async (dest, zk, { m, from, repondre }) => {
  try {
    // 'jid' must be from message context or args if needed
    const jid = m.key.remoteJid || from;
    await zk.chatModify({ pin: true }, jid);
    await zk.sendMessage(from, { text: '✅ Chat has been pinned.' }, { quoted: m });
  } catch (err) {
    console.error('Pin error:', err);
    await zk.sendMessage(from, { text: '❌ Failed to pin the chat.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'unpin',
  desc: 'Unpin a chat.',
  categorie: 'Whatsapp',
  ownerOnly: true,
  reaction: '📌',
  nomFichier: __filename,
  get flashOnly() {
    return franceking();
  }
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const jid = m.key.remoteJid || from;
    await zk.chatModify({ pin: false }, jid);
    await zk.sendMessage(from, { text: '✅ Chat has been unpinned.' }, { quoted: m });
  } catch (err) {
    console.error('Unpin error:', err);
    await zk.sendMessage(from, { text: '❌ Failed to unpin the chat.' }, { quoted: m });
  }
});

