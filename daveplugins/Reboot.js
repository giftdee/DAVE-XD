
const {zokou}=require("../framework/zokou")
zokou({nomCom:"restart",categorie:"Dave-Mods",reaction:"📴"},async(dest,z,com)=>{
const{repondre,ms,dev,superUser}=com;
  if(!superUser)
  {
    return repondre("This command is for owner only");
  }
  const {exec}=require("child_process")

    repondre("💦𝐃𝐀𝐕𝐄-𝐗𝐌𝐃💦  Restarting....");
  exec("pm2 restart all");
})
