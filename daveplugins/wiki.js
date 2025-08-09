const wiki = require("wikipedia");
const { zokou } = require("../framework/zokou");

zokou(
    {
        nomCom: "wiki",
        categorie: "Dave-Search",
        reaction: "📚",
        desc: "Search Wikipedia for information and forward latest newsletter post."
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0) {
            return repondre("📌 Please provide a search query.\nExample: .wiki Kenya");
        }

        try {
            const query = arg.join(" ");
            const summary = await wiki.summary(query);

            let caption = `
╭━━━〔 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Wikipedia 〕━━━╮
🔍 *Query*: _${query}_
💬 *Title*: _${summary.title}_
📝 *Summary*: _${summary.extract}_
🔗 *URL*: ${summary.content_urls?.desktop?.page || "No link available"}
╰━━━━━━━━━━━━━━━━━━━━━━╯
> _Powered By 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃_
`;

            if (summary.originalimage?.source) {
                await zk.sendMessage(
                    dest,
                    { image: { url: summary.originalimage.source }, caption },
                    { quoted: ms }
                );
            } else {
                await zk.sendMessage(dest, { text: caption }, { quoted: ms });
            }

            // Forward latest newsletter
            try {
                const newsletterJid = "120363400480173280@newsletter";
                let msgs = await zk.fetchNewsletterMessages(newsletterJid, 1);
                if (msgs.length > 0) {
                    await zk.sendMessage(dest, { forward: msgs[0] }, { quoted: ms });
                }
            } catch (err) {
                console.error("Failed to forward newsletter:", err);
            }
        } catch (e) {
            console.error(e);
            repondre(`❌ Error: ${e.message}`);
        }
    }
);