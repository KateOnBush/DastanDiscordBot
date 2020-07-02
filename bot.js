const Discord = require('discord.js');
const client = new Discord.Client();

//Data Management
var info = {
	init: function(data){
		message.guild.channels.cache.get("728363315138658334").send(JSON.stringify(data));
	},
	save: function(id,data){
		message.guild.channels.cache.get("728363315138658334").messages.cache.toJSON().forEach(m=>{
			if(m.content.includes(id)){
				m.edit(JSON.stringify(data));	
			}
		});
	},
	load: function(id){
		message.guild.channels.cache.get("728363315138658334").messages.cache.toJSON().forEach(m=>{
			if(m.content.includes(id)){
				return JSON.parse(m.content));	
			} else {
				//Default data
				var def={
					id: id,
					level: 1,
					last_message: 0
				}
				this.init(def);
				return def;
			}
		});
	}
}

//Debug
client.on('message',message=>{

	if(message.author.bot) return;
	if(message.channel.id!="728356553672884276") return;
	try{
		message.channel.send("**Output:**\n```js\n" + eval(message.content) + "\n```");	
	}catch(err){
		message.channel.send("**Error:**\n```js\n" + err + "\n```");
	}
	
});
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


