const { zokou } = require('../framework/zokou');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');

zokou({
  nomCom: "topdf",
  alias: ["pdf"],
  desc: "Convert text to a PDF file — 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Utility",
  categorie: "utilities",
  reaction: "📄",
  nomFichier: __filename
}, async (dest, zk, { m, from, repondre, q }) => {
  try {
    if (!q) 
      return repondre(`⚠️ Please provide text to convert to PDF.\n*Example:* \`.topdf 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 is lit!🔥\``);

    // Create new PDF document
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // Send PDF file
      await zk.sendMessage(from, {
        document: pdfData,
        mimetype: 'application/pdf',
        fileName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃.pdf',
        caption: `📄 *PDF generated successfully!*\n\n> © 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Official`
      }, { quoted: m });
    });

    // Add text content
    doc.text(q);

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error(error);
    repondre(`❌ Error: ${error.message}`);
  }
});