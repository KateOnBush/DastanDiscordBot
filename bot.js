const Discord = require('discord.js');
let snekfetch = require("snekfetch");
const client = new Discord.Client();
let request = require('request');

var welcome_gif="https://media1.tenor.com/images/9f75a735e474d9b8c127fd5383717f44/tenor.gif?itemid=13849146"


//Commands
client.on('message',message=>{

	if(message.channel.id!="728025726556569631") return;
	var args=message.content.toLowerCase().split(" ");
	
	if(args[0]=="ping"){
		message.channel.send("**Pong!** My ping is *"+(client.ping|0)+" ms*!");
	} else if(args[0]=="level"){
		message.channel.send("File saving isn't working yet so shut the fuck up");
	}
	
	
});

///Welcoming
client.on('guildMemberAdd',member=>{

	var welcome_channel=member.guild.channels.find("id","728008557911605340");
	welcome_channel.send(new Discord.MessageEmbed().addField("Hey hey hey!","We've been waiting for you!").setTitle("Welcome " + member.displayName + "!").setThumbnail(member.user.displayAvatarURL()));
	
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


