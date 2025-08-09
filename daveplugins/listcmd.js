const { zokou } = require('../framework/zokou');

zokou({
  nomCom: "list",
  alias: ["listcmd", "commands"],
  desc: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Bot Command Menu",
  categorie: "Dave-Menu",
  reaction: "⚡",
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre }) => {
  try {
    const menuText = `
╭━❮ *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ❯━┈⊷

📥 *DOWNLOAD COMMANDS*
┃ • .play      → Download audio from YouTube
┃ • .song      → Download song from YouTube
┃ • .apk       → Download APK from Play Store
┃ • .video     → Download video from YouTube
┃ • .fb        → Download video from Facebook
┃ • .tk        → Download video from TikTok
┃ • .ig        → Download video from Instagram
┃ • .gdrive    → Download Google Drive files
┃ • .twitter   → Download Twitter videos
┃ • .img       → Download images
┃ • .darama    → Download full episode videos
┃ • .play2     → Alternative YouTube audio downloader
┃ • .video2    → Alternative YouTube video downloader
┃ • .baiscope  → Download Baiscope videos
┃ • .mfire     → Download MediaFire files

🐾 *ANIME COMMANDS*
┃ • .yts        → Search YouTube videos
┃ • .king       → Get king info
┃ • .dog        → Random dog images
┃ • .anime      → Random anime pictures
┃ • .animegirl  → Random anime girl pictures
┃ • .loli       → Romantic anime pictures

ℹ️ *INFO COMMANDS*
┃ • .alive      → Check if bot is online
┃ • .ping       → Check bot speed
┃ • .menu       → Show main menu
┃ • .menu2      → Show alternate menu
┃ • .ai         → Chat with AI bot
┃ • .system     → Check bot system info
┃ • .owner      → Get owner info
┃ • .status     → Check bot runtime
┃ • .about      → About the bot
┃ • .list       → Show command list
┃ • .script     → Get bot repository link

🎲 *OTHER COMMANDS*
┃ • .joke       → Get a random joke
┃ • .fact       → Get a random fact
┃ • .githubstalk→ GitHub data for any user
┃ • .gpass      → Generate strong password
┃ • .hack       → Prank friends
┃ • .srepo      → Search repositories
┃ • .define     → Search any word

👥 *GROUP COMMANDS*
┃ • .mute        → Mute the group
┃ • .unmute      → Unmute the group
┃ • .left        → Leave the group
┃ • .jid         → Get group JID
┃ • .remove      → Remove member from group
┃ • .delete      → Delete group message
┃ • .add         → Add member to group
┃ • .kick        → Kick user from group
┃ • .kickall     → Remove all members
┃ • .setgoodbye  → Set goodbye message
┃ • .setwelcome  → Set welcome message
┃ • promote      → Make group admin
┃ • .demote      → Remove admin status
┃ • .tagall      → Mention all members
┃ • .getpic      → Get group profile picture
┃ • .invite      → Get group invite link
┃ • .revoke      → Reset group invite link
┃ • .joinrequests→ Check pending join requests
┃ • .allreq      → Add all pending members
┃ • .lockgc      → Lock group (private)
┃ • .unlockgc    → Unlock group (public)
┃ • .leave       → Leave any group
┃ • .updategname → Set group name
┃ • .updategdesc → Set group description
┃ • .joim        → Join via invite link
┃ • .hidetag     → Mention user(s) without notification
┃ • .ginfo       → Get group info
┃ • .disappear on|off → Enable/Disable disappearing messages
┃ • .senddm      → Send disappearing message
┃ • .disappear 7d|24h|90d → Set disappearing message timer

👑 *OWNER COMMANDS*
┃ • .update     → Update bot version
┃ • .restart    → Restart the bot
┃ • .settings   → View bot settings
┃ • .owner      → Get owner number
┃ • .repo       → Bot repository link
┃ • .system     → Check system info
┃ • .block      → Block a user
┃ • .unblock    → Unblock a user
┃ • .shutdown   → Logout the bot
┃ • .clearchats → Clear chats
┃ • .setpp      → Update profile picture
┃ • .broadcast  → Create broadcast message
┃ • .jid        → Get JID of any user
┃ • .gjid       → Get group JID

🔄 *CONVERT COMMANDS*
┃ • .sticker    → Convert photo to sticker
┃ • .tts        → Text to speech
┃ • .trt        → Translate languages

🔗 *REPOSITORY*  
https://github.com/giftdee/DAVE-XMD

╰━━━━━━━━━━━━━━━━━━━━━⪼
`;

    await zk.sendMessage(from, {
      image: { url: "https://files.catbox.moe/lidsgj.jpg" },
      caption: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Official',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

    await zk.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/xci982.mp3' },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });

    await zk.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/utbujd.mp3' },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    repondre(`❌ An error occurred: ${error.message}`);
  }
});