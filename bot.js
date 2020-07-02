const Discord = require('discord.js');
let snekfetch = require("snekfetch");
const client = new Discord.Client();
let request = require('request');

client.on('message',message=>{

	if(message.content=="who is the best?"){
		message.channel.send("Aouab! (and anxxie ofc)");	
	}
	
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


