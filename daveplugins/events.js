const { zokou } = require('../framework/zokou');
const { attribuerUnevaleur } = require('../bdd/welcome');

async function events(nomCom) {
    zokou({
        nomCom: nomCom,
        categorie: 'Group',
        reaction: '⚙️'
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser, verifAdmin, nomAuteurMessage } = commandeOptions;

        if (!verifAdmin && !superUser) {
            return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, you ain’t got the keys to mess with ${nomCom}! 😡 Only admins or Gifted_dave can run 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃’s group vibes! 🚫\n◈━━━━━━━━━━━━━━━━◈`);
        }

        if (!arg[0] || arg.join(' ').trim() === '') {
            return repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, don’t be lazy! Use *${nomCom} on* to activate or *${nomCom} off* to shut it down! 😎 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 needs clear orders! 🔥\n◈━━━━━━━━━━━━━━━━◈`);
        }

        const setting = arg[0].toLowerCase();
        if (setting === 'on' || setting === 'off') {
            try {
                await attribuerUnevaleur(dest, nomCom, setting);
                await zk.sendMessage(
                    dest,
                    {
                        text: `𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ BOOM, ${nomAuteurMessage}! ${nomCom} is now ${setting} for this group! 🔥\n│❒ 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃’s got it locked in! 🚀\n│❒ Powered by Gifted_dave\n◈━━━━━━━━━━━━━━━━◈`,
                        footer: `Hey ${nomAuteurMessage}! I'm DAVE-XMD, created by gifted_dave 😎`
                    },
                    { quoted: ms }
                );
            } catch (error) {
                console.error(`Error updating ${nomCom}:`, error);
                await repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL BUST, ${nomAuteurMessage}! 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 tripped while setting ${nomCom}: ${error.message} 😡 Try again or flop! 😣\n◈━━━━━━━━━━━━━━━━◈`);
            }
        } else {
            repondre(`𝐃𝐀𝐕𝐄-𝐗𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, what’s this nonsense? 😡 Only *${nomCom} on* or *${nomCom} off* works for 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ! Get it right! 🔧\n◈━━━━━━━━━━━━━━━━◈`);
        }
    });
}

// Register the commands
events('welcome');
events('goodbye');
events('antipromote');
events('antidemote');
