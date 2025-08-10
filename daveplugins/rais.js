
const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "bugatti", categorie: "Dave-General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");
    var coms = {};
    var mode = "public";

    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }




    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg =  `
*𝑌𝑒𝑠 𝑀𝑦 𝐺𝑢𝑦 𝑊ℎ𝑎𝑡'𝑠 𝑈𝑝?* 
*𝐷𝑜 𝑀𝑒 𝑎 𝐹𝑎𝑣𝑜𝑢𝑟 𝐹𝑜𝑙𝑙𝑜𝑤 𝑇ℎ𝑒𝑠𝑒 𝐶ℎ𝑎𝑛𝑛𝑒𝑙𝑠*
*Whatsapp channel*
> https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k

*Youtube*
> https://www.youtube.com/davlodavlo19

*For more info*
> https://github.com/giftdee
  `;

let menuMsg = `
> ©giftdee
`;

   var lien = mybotpic();

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Beltahmd*, déveloper Beltah Tech" , gifPlayback : true }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *DAVE-MD*, déveloper Dave Tech" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {

    repondre(infoMsg + menuMsg);

}

}); 
