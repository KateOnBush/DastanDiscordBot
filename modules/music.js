const ytdl = require("ytdl-core");
const Discord = require("discord.js");

function array_from(array, from, join){ 
  return array.filter((t,i)=>i>=from);
}

module.exports = async function(client, message, args){

  if(args[0]=="play"){
     if(args[1]){
        let inf = await ytdl.getInfo(array_from(args,1).join(" "));
        message.channel.send("You looked for: " + inf.videoDetails.title + " in " + inf.videoDetails.video_url);
     }
  } else {
    
  }
  
}
