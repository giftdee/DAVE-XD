const { zokou } = require('../framework/zokou');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');
const { getBuffer } = require('../framework/mesfunctions'); // assumes you have a getBuffer util, or use axios

zokou({
    nomCom: "topdf",
    alias: ["pdf", "topdf"],
    react: "📄",
    desc: "Convert provided text or image to a PDF file.",
    category: "Dave-Tools",
    filename: __filename
},
async (dest, zk, { q, repondre, msgRepondu }) => {
    try {
        const doc = new PDFDocument({ autoFirstPage: false });
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);
            await zk.sendMessage(dest, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: '𝐃𝐚𝐯𝐞𝐓𝐞𝐜𝐡.pdf',
                caption: "*📄 PDF created successfully!*\n\n> © Created by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃"
            }, { quoted: msgRepondu });
        });

        // Case 1: Image Reply
        if (msgRepondu && msgRepondu.mimetype && msgRepondu.mimetype.startsWith("image/")) {
            const buffer = await zk.downloadMediaMessage(msgRepondu);
            const image = buffer;
            const imageDims = { width: 500, height: 600 }; // Customize based on use

            doc.addPage({ size: [imageDims.width, imageDims.height] });
            doc.image(image, 0, 0, imageDims);
        }

        // Case 2: Plain Text
        else if (q && q.trim() !== "") {
            doc.addPage();
            doc.fontSize(14).text(q, {
                align: 'left',
                lineGap: 8
            });
        }

        // If nothing valid
        else {
            return repondre("❗Send some text or reply to an image to convert it to a PDF.\n\n*Example:* `.topdf Gifted Dave 🇰🇪` or reply to an image with `.topdf`");
        }

        doc.end();

    } catch (e) {
        console.error("PDF ERROR:", e);
        repondre(`❌ Error: ${e.message}`);
    }
});
