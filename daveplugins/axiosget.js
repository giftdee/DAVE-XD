const { zokou } = require("../framework/zokou");
const axios = require('axios');
const wiki = require('wikipedia');
const conf = require(__dirname + "/../set");

zokou({
  nomCom: "technews",
  reaction: '✨',
  categorie: 'Dave-New'
}, async (dest, zk, context) => {
  const { repondre, ms } = context;

  try {
    // Fetching tech news from the API
    const response = await axios.get("https://fantox001-scrappy-api.vercel.app/technews/random");
    const data = response.data;
    const { thumbnail, news } = data;

    await zk.sendMessage(dest, {
      text: news,
      contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363400480173280@newsletter',
         newsletterName: "DAVE-XMD updates",
         serverMessageId: 143,
        },
      },
    }, { quoted: ms });

  } catch (error) {
    console.error("Error fetching tech news:", error);
    await repondre("Sorry, there was an error retrieving the news. Please try again later.\n" + error);
  }
});
       
zokou({
  nomCom: "define",
  aliases: ["dictionaries", "dict", "def"],
  reaction: '✨',
  categorie: "Dave-New"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const term = arg.join(" ");

  if (!term) {
    return repondre("Please provide a term to define.");
  }

  try {
    const { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${term}`);
    const definition = data.list[0];

    if (definition) {
      const definitionMessage = `
        Word: ${term}
        Definition: ${definition.definition.replace(/\[|\]/g, '')}
        Example: ${definition.example.replace(/\[|\]/g, '')}
      `;

      await zk.sendMessage(dest, {
        text: definitionMessage,
        contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363400480173280@newsletter',
         newsletterName: "DAVE-XMD updates",
         serverMessageId: 143,
          },
        },
      }, { quoted: ms });

    } else {
      return repondre(`No result found for "${term}".`);
    }
  } catch (error) {
    console.error(error);
    return repondre("An error occurred while fetching the definition.");
  }
});

zokou({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "Dave-New",
  reaction: '✨',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();

    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

zokou({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "Dave-New",
  reaction: '✨',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;

  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];

    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

zokou({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "Dave-coding",
  reaction: '🔒',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');

    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

zokou({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "Dave-coding",
  reaction: '🔓',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');

    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

zokou({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "Dave-coding",
  reaction: '🔒',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

zokou({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "Dave-coding",
  reaction: '🔓',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

zokou({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "Dave-New",
  reaction: '✨',
}, async (dest, zk, context) => {
  const { repondre } = context;

  try {
    // Get current date and time
    const now = new Date();

    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });

    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});


zokou({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "Dave-New",
  reaction: '✨',
}, async (dest, zk, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();

    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});


zokou({
  nomCom: "calculate",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "Dave-New",
  reaction: '✨',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

zokou({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "Dave-Fun",
  reaction: '🎭',
}, async (dest, zk, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await zk.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});



zokou({
  nomCom: "news",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "Dave-New",
  reaction: '✨',
}, async (dest, zk, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await zk.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await zk.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

zokou({
  nomCom: "wikipedia",
  aliases: ["wiki", "wikipeda"],
  reaction: '🌚',
  categorie: "Dave-New"
}, async (zk, dest, context) => {
  const { repondre, arg, ms } = context;

  // Ensure that the search term is provided
  const text = arg.join(" ").trim(); 

  try {
    if (!text) return repondre(`Provide the term to search,\nE.g What is JavaScript!`);

    // Fetch summary from Wikipedia
    const con = await wiki.summary(text);

    // Format the reply message
    const texa = `
*🌐 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Wikipedia Summary 🌐*

📌 *Title:* _${con.title}_  
🗒️ *Description:* _${con.description}_  
📖 *Summary:* _${con.extract}_  
🔗 *Read more:* ${con.content_urls.mobile.page}

> 🔧 Powered by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃
    `;
    repondre(texa);
  } catch (err) {
    console.error(err);
    repondre(`Got 404. I did not find anything!`);
  }
});

zokou({
  nomCom: "tempmaile",
  aliases: ['maile', 'tempe'],
  reaction: '📧',
  categorie: "Dave-New"
}, async (dest, zk, context) => {
  const { repondre: replyToUser, prefix, ms: messageQuote } = context;

  try {
    const tempEmail = Math.random().toString(36).substring(2, 14) + "@1secmail.com";

    await zk.sendMessage(dest, {
      text: `Your temporary email is: ${tempEmail}

You can use this email for temporary purposes. I will notify you if you receive any emails.`,
      contextInfo: {
        externalAdReply: {
          title: "Temporary Email Service",
          body: "Create temporary emails quickly and easily for privacy and security.",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: messageQuote });

    // Function to check for new emails
    const checkEmails = async () => {
      try {
        const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${tempEmail}&domain=1secmail.com`);
        const emails = response.data;

        if (emails.length > 0) {
          for (const email of emails) {
            const emailDetails = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${tempEmail}&domain=1secmail.com&id=${email.id}`);
            const emailData = emailDetails.data;
            const links = emailData.textBody.match(/(https?:\/\/[^\s]+)/g);
            const linksText = links ? links.join("\n") : "No links found in the email content.";

            await zk.sendMessage(dest, {
              text: `You have received a new email!\n\nFrom: ${emailData.from}\nSubject: ${emailData.subject}\n\n${emailData.textBody}\nLinks found:\n${linksText}`,
              contextInfo: {
                externalAdReply: {
                  title: "Temporary Email Notification",
                  body: "You received a new email on your temporary inbox. Check it out now!",
                  thumbnailUrl: conf.URL,
                  sourceUrl: conf.GURL,
                  mediaType: 1,
                  showAdAttribution: true
                }
              }
            }, { quoted: messageQuote });
          }
        }
      } catch (error) {
        console.error("Error checking temporary email:", error.message);
      }
    };

    // Set an interval to check for new emails every 30 seconds
    const emailCheckInterval = setInterval(checkEmails, 30000);

    // End the email session after 10 minutes
    setTimeout(() => {
      clearInterval(emailCheckInterval);
      zk.sendMessage(dest, {
        text: "Your temporary email session has ended. Please create a new temporary email if needed.",
        contextInfo: {
          externalAdReply: {
            title: "Temporary Email Session Ended",
            body: "Your temporary email session has ended. Need another one? Just ask!",
            thumbnailUrl: conf.URL,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: messageQuote });
    }, 600000); // 10 minutes in milliseconds

  } catch (error) {
    console.error("Error generating temporary email:", error.message);
    await zk.sendMessage(dest, {
      text: "Error generating temporary email. Please try again later.",
      contextInfo: {
        externalAdReply: {
          title: "Temporary Email Error",
          body: "There was an issue generating your temporary email. Please try again later.",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: messageQuote });
  }
});

zokou({
  nomCom: "githubs",
  aliases: ["gits"],
  reaction: '💻',
  categorie: "Dave-New"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const githubUsername = arg.join(" ");

  if (!githubUsername) {
    return repondre("Give me a valid GitHub username like: github giftdee");
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${githubUsername}`);
    const data = response.data;

    if (data.message === "Not Found") {
      return repondre(`User ${githubUsername} not found.`);
    }

    const thumb = data.avatar_url; // Using the avatar_url as the thumbnail

    const githubMessage = `
╭─── 𝐆𝐢𝐭𝐇𝐮𝐛 𝐔𝐬𝐞𝐫 𝐈𝐧𝐟𝐨 ───╮
🚩 *ID:* ${data.id}
🎟️ *Name:* ${data.name}
💻 *Username:* ${data.login}
🧠 *Bio:* ${data.bio}
🏢 *Company:* ${data.company}
📍 *Location:* ${data.location}
📧 *Email:* ${data.email || "Not provided"}
🌐 *Blog:* ${data.blog || "Not provided"}
📁 *Public Repos:* ${data.public_repos}
📄 *Public Gists:* ${data.public_gists}
👥 *Followers:* ${data.followers}
🤝 *Following:* ${data.following}
╰── Powered by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ──╯
`;

    await zk.sendMessage(dest, {
      text: githubMessage,
      contextInfo: {
        externalAdReply: {
          title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 GITHUB USER INFO",
          body: `Information about ${data.login}`,
          mediaType: 1,
          thumbnailUrl: thumb,
          sourceUrl: conf.GURL,
          showAdAttribution: true,
        },
      },
    }, { quoted: ms });

  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    await repondre("An error occurred while fetching GitHub user data.");
  }
});

zokou({
  nomCom: "elements",
  reaction: '📓',
  categorie: "Dave-New"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const elementQuery = arg.join(" ").trim();

  if (!elementQuery) {
    return repondre("Please provide an element symbol or name.");
  }

  try {
    const response = await axios.get(`https://api.popcat.xyz/periodic-table?element=${elementQuery}`);

    if (!response.data) {
      return repondre("Could not find information for the provided element. Please check the symbol or name.");
    }

    const data = response.data;
    const thumb = data.image; // Assuming the API returns an 'image' property for the element thumbnail

    const formattedMessage = `
*𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Element Information:*
💱 *Name:* ${data.name}
💱 *Symbol:* ${data.symbol}
💱 *Atomic Number:* ${data.atomic_number}
💱 *Atomic Mass:* ${data.atomic_mass}
💱 *Period:* ${data.period}
💱 *Phase:* ${data.phase}
💱 *Discovered By:* ${data.discovered_by}
💱 *Summary:* ${data.summary}
   
Regards ${conf.BOT} `;

    await zk.sendMessage(dest, {
      text: formattedMessage,
      contextInfo: {
        externalAdReply: {
          title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 ELEMENT INFORMATION",
          body: "Here is the information you requested dear:",
          mediaType: 1,
          thumbnailUrl: thumb,
          sourceUrl: conf.GURL,
          showAdAttribution: true, 
        },
      },
    }, { quoted: ms });

  } catch (error) {
    console.error("Error fetching the element data:", error);
    repondre("An error occurred while fetching the element data. Please try again later.");
  }
});

zokou({
  nomCom: "describe",
  aliases: ["dictionaries", "dict", "def"],
  reaction: '😁',
  categorie: "Dave-New"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const term = arg.join(" ");

  if (!term) {
    return repondre("Please provide a term to define.");
  }

  try {
    const { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${term}`);
    const definition = data.list[0];

    if (definition) {
      const definitionMessage = `
        Word: ${term}
        Definition: ${definition.definition.replace(/\[|\]/g, '')}
        Example: ${definition.example.replace(/\[|\]/g, '')}
      `;

      await zk.sendMessage(dest, {
        text: definitionMessage,
        contextInfo: {
          externalAdReply: {
            title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 DICTIONARY",
            body: `Definition of ${term}`,
            mediaType: 1,
            thumbnailUrl: "https://files.catbox.moe/lidsgj.jpg", 
            sourceUrl: conf.GURL,
            showAdAttribution: true, 
          },
        },
      }, { quoted: ms });

    } else {
      return repondre(`No result found for "${term}".`);
    }
  } catch (error) {
    console.error(error);
    return repondre("An error occurred while fetching the definition.");
  }
});





