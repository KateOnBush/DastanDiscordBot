const Discord = require('discord.js');
const client = new Discord.Client();

//Logs
function log(info){
	client.channels.resolve("729155101746528286").send(info);
}

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
				exists=await messages[i].edit(JSON.stringify(data));
			}
		}
		if(exists==false){
			await this.init(data);
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
			await this.init(def);
			exists=def;
		}
		return exists;
	},
	check: async function(id){
		var exists=false;
		var col = await client.channels.cache.get("728363315138658334").messages.fetch();
		messages=col.array();
		for(var i=0;i<messages.length;i++){
			if(messages[i].content.includes(id)){
				exists=true;
			}
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
client.on('error',err=>{
	log("Error encountered: `"+err+"`");
});
client.on('ready',()=>{
	log("Ready!");
})

client.on('raw',event=>{
	if(event.t=="MESSAGE_REACTION_ADD"){
		const data=event.d;
		const channel = client.channels.resolve(data.channel_id);
		channel.messages.fetch(data.message_id).then(message=>{
			const emojiKey = (data.emoji.id) ? `${data.emoji.id}` : data.emoji.name;
			const react = message.reactions.cache.get(emojiKey);
			const member = message.guild.members.resolve(data.user_id);
			if(member.user.bot==true) return;
			log(member.displayName + " `ID: " + member.id + "` reacted with " + react.emoji.name + " on a message `ID : " + react.message.id + "` in channel '" + react.message.channel.name + "' `ID: " + react.message.channel.id + "`");
			if(react.message.channel.id!="729298706188468234") return;
			react.users.remove(member.id);
			const roleToAdd=react.message.mentions.roles.array().find(e=>{return message.content.includes(react.emoji.name + " - <@&" + e.id + ">")});
			const first=react.message.mentions.roles.array().find(e=>{return message.content.includes("0️⃣ - <@&" + e.id + ">")});
			const hasClickedRole=member.roles.cache.array().includes(roleToAdd);
			if(hasClickedRole){
				member.roles.remove(roleToAdd);
			} else if((react.emoji.name=="0️⃣")&&(first!=undefined)){
				member.roles.remove(message.mentions.roles).then(m=>{
					member.roles.add(roleToAdd);	
				});
			
			} else {
				if(first!=undefined) member.roles.remove(first);
				if(!react.message.content.includes("!multiple")){
					member.roles.remove(react.message.mentions.roles).then(m=>{
					m.roles.add(roleToAdd);
				});
				} else {
					member.roles.add(roleToAdd);
				}
			}
		});
	}
})

//User event
client.on('message',message=>{

	
	//Normal messages
	if(message.author.bot) return;
	
	log(message.author.username + " `ID: " + message.member.id + "` sent message `ID : " + message.id + "` in channel '" + message.channel.name + "' `ID: " + message.channel.id + "`\n```"+message.content+"```");
	
	//Anti-Spam
	if(message.author.antiSpamCount==undefined) message.author.antiSpamCount=0;
	if(message.author.antiSpamCount==0) message.author.antiSpamFirst=Date.now();
	message.author.antiSpamCount+=1;
	
	if(Date.now()-message.author.antiSpamFirst<4000){
		if(message.author.antiSpamCount>8){
			message.member.roles.add("728216095835815976");
			message.channel.send("<@!"+message.author.id+">, you have been muted for 1 hour.\n**Reason:** Spam.");
		}else if(message.author.antiSpamCount>5){
			message.delete().then(m=>{
				message.channel.send("<@!"+message.author.id+">, please don't spam!");
			});
		}
	} else {
		message.author.antiSpamCount=0;
	}
	
	if(message.author.checkedInfo!=true){
		info.check(message.author.id).then(r=>{
			if(!r) info.load(message.author.id);
			message.author.checkedInfo=true;
		});	
	}
	
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
	if(message.author.messageCombo>=10){
		message.author.messageCombo=0;
		info.load(message.author.id).then(data=>{
			var c=data;
			if(c.firstMessage==undefined) c.firstMessage=Date.now();
			if((Date.now()-c.firstMessage)>86400000){
				c.firstMessage=Date.now();
				var t=(c.messageAveragePerDay+c.messagesSentToday)/(1+((Date.now()-c.firstMessage)/86400000)|0);
				c.messageAveragePerDay=t|0;
				c.messagesSentToday=0;
				
					//Activity
					var roles=["728036419314122755","728036310513614851","728036144666771476","728035985492934750","728035734359113769","728035637810167910","728035417441697794"]
					var change=0; //Dead
					if(t>250){
						change=6; //Insanely Active
					} else if(t>200){
						change=5; //Very Active
					} else if(t>150){
						change=4; //Active
					} else if(t>90){
						change=3; //Usually Active
					} else if(t>30){
						change=2; //Not very active
					} else if(t>5){
						change=1; //Inactive
					}
					if(message.member.roles.cache.array().find(t=>{return (t.id==roles[change]);})==undefined){
						message.member.roles.remove(roles).then(mb=>{
							mb.roles.add(roles[change]);
						});
					}
					
					
				
			}
			c.messagesSentToday+=10;
			c.messagesEverSent+=10;
			
			info.save(message.author.id,c);
			
		});
	}
	
	//Commands
	if(message.channel.id!="728025726556569631") return;
	var args=message.content.toLowerCase().split(" ");
	
	if(args[0]=="ping"){
		var d=Date.now();
		message.channel.send(new Discord.MessageEmbed().setDescription("**Pong!**").setColor("RED")).then(msg => {
            		msg.edit(new Discord.MessageEmbed().setDescription("**Pong!** My latency is "+(Date.now()-d)+" ms!").setColor("GREEN"));
		});
	} else if(args[0]=="level"){
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		info.load(userToFind.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+">'s level is " + data.level + "!").setColor("GREEN"));
		});
	} else if(args[0]=="uptime"){
		var hours=((client.uptime/1000)/3600)|0;
		var minutes=((client.uptime/1000)-(hours*3600))/60|0;
		var seconds=((client.uptime/1000)-(hours*3600)-(minutes*60))|0;
		message.channel.send(new Discord.MessageEmbed().setDescription("I've been up for **"+hours+"** hours, **"+minutes+"** minutes and **"+seconds+"** seconds!").setColor("YELLOW"));
	} else if(args[0]=="gold"){
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		info.load(userToFind.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+"> has " + data.gold + " gold!").setColor("GOLD"));
		})	
	} else if(args[0]=="profile"){
		
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		info.load(userToFind.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setTitle(userToFind.displayName+"'s profile").addField("Level",data.level).addField("Gold",data.gold).addField("Joined at",new Date(userToFind.joinedTimestamp)).setColor("RANDOM").setThumbnail(userToFind.user.displayAvatarURL()));
		})
		
	} else if(args[0]=="color"){
		const roles=["729438971456651394","729438974854168636","729438972161556610","729437918078435358","729421506328657950","729437914542505985","729437921802846239","729421500137865261","729421492835844207","729421510804242492","729421484560482379","729421479846084648","729421473810219079","729421468752150689","729421463614128238","729395073904672860","729392489617948783"]
		if(args[1]=="list"){
			var cnt="";
			roles.forEach(t=>{
				cnt=cnt+"<@&"+t+">";	
			})
			message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").addField("Available colors:",cnt));
		} else if(args[1]=="set"){
			const chosenRole = message.guild.roles.cache.find(t=>(t.name==args[2]));
			if(chosenRole==undefined){
				message.channel.send(new Discord.MessageEmbed().setDescription("That color doesn't exist :(").setColor("RED"))
			} else {
				if(message.member.roles.cache.get(chosenRole.id)==undefined){
					message.channel.startTyping();
					message.member.roles.remove(roles).then(m=>{
						message.member.roles.add(chosenRole).then(mm=>{
							message.channel.send(new Discord.MessageEmbed().setDescription("Your color is now **"+args[2]+"**").setColor(chosenRole.color)).then(mmm=>{
							message.channel.stopTyping();
							});
							
						});
					})
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Your color is already **"+args[2]+"**").setColor("RED"));
				}
			}
		} else {
			var member=message.mentions.members.array()[0];
			if(member==undefined){
				member=message.member;	
			}
			var role=undefined;
			roles.forEach(t=>{
				if(member.roles.cache.get(t)!=undefined) role=member.roles.cache.get(t);
			})
			if(role==undefined) role=member.guild.roles.cache.get("729438972161556610");
			member.roles.add(role);
			message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+member.id+">'s color is **"+role.name+"**").setColor(role.color))
		}
	} else if(args[0]=="help"){
	
		const commands == [{
			name: "ping",
			description: "Shows the bot's latency.",
		},{
			name: "uptime",
			description: "Shows the bot's uptime.",
			longDescription: "This command shows for how much time the bot was up.",
		},{
			name: "profile",
			description: "Displays your/someone's full profile."
		},{
			name: "level",
			description: "Displays your/someone's level."
		},{
			name: "gold",
			description: "Displays your/someone's gold."
		},{
			name: "color",
			description: "Name color commands.",
			longDescription: "This commands is used to change your name color, or to see your/someone's color.",
			subcommands: "set, list"
		}];
		
		if(!["",undefined].includes(args[1])){
			var embed= new Discord.MessageEmbed().setColor("AQUA").setTitle("Command list").setDescription("Use `help <command>` for specific command help");
			commands.forEach(cmd=>{
				embed.addField(cmd.name,cmd.description);
			})
			message.channel.send(embed);
		} else if(commands.find(t=>(t.name==args[1]))!=undefined){
			
			const cmd=commands.find(t=>(t.name==args[1]));
			var embed= new Discord.MessageEmbed().setColor("WHITE").setTitle("Command help: " + args[1]);
			embed.addField("Description",cmd.longDescription||cmd.description);
			embed.addField("Sub-commands",cmd.subcommands||"None.");
			message.channel.send(embed);
			
		} else {
			message.channel.send(new Discord.MessageEmbed().setDescription("This command doesn't exist :(").setColor("RED"));
		}
		
	}
	
	
});

///Welcoming
client.on('guildMemberAdd',member=>{

	var startRoles=["728018741174075412","728212856046223480","728035160448041021","728018742965174382","728031955685343312","728214239784861776","728032333671825479","729438972161556610"];
	var welcome_channel=member.guild.channels.cache.get("728008557911605340");
	welcome_channel.send(new Discord.MessageEmbed().addField("Hey hey hey!","We've been waiting for you!").setTitle("Welcome " + member.displayName + "!").setThumbnail(member.user.displayAvatarURL()));
	member.roles.add(startRoles);
	
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


