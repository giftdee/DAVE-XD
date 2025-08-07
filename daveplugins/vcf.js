const { zokou } = require("../framework/zokou");
const fs = require("fs");

zokou({
  nomCom: "vcf",
  categorie: "Dave-Group",
  reaction: "📄"
}, async (jid, sock, commandOptions) => {
  const {
    repondre,
    verifGroupe,
    verifAdmin,
    ms
  } = commandOptions;

  if (!verifAdmin) {
    return repondre("😅 I need admin rights to run this command.");
  }

  if (!verifGroupe) {
    return repondre("⛔ This command is only for groups.");
  }

  try {
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;
    let vcfData = "";

    for (let user of participants) {
      const number = user.id.split("@")[0];
      const name = user.name || user.notify || `DAVE-XMD +${number}`;
      vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD\n`;
    }

    repondre(`📥 Compiling ${participants.length} contacts into VCF...`);

    fs.writeFileSync("./contacts.vcf", vcfData.trim());

    await sock.sendMessage(jid, {
      document: fs.readFileSync("./contacts.vcf"),
      mimetype: "text/vcard",
      fileName: `${metadata.subject}.vcf`,
      caption: `📄 VCF for ${metadata.subject}\n👥 Total Contacts: ${participants.length}`
    }, {
      quoted: ms,
      ephemeralExpiration: 86400
    });

    fs.unlinkSync("./contacts.vcf");
  } catch (error) {
    console.error("VCF Error:", error.message || error);
    repondre("❌ Error occurred while generating or sending the VCF. Please try again.");
  }
});
