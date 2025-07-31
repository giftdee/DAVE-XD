const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'gift',
    PREFIXE: process.env.PREFIX || ".",
    GITHUB : process.env.GITHUB|| 'https://github.com/giftdee/DAVE-XMD',
    OWNER_NAME : process.env.OWNER_NAME || "gifteddave",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254111687009",  

    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    AUTO_REACT: process.env.AUTO_REACTION || "no",  
     AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
    URL: process.env.URL || "https://files.catbox.moe/sigghy.jpg",  
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'no',              
    CHAT_BOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'no', 
    GCF: process.env.GROUP_HANDLE || 'no', 
    AUTO_REPLY : process.env.AUTO_REPLY || "no", 
    AUTO_STATUS_TEXT: process.env.AUTO_STATUS_TEXT || 'Your Status Seen By DAVE-XMD',   
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTO_BIO: process.env.AUTO_BIO || 'no',       
    ANTI_CALL_TEXT : process.env.ANTI_CALL_TEXT || 'yes',             
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k",
    CAPTION : process.env.CAPTION || "DAVE-XMD",
    BOT : process.env.BOT_NAME || 'DAVE-XMD',
    MODE: process.env.PUBLIC_MODE || "yes",              
    TIMEZONE: process.env.TIMEZONE || "Africa/NAIROBI", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || '',
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || '',
    WARN_COUNT : process.env.WARN_COUNT || '5' ,
    ETAT : process.env.PRESENCE || '1',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    FREDI_DELETE : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTI_CALL: process.env.ANTI_CALL || 'no', 
    AUDIO_REPLY : process.env.AUDIO_REPLY || 'no',             
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, 
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
