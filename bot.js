const Discord = require('discord.js');
const client = new Discord.Client();

//Data Management
var info = {
	exists: false,
	init: async function(data){
		await client.channels.cache.get("728363315138658334").send(JSON.stringify(data));
	},
	save: async function(id,data){
		var exists=false;
		var col = await client.channels.cache.get("728363315138658334").messages.fetch();
		var messages = col.array();
		for(var i=0;i<messages.length;i++){
			if(messages[i].content.includes(id)){
				exists=messages[i].edit(JSON.stringify(data));	
			}
		}
		if(exists==false){
			this.init(data);
		}
	},
	load: async function(id){	
		var exists=false;
		var col = await client.channels.cache.get("728363315138658334").messages.fetch();
		messages=col.array();
		for(var i=0;i<messages.length;i++){
			if(messages[i].content.includes(id)){
				exists=JSON.parse(messages[i].content);
			} 
		}
		if(exists==false){
			//Default data
			var def={
				id: id,
				level: 1,
				gold: 100,
				messageAveragePerDay: 0,
				messagesSentToday: 0,
				messagesEverSent: 0,
				firstMessage: undefined
			}
			this.init(def);
			exists=def;
		}
		return exists;
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

//User event
client.on('message',message=>{

	//Normal messages
	if(message.author.bot) return;
	
		//Membership
		var days=((message.member.joinedTimestamp-Date.now())/(1000*24*3600));
		var roles=["728214239784861776","728214473638412310","728214612222410784","728214677578055713","728214723182723183","728214892187746365"]
		var change=0;
		if(days>730){
			change=5; //Two years
		} else if(days>365){
			change=4; //One year
		} else if(days>182){
			change=3; //6 Months
		} else if(days>90){
			change=2; //3 Months
		} else if(days>30){
			change=1; //1 Month	
		}
		if(message.member.roles.cache.array().find(t=>{return (t.id==roles[change]);})==undefined){
			message.member.roles.remove(roles).then(mb=>{
				mb.roles.add(roles[change]);
			});
		}
		
	
	if(message.author.messageCombo==undefined) message.author.messageCombo=0;
	message.author.messageCombo++;
	if(message.author.messageCombo>=20){
		message.author.messageCombo=0;
		info.load(message.author.id).then(data=>{
			var c=data;
			if(c.firstMessage==undefined) c.firstMessage=Date.now();
			if(Date.now()-c.firstMessage>86400000){
				c.firstMessage=Date.now();
				var t=(c.messageAveragePerDay+c.messagesSentToday)/2;
				c.messageAveragePerDay=t;
				c.messagesSentToday=0;
			}
			c.messagesSentToday+=20;
			c.messagesEverSent+=20;
			info.save(message.author.id,c);
			
		});
	}
	
	//Commands
	if(message.channel.id!="728025726556569631") return;
	var args=message.content.toLowerCase().split(" ");
	
	if(args[0]=="ping"){
		message.channel.send("**Pong!** My ping is *"+(Date.now()-message.createdTimestamp|0)+" ms*!");
	} else if(args[0]=="level"){
		info.load(message.author.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setTitle("You are level " + data.level + "!"));
		});
	} else if(args[0]=="uptime"){
		message.channel.send("I've been up for **" +((client.uptime/1000)|0)+"** seconds!")
	} else if(args[0]=="gold"){
		info.load(message.author.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setTitle("You have " + data.gold + " gold!"));
		})	
	}
	
	
	
	
});

///Welcoming
client.on('guildMemberAdd',member=>{

	var welcome_channel=member.guild.channels.find("id","728008557911605340");
	welcome_channel.send(new Discord.MessageEmbed().addField("Hey hey hey!","We've been waiting for you!").setTitle("Welcome " + member.displayName + "!").setThumbnail(member.user.displayAvatarURL()));
	
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


