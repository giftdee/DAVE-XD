const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async (context) => {
    const { client, m, text, botname } = context;

    if (!botname) {
        return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ Bot’s screwed, no botname set. Yell at your dev, dipshit.\n◈━━━━━━━━━━━━━━━━◈`);
    }

    if (!text && !m.quoted) {
        return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ Oi, ${m.pushName}, you forgot the damn image URL or to reply to an image, you moron! Example: .remini https://example.com/image.png or reply to an image.\n◈━━━━━━━━━━━━━━━━◈`);
    }

    let imageUrl = text;

    // Handle replied image
    if (!text && m.quoted && m.quoted.mtype === 'imageMessage') {
        try {
            const buffer = await client.downloadMediaMessage(m.quoted);
            const form = new FormData();
            form.append('file', buffer, { filename: 'image.png' });

            // Upload to a temporary hosting service (replace with actual upload API if available)
            const uploadResponse = await fetch('https://files.giftedtech.web.id/upload', {
                method: 'POST',
                body: form,
                headers: form.getHeaders(),
                timeout: 10000
            });
            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status ${uploadResponse.status}`);
            }

            const uploadData = await uploadResponse.json();
            if (!uploadData.url) {
                throw new Error('No URL returned from upload service');
            }
            imageUrl = uploadData.url;
        } catch (uploadError) {
            console.error(`Failed to upload quoted image: ${uploadError.message}`);
            return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ Shit broke, ${m.pushName}! Couldn’t upload your stupid image. Try again, you whiny prick.\n◈━━━━━━━━━━━━━━━━◈`);
        }
    }

    if (!imageUrl) {
        return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ No valid image URL or quoted image, ${m.pushName}, you clueless twit!\n◈━━━━━━━━━━━━━━━━◈`);
    }

    try {
        const encodedUrl = encodeURIComponent(imageUrl);
        const apiUrl = `https://api.giftedtech.web.id/api/tools/remini?apikey=gifted_api_se5dccy&url=${encodedUrl}`;
        const response = await fetch(apiUrl, {
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        if (!response.ok) {
            throw new Error(`API puked with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.success || !data.result || !data.result.image_url) {
            return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ API’s useless, ${m.pushName}! ${data.msg || 'No enhanced image, you loser.'} Try again, dumbass.\n◈━━━━━━━━━━━━━━━━◈`);
        }

        const { image_url } = data.result;

        // Verify image_url accessibility
        const urlCheck = await fetch(image_url, {
            method: 'HEAD',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        if (!urlCheck.ok) {
            // Fetch image as buffer if URL is inaccessible
            const imageResponse = await fetch(image_url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            if (!imageResponse.ok) {
                throw new Error(`Image URL inaccessible, status ${imageResponse.status}`);
            }
            const imageBuffer = await imageResponse.buffer();

            await m.reply(`_Enhancing image..._`);
            try {
                await client.sendMessage(
                    m.chat,
                    {
                        image: imageBuffer,
                        fileName: 'enhanced_image.png'
                    },
                    { quoted: m }
                );
            } catch (sendError) {
                console.error(`Failed to send image: ${sendError.message}`);
                throw new Error(`Couldn’t send enhanced image, ${sendError.message}`);
            }
        } else {
            await m.reply(`_Enhancing image..._`);
            try {
                await client.sendMessage(
                    m.chat,
                    {
                        image: { url: image_url },
                        fileName: 'enhanced_image.png'
                    },
                    { quoted: m }
                );
            } catch (sendError) {
                console.error(`Failed to send image: ${sendError.message}`);
                throw new Error(`Couldn’t send enhanced image, ${sendError.message}`);
            }
        }

        // Send caption
        await client.sendMessage(m.chat, { text: `> ρσɯҽɾԃ Ⴆყ 𝙳𝙰𝚅𝙴-x𝙳` }, { quoted: m });
    } catch (error) {
        console.error(`Error in remini: ${error.message}`);
        await m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ Shit broke, ${m.pushName}! Couldn’t enhance your stupid image. Try later, you whiny prick.\n◈━━━━━━━━━━━━━━━━◈`);
    }
};