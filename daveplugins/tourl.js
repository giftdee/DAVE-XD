const fetch = require('node-fetch');
const FormData = require('form-data');
const { fileTypeFromBuffer } = require('file-type');
const { zokou } = require('../framework/zokou');

const MAX_FILE_SIZE_MB = 200;

async function uploadMedia(buffer) {
  try {
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType) {
      throw new Error('Could not determine file type');
    }

    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, `file.${fileType.ext}`);
    bodyForm.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = await res.text();
    if (!data.startsWith('http')) {
      throw new Error('Invalid response from upload server');
    }

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

// Register the command with the bot
zokou({ 
  nomCom: "tourl", 
  categorie: "daveplugins", 
  reaction: "🌐", 
  desc: "Upload media to get a URL" 
}, async (dest, zk, commandeOptions) => {
  const { ms } = commandeOptions;

  if (!ms || !ms.msg || !ms.type || !/image|video/.test(ms.type)) {
    return await zk.sendMessage(dest, { text: "Please reply to an image or video." }, { quoted: ms });
  }

  const mediaBuffer = await ms.download();

  const fileSizeMB = mediaBuffer.length / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return await zk.sendMessage(dest, { text: `File size exceeds ${MAX_FILE_SIZE_MB}MB.` }, { quoted: ms });
  }

  try {
    const link = await uploadMedia(mediaBuffer);
    await zk.sendMessage(dest, { text: `✅ Uploaded successfully:\n\n${link}` }, { quoted: ms });
  } catch (e) {
    await zk.sendMessage(dest, { text: `❌ Failed to upload: ${e.message}` }, { quoted: ms });
  }
});
