const Discord = require('discord.js');
let snekfetch = require("snekfetch");
const client = new Discord.Client();
let request = require('request');

var welcome_gif="https://media1.tenor.com/images/9f75a735e474d9b8c127fd5383717f44/tenor.gif?itemid=13849146"

client.on('message',message=>{

	//Now let's get to real work lol
	
});

///Welcoming
client.on('guildMemberAdd',member=>{

	var welcome_channel=member.guild.channels.find("id","728008557911605340");
	welcome_channel.send(new Discord.RichEmbed().setTitle("Welcome " + member.displayName + "!").setImage(welcome_gif).setThumbnail(member.user.defaultAvatarURL));
	
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


