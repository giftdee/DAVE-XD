const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) {
            await client.sendMessage(m.chat, { 
                text: 'Usage: .song <song name or YouTube link>' 
            }, { quoted: m });
            return;
        }

        let video;
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            video = { url: text };
        } else {
            const search = await yts(text);
            if (!search || !search.videos.length) {
                await client.sendMessage(m.chat, { 
                    text: 'No results found.' 
                }, { quoted: m });
                return;
            }
            video = search.videos[0];
        }

        // Inform user
        await client.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp}`
        }, { quoted: m });

        // Get Izumi API link
        const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=mp3`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!res.data || !res.data.result || !res.data.result.download) {
            throw new Error('Izumi API failed to return a valid link.');
        }

        const audioData = res.data.result;

        // Send audio directly using the download URL
        await client.sendMessage(m.chat, {
            audio: { url: audioData.download },
            mimetype: 'audio/mpeg',
            fileName: `${audioData.title || video.title || 'song'}.mp3`,
            ptt: false
        }, { quoted: m });

    } catch (err) {
        console.error('Song command error:', err);
        await client.sendMessage(m.chat, { 
            text: '_failed to download the song_.' 
        }, { quoted: m });
    }
};