const {zokou} = require('../framework/zokou');
const fs = require('fs');
const getFBInfo = require("@xaviabot/fb-downloader");
const { default: axios } = require('axios');
const { getJson } = require("../framework/utils");

zokou({nomCom : "igdl" , categorie : "Dave-Download"},async (dest , zk , commandeOptions)=>{
  const {ms,repondre,arg} = commandeOptions ;

  let link = arg.join(' ')

  if (!arg[0]) { repondre('Provide Instagram video link to download');return}; 

  try {

    let igvid = await axios('https://api.vihangayt.com/downloader/ig?url='+link)

    if (igvid.data.data.data[0].type == 'video') {
    zk.sendMessage(dest,{video : {url : igvid.data.data.data[0].url},caption : "ig video downloader powered by *💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠*",gifPlayback : false },{quoted : ms}) 
    }
    else {
        zk.sendMessage(dest,{image : {url : igvid.data.data.data[0].url},caption : "ig image downloader powered by *💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠*"})
    }

  } catch (e) {repondre("erreur survenue lors du téléchargement \n " + e)}

});


zokou({
  nomCom: "fbdl",
  categorie: "Dave-Download",
  reaction: "📽️"
},
async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Insert a public facebook video link!');
    return;
  }

  const queryURL = arg.join(" ");

  try {
     getFBInfo(queryURL)
    .then((result) => {
       let caption = `
        titre: ${result.title}
        Lien: ${result.url}
      `;
       zk.sendMessage(dest,{image : { url : result.thumbnail}, caption : caption},{quoted : ms}) ;
       zk.sendMessage(dest, { video: { url: result.hd  }, caption: 'facebook video downloader powered by *💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💠*' }, { quoted: ms });

    })
    .catch((error) => {console.log("Error:", error)
                      repondre('try fbdl2 on this link')});



  } catch (error) {
    console.error('Erreur lors du téléchargement de la vidéo :', error);
    repondre('Erreur lors du téléchargement de la vidéo.' , error);
  }
});


zokou({
  nomCom: "fbdl2",
  categorie: "Dave-Download",
  reaction: "📽️"
},
async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Insert a public facebook video link! !');
    return;
  }

  const queryURL = arg.join(" ");

  try {
     getFBInfo(queryURL)
    .then((result) => {
       let caption = `
        titre: ${result.title}
        Lien: ${result.url}
      `;
       zk.sendMessage(dest,{image : { url : result.thumbnail}, caption : caption},{quoted : ms}) ;
       zk.sendMessage(dest, { video: { url: result.sd  }, caption: 'facebook video downloader powered by *💠𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 💠*' }, { quoted: ms });

    })
    .catch((error) => {console.log("Error:", error)
                      repondre(error)});



  } catch (error) {
    console.error('Erreur lors du téléchargement de la vidéo :', error);
    repondre('Erreur lors du téléchargement de la vidéo.' , error);
  }
});

// Request for Muvies
zokou({
  nomCom: "movie",
  categorie: "Dave-Search",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!arg[0]) {
    repondre("Quel film veux-tu ?");
    return;
  }

  const movieTitle = arg.join(" ");
  const movie = await getJson(
    `http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(movieTitle)}&plot=full`
  );

  if (movie.Response !== 'True') {
    repondre('*Not found*');
    return;
  }

  let msg = '';
  const url = movie.Poster;
  delete movie.Poster;
  delete movie.Response;
  delete movie.Ratings;

  for (const data in movie) {
    if (movie[data] !== 'N/A') {
      msg += `*${data} :* ${movie[data]}\n`;
    }
  }

  if (url === 'N/A') {
    repondre(msg.trim());
  } else {
    await zk.sendMessage(origineMessage.from, { url }, { caption: msg.trim() });
  }
});
