const { zokou } = require('../framework/zokou');
const fs = require('fs-extra');
const path = require('path');
const { generateProfilePicture } = require("../framework/dl/Function");
const fs = require("fs");
const jimp = require('jimp');
const {S_WHATSAPP_NET, downloadContentFromMessage } = require('@whiskeysockets/baileys');


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
  aliases: ["updatepp", "ppfull"],
  reaction: '🍂',
  categorie: "new"
}, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, auteurMessage } = commandeOptions;

  if (msgRepondu) {
    repondre('quote an image');

    let media;
    if (msgRepondu.imageMessage) {
      media = msgRepondu.imageMessage;
    } else {
      repondre('This is not an image...');
      return;
    }

    try {
      var medis = await zk.downloadAndSaveMediaMessage(media);

      var { img } = await generateProfilePicture(medis);

      await zk.query({
        tag: 'iq',
        attrs: {
          target: undefined,
          to: S_WHATSAPP_NET,
          type: 'set',
          xmlns: 'w:profile:picture'
        },
        content: [
          {
            tag: 'picture',
            attrs: { type: 'image' },
            content: img
          }
        ]
      });

      fs.unlinkSync(medis);
      repondre("Bot Profile Picture Updated");
    } catch (error) {
      repondre("An error occurred while updating bot profile photo: " + error);
    }
  } else {
    repondre('No image was quoted.');
  }
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
  categorie: 'Dave-Whatsapp',
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
  categorie: 'Dave-Whatsapp',
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
  categorie: 'Dave-Whatsapp',
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


zokou({
  nomCom: "star",
  desc: "Star a quoted message — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
  categorie: "Dave-Whatsapp",
  ownerOnly: true,
  reaction: "⭐",
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
    const fromMe = m.message?.extendedTextMessage?.contextInfo?.participant === zk.user.id;

    if (!quoted) return repondre("❌ Please reply to the message you want to star.");

    await zk.chatModify({
      star: {
        messages: [{ id: quoted, fromMe }],
        star: true
      }
    }, from);

    await zk.sendMessage(from, { text: "✅ Message has been starred." }, { quoted: m });

  } catch (err) {
    console.error("[STAR ERROR]", err);
    repondre("❌ Failed to star the message.");
  }
});

zokou({
  nomCom: "unstar",
  desc: "Unstar a quoted message — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
  categorie: "Dave-Whatsapp",
  ownerOnly: true,
  reaction: "✖️",
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
    const fromMe = m.message?.extendedTextMessage?.contextInfo?.participant === zk.user.id;

    if (!quoted) return repondre("❌ Please reply to the message you want to unstar.");

    await zk.chatModify({
      star: {
        messages: [{ id: quoted, fromMe }],
        star: false
      }
    }, from);

    await zk.sendMessage(from, { text: "✅ Message has been unstarred." }, { quoted: m });

  } catch (err) {
    console.error("[UNSTAR ERROR]", err);
    repondre("❌ Failed to unstar the message.");
  }
});

zokou({
  nomCom: 'mydp',
  aliases: [],
  desc: 'Updates your profile picture privacy setting.',
  categorie: 'Dave-Whatsapp',
  reaction: null,
  nomFichier: __filename,
  ownerOnly: true,
}, async (dest, zk, { m, from, repondre, args }) => {
  const options = {
    all: 'Everyone can see your profile photo',
    contacts: 'Only your contacts can see your profile photo',
    contact_blacklist: 'Contacts except some can see your profile photo',
    none: 'No one can see your profile photo',
  };

  const choice = args.join(' ').toLowerCase();

  if (!options[choice]) {
    const help = `*Choose a profile picture privacy setting:*\n\n` +
      Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
      `\n\n_Example:_ *mydp contacts*`;
    return repondre(help);
  }

  try {
    await zk.updateProfilePicturePrivacy(choice);
    await zk.sendMessage(from, { text: `Profile picture privacy updated to *${choice}*.` }, { quoted: m });
  } catch {
    await zk.sendMessage(from, { text: 'Failed to update profile picture privacy.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'mystatus',
  aliases: [],
  desc: 'Updates your status privacy setting.',
  categorie: 'Dave-Whatsapp',
  reaction: null,
  nomFichier: __filename,
  ownerOnly: true,
}, async (dest, zk, { m, from, repondre, args }) => {
  const options = {
    all: 'Everyone can see your status updates',
    contacts: 'Only your contacts can see your status',
    contact_blacklist: 'Contacts except some can see your status',
    none: 'No one can see your status',
  };

  const choice = args.join(' ').toLowerCase();

  if (!options[choice]) {
    const help = `*Choose a status privacy setting:*\n\n` +
      Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
      `\n\n_Example:_ *mystatus contact_blacklist*`;
    return repondre(help);
  }

  try {
    await zk.updateStatusPrivacy(choice);
    await zk.sendMessage(from, { text: `Status privacy updated to *${choice}*.` }, { quoted: m });
  } catch {
    await zk.sendMessage(from, { text: 'Failed to update status privacy.' }, { quoted: m });
  }
});


zokou({
  nomCom: 'groupadd',
  alias: [],
  desc: 'Updates who can add you to groups. — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃',
  categorie: 'Dave-Whatsapp',
  reaction: '🔒',
  nomFichier: __filename,
  ownerOnly: true
}, async (dest, zk, { m, from, repondre, args }) => {
  const options = {
    all: 'Everyone can add you to groups',
    contacts: 'Only contacts can add you to groups',
    contact_blacklist: 'Contacts except some can add you',
    none: 'No one can add you to groups'
  };

  const choice = args.join(' ').toLowerCase();

  if (!options[choice]) {
    const help = `*Choose a group add privacy setting:*\n\n` +
      Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
      `\n\n_Example:_ *groupadd contacts*`;
    return repondre(help);
  }

  try {
    await zk.updateGroupsAddPrivacy(choice);
    await zk.sendMessage(from, { text: `✅ Group add privacy updated to *${choice}*.` }, { quoted: m });
  } catch {
    await zk.sendMessage(from, { text: '❌ Failed to update group add privacy.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'lastseen',
  alias: [],
  desc: 'Updates your last seen privacy settings. — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃',
  categorie: 'Dave-Whatsapp',
  reaction: '👁️',
  nomFichier: __filename,
  ownerOnly: true
}, async (dest, zk, { m, from, repondre, args }) => {
  const availablePrivacies = {
    all: "Everyone can see your last seen",
    contacts: "Only contacts can see your last seen",
    contact_blacklist: "Contacts except blocked ones can see your last seen",
    none: "No one can see your last seen"
  };

  const priv = args.join(' ').toLowerCase();

  if (!priv || !Object.keys(availablePrivacies).includes(priv)) {
    let helpText = `*Choose a valid privacy setting:*\n\n`;
    for (const [key, desc] of Object.entries(availablePrivacies)) {
      helpText += `- *${key}*: ${desc}\n`;
    }
    helpText += `\n_Example:_ *lastseen contacts*`;
    return repondre(helpText);
  }

  try {
    await zk.updateLastSeenPrivacy(priv);
    await zk.sendMessage(from, {
      text: `✅ Last seen privacy updated to *${priv}*.\n${availablePrivacies[priv]}`
    }, { quoted: m });
  } catch (error) {
    console.error('Failed to update last seen:', error);
    await zk.sendMessage(from, { text: '❌ An error occurred while updating last seen settings.' }, { quoted: m });
  }
});


zokou({
  nomCom: 'myonline',
  aliases: [],
  desc: 'Updates your online privacy setting.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: true
}, async (dest, zk, { m, from, repondre, args }) => {
  const options = {
    all: "Everyone can see when you're online",
    match_last_seen: "Matches your Last Seen setting"
  };

  const choice = args.join(' ').toLowerCase();
  if (!options[choice]) {
    const help = `*Choose an online privacy setting:*\n\n` +
      Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
      `\n\n_Example:_ *myonline match_last_seen*`;
    return zk.sendMessage(from, { text: help }, { quoted: m });
  }

  try {
    await dest.updateOnlinePrivacy(choice);
    await zk.sendMessage(from, { text: `Online privacy updated to *${choice}*.` }, { quoted: m });
  } catch {
    await zk.sendMessage(from, { text: 'Failed to update online privacy.' }, { quoted: m });
  }
});


zokou({
  nomCom: 'onwa',
  aliases: ['checkid', 'checkno'],
  desc: 'Checks if a WhatsApp ID exists.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre, args }) => {
  const rawNumber = args[0];
  if (!rawNumber) return zk.sendMessage(from, { text: 'Please provide a valid number.' }, { quoted: m });

  const number = rawNumber.replace(/[^\d]/g, '');
  if (number.length < 10) return zk.sendMessage(from, { text: 'Please provide a valid phone number with country code.' }, { quoted: m });

  const waJid = `${number}@s.whatsapp.net`;
  try {
    const [result] = await dest.onWhatsApp(waJid);
    const response = result?.exists
      ? `${rawNumber} exists on WhatsApp!`
      : `${rawNumber} does not exist on WhatsApp.`;
    await zk.sendMessage(from, { text: response }, { quoted: m });
  } catch (error) {
    console.error('checkIdCommand error:', error);
    await zk.sendMessage(from, { text: 'An error occurred while checking the number.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'bizprofile',
  aliases: ['bizp'],
  desc: 'Fetches business description and category.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre, args }) => {
  const jid = m.sender;
  const targetJid = args[0] ? `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : jid;
  try {
    const profile = await dest.getBusinessProfile(targetJid);
    const text = `Business Description: ${profile.description || 'N/A'}\nCategory: ${profile.category || 'N/A'}`;
    await zk.sendMessage(from, { text }, { quoted: m });
  } catch {
    await zk.sendMessage(from, { text: 'Failed to fetch business profile.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'removedp',
  aliases: [],
  desc: 'Removes your profile picture.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: true
}, async (dest, zk, { m, from, repondre }) => {
  try {
    await dest.removeProfilePicture(from);
    await zk.sendMessage(from, { text: 'Profile picture removed.' }, { quoted: m });
  } catch {
    await zk.sendMessage(from, { text: 'Failed to remove profile picture.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'archive',
  aliases: [],
  desc: 'Archives the current chat.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: true
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const lastMsgInChat = m;
    await dest.chatModify({ archive: true, lastMessages: [lastMsgInChat] }, from);
    await zk.sendMessage(from, { text: 'Chat has been archived successfully.' }, { quoted: m });
  } catch (error) {
    console.error('Error archiving chat:', error);
    await zk.sendMessage(from, { text: 'There was an error while archiving the chat. Please try again.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'vv2',
  aliases: [],
  desc: 'Sends the view once media to the bot user ID.',
  categorie: 'Dave-Mods',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: false
}, async (dest, zk, { m, from, repondre }) => {
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted) return;

  const viewOnceImage = quoted.imageMessage?.viewOnce;
  const viewOnceVideo = quoted.videoMessage?.viewOnce;
  const viewOnceAudio = quoted.audioMessage?.viewOnce;
  if (!viewOnceImage && !viewOnceVideo && !viewOnceAudio) return;

  try {
    let sendMsg;

    if (quoted.imageMessage) {
      const buffer = await getBuffer(quoted.imageMessage, 'image');
      sendMsg = {
        image: buffer,
        caption: quoted.imageMessage.caption || '*REVEALED BY FLASH-MD*'
      };
    } else if (quoted.videoMessage) {
      const buffer = await getBuffer(quoted.videoMessage, 'video');
      sendMsg = {
        video: buffer,
        caption: quoted.videoMessage.caption || '*REVEALED BY FLASH-MD*'
      };
    } else if (quoted.audioMessage) {
      const buffer = await getBuffer(quoted.audioMessage, 'audio');
      sendMsg = {
        audio: buffer,
        mimetype: 'audio/mp4'
      };
    }

    if (sendMsg) {
      const botJid = dest.user?.id;
      await dest.sendMessage(botJid, sendMsg);
    }
  } catch (error) {
    console.error('vv2Command error:', error);
  }
});

zokou({
  nomCom: 'details',
  aliases: [],
  desc: 'Displays the full raw quoted message using Baileys structure.',
  categorie: 'Dave-User',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: false
}, async (dest, zk, { m, from, repondre }) => {
  const context = m.message?.extendedTextMessage?.contextInfo;
  const quoted = context?.quotedMessage;

  if (!quoted) {
    return await dest.sendMessage(from, { text: 'Please reply to a message to view its raw details.' }, { quoted: m });
  }

  try {
    const json = JSON.stringify(quoted, null, 2);
    const parts = json.match(/[\s\S]{1,3500}/g) || [];

    for (const part of parts) {
      await dest.sendMessage(from, {
        text: `*𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Message Details:*\n\`\`\`\n${part}\n\`\`\``
      }, { quoted: m });
    }
  } catch (error) {
    await dest.sendMessage(from, { text: 'Failed to read quoted message.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'blocklist',
  aliases: ['blocked'],
  desc: 'Shows the list of blocked users.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: true
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const blockedJids = await dest.fetchBlocklist();
    if (!blockedJids || blockedJids.length === 0) {
      return await dest.sendMessage(from, { text: 'Your block list is empty.' }, { quoted: m });
    }

    const formattedList = blockedJids
      .map((b, i) => `${i + 1}. ${b.replace('@s.whatsapp.net', '')}`)
      .join('\n');

    await dest.sendMessage(from, { text: `*Blocked Contacts:*\n\n${formattedList}` }, { quoted: m });

  } catch (error) {
    console.error('Error fetching block list:', error);
    await dest.sendMessage(from, { text: 'An error occurred while retrieving the block list.' }, { quoted: m });
  }
});

zokou({
  nomCom: 'vcard',
  aliases: ['card'],
  desc: 'Save a contact from a replied message with a custom name.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: false
}, async (dest, zk, { m, from, repondre, args }) => {
  const quotedContext = m.message?.extendedTextMessage?.contextInfo;
  const quotedSender = quotedContext?.participant || quotedContext?.remoteJid;

  if (!quotedSender) {
    return await dest.sendMessage(from, { text: 'Reply to a user\'s message to save their number.' }, { quoted: m });
  }

  if (!args[0]) {
    return await dest.sendMessage(from, { text: 'Please provide a name for the contact.' }, { quoted: m });
  }

  const name = args.join(' ');
  const phoneNumber = quotedSender.split('@')[0];

  const vcardString =
    `BEGIN:VCARD\n` +
    `VERSION:3.0\n` +
    `FN:${name}\n` +
    `TEL;type=CELL;type=VOICE;waid=${phoneNumber}:${phoneNumber}\n` +
    `END:VCARD`;

  await dest.sendMessage(from, {
    contacts: {
      displayName: name,
      contacts: [{ displayName: name, vcard: vcardString }]
    }
  }, { quoted: m });
});

zokou({
  nomCom: 'location',
  aliases: ['loc'],
  desc: 'Returns Google Maps link from a replied location message.',
  categorie: 'Dave-Whatsapp',
  reaction: '',
  nomFichier: __filename,
  ownerOnly: false
}, async (dest, zk, { m, from, repondre }) => {
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const locMsg = quoted?.locationMessage;

  if (!locMsg) {
    return await dest.sendMessage(from, { text: 'Reply to a location message to get the map link.' }, { quoted: m });
  }

  const { degreesLatitude, degreesLongitude } = locMsg;
  const mapUrl = `https://maps.google.com/?q=${degreesLatitude},${degreesLongitude}`;

  await dest.sendMessage(from, {
    text: `Live Location: ${mapUrl}`,
    previewType: 0,
    contextInfo: { isForwarded: true }
  }, { quoted: m });
});
