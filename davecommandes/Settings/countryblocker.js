*/const fs = require('fs');
const path = require('path');

// Config file
const CONFIG_PATH = path.join(__dirname, 'countryblocker_config.json');

// Load or create config
function loadConfig() {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        } catch (e) {
            console.error('Error loading config:', e);
        }
    }
    const defaultConfig = { enabled: false, blockedRegions: {} };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
}

// Save config
function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving config:', e);
        return false;
    }
}

module.exports = async (context) => {
    const { client, m, text, botname, prefix = '' } = context;
    const config = loadConfig();

    const formatReply = (msg) => `◈━━━━━━━━━━━━━━━━◈\n│❒ ${msg}\n◈━━━━━━━━━━━━━━━━◈`;

    // Admin check (replace with your actual admin system)
    const isAdmin = () => {
        return m.sender === '123456789@s.whatsapp.net' || 
               global.db?.data?.users?.[m.sender]?.role === 'admin';
    };

    // Extract command from text
    const args = text ? text.trim().split(/ +/).slice(1) : [];
    const command = text ? text.trim().split(/ +/)[0]?.toLowerCase() : '';

    // Command handling
    if (command === 'banuser') {
        if (!isAdmin()) {
            return m.reply(formatReply('❌ Only admins can use this command.'));
        }

        const code = args[0];
        if (!code) {
            return m.reply(formatReply(`Usage: ${prefix}banuser <country code>\nExample: ${prefix}banuser 254`));
        }

        config.blockedRegions[code] = `Blocked region +${code}`;
        config.enabled = true;
        
        if (saveConfig(config)) {
            await m.reply(formatReply(`✅ Country code +${code} is now banned.`));
        } else {
            await m.reply(formatReply('❌ Failed to save configuration.'));
        }
        return;
    }

    if (command === 'banuseroff') {
        if (!isAdmin()) {
            return m.reply(formatReply('❌ Only admins can use this command.'));
        }

        const code = args[0];
        if (!code) {
            return m.reply(formatReply(`Usage: ${prefix}banuseroff <country code>\nExample: ${prefix}banuseroff 254`));
        }

        if (config.blockedRegions[code]) {
            delete config.blockedRegions[code];
            
            // Disable if no codes left
            config.enabled = Object.keys(config.blockedRegions).length > 0;
            
            if (saveConfig(config)) {
                await m.reply(formatReply(`✅ Country code +${code} is now unbanned.`));
            } else {
                await m.reply(formatReply('❌ Failed to save configuration.'));
            }
        } else {
            await m.reply(formatReply(`❌ Country code +${code} is not in the ban list.`));
        }
        return;
    }

    if (command === 'banlist') {
        if (!isAdmin()) {
            return m.reply(formatReply('❌ Only admins can use this command.'));
        }

        const bannedList = Object.keys(config.blockedRegions);
        if (bannedList.length === 0) {
            await m.reply(formatReply('📋 No countries currently banned.'));
        } else {
            const list = bannedList.map(code => `• +${code}`).join('\n');
            await m.reply(formatReply(`📋 Banned Countries (${bannedList.length}):\n${list}\n\nStatus: ${config.enabled ? '🟢 ENABLED' : '🔴 DISABLED'}`));
        }
        return;
    }

    // Automatic blocking for messages (runs on every message)
    if (config.enabled) {
        for (let code in config.blockedRegions) {
            if (m.sender.startsWith(code)) {
                // Ban user in database if available
                if (global.db?.data?.users?.[m.sender]) {
                    global.db.data.users[m.sender].banned = true;
                }
                
                await m.reply(formatReply(`❌ Your country code +${code} is blocked from using this bot.`));
                return; // Stop further processing
            }
        }
    }
};*/