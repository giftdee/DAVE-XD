const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const ownerMiddleware = require("../../utility/botUtil/Ownermiddleware");

module.exports = async (context) => {
    const { client, m } = context;

    await ownerMiddleware(context, async () => {
        if (global.updateInProgress) {
            return await m.reply("🛑 Update already running! Chill.");
        }
        global.updateInProgress = true;

        try {
            await m.reply("💣 *DAVE-XD Update Started!* Fetching latest commits...");

            // Paths
            const lastCommitPath = path.join(__dirname, "../../last_commit.txt");
            const zipPath = path.join(__dirname, "../../update.zip");
            const extractPath = path.join(__dirname, "../../latest");
            const botRoot = path.join(__dirname, "../..");

            // 1️⃣ Get latest commit SHA from GitHub main branch
            console.log("Fetching latest commit SHA from GitHub...");
            const repoUrl = "https://api.github.com/repos/giftdee/DAVE-XD/commits/main";
            const { data: commitData } = await axios.get(repoUrl, {
                headers: { "User-Agent": "DAVE-XD-Updater" } // required for GitHub
            }).catch(err => {
                throw new Error(`GitHub API error: ${err.response?.status || err.message}`);
            });

            const latestSha = commitData.sha;
            console.log(`Latest SHA: ${latestSha}`);

            // Compare with stored SHA
            let currentSha = "";
            if (fs.existsSync(lastCommitPath)) {
                currentSha = fs.readFileSync(lastCommitPath, "utf-8").trim();
            }
            console.log(`Current SHA: ${currentSha}`);

            if (latestSha === currentSha) {
                return await m.reply("✅ *Already up to date!* No new commits on main branch.");
            }

            await m.reply("⚡ *New update found!* Downloading ZIP...");

            // 2️⃣ Download repo ZIP
            const zipUrl = "https://github.com/giftdee/DAVE-XD/archive/refs/heads/main.zip";
            const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(zipPath, zipData);
            console.log(`ZIP downloaded: ${zipPath}`);

            // 3️⃣ Extract ZIP
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractPath, true);
            console.log(`Extracted to ${extractPath}`);

            // 4️⃣ Copy files to bot root
            const sourcePath = path.join(extractPath, "DAVE-XD-main");
            copyFolderSync(sourcePath, botRoot);

            // 5️⃣ Save new SHA
            fs.writeFileSync(lastCommitPath, latestSha);

            // 6️⃣ Cleanup
            fs.unlinkSync(zipPath);
            fs.rmSync(extractPath, { recursive: true, force: true });

            await m.reply("✅ *DAVE-XD successfully updated!* Restarting in 3 seconds...");

            setTimeout(() => process.exit(0), 3000);

        } catch (error) {
            console.error("Update error:", error);
            await m.reply(`💀 Update failed: ${error.message}`);
        } finally {
            global.updateInProgress = false;
        }
    });
};

// Helper: Copy folder content except ignored files
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

    for (const item of fs.readdirSync(source)) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Skip these files
        if ([".env", "Procfile", "package.json", "package-lock.json", "last_commit.txt", "Session", "node_modules"].includes(item)) {
            console.log(`Skipping ${item}`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${srcPath} -> ${destPath}`);
        }
    }
}