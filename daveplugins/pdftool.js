const { zokou } = require('../framework/zokou');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');

zokou({
    nomCom: "topdf",
    alias: ["pdf", "topdf"],
    react: "📄",
    desc: "Convert provided text to a PDF file.",
    category: "utilities",
    filename: __filename
},
async (dest, zk, { q, repondre, msgRepondu }) => {
    try {
        if (!q) return repondre("Please provide the text you want to convert to PDF. *Example:* `.topdf Gifted Dave 🇰🇪`");

        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            await zk.sendMessage(dest, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: 'Davetech.pdf',
                caption: `
*📄 PDF created successfully!*

> © Created By 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃`
            });
        });

        doc.text(q);
        doc.end();

    } catch (e) {
        console.error(e);
        repondre(`❌ Error: ${e.message}`);
    }
});
