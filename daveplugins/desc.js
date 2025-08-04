const { zokou } = require('../framework/zokou');
const axios = require("axios");

zokou(
  {
    nomCom: 'define',
    reaction: '🤔',
    categorie: "Search"
  },

  async (_client, zk, commandOptions) => {
    const { repondre, arg } = commandOptions;

    if (!arg || arg.length === 0) {
      return repondre("Please provide a term to define.");
    }

    const term = arg.join(" ");
    try {
      const { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${term}`);
      const definition = data.list[0]?.definition?.replace(/\[/g, '').replace(/\]/g, '');
      const example = data.list[0]?.example?.replace(/\[/g, '').replace(/\]/g, '');

      if (!definition) {
        return repondre(`No definition found for *${term}*.`);
      }

      const response = `📘 *Word:* ${term}\n📝 *Definition:* ${definition}\n💡 *Example:* ${example}`;
      return repondre(response);
    } catch (e) {
      return repondre(`❌ Error fetching definition for *${term}*.`);
    }
  }
);
