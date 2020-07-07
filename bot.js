const Discord = require('discord.js');
const client = new Discord.Client();


//Logs
function log(info){
	client.channels.resolve("729155101746528286").send(info);
}
function adminlog(info){
	client.channels.resolve("729744865776107550").send(info);
}
function msToString(ms){
	var hours=((ms/1000)/3600)|0;
	var minutes=((ms/1000)-(hours*3600))/60|0;
	var seconds=((ms/1000)-(hours*3600)-(minutes*60))|0;
	return "**"+hours+"** hours, **"+minutes+"** minutes and **"+seconds+"** seconds";
}
async function updateProfile(member,points){
	const data = await info.load(member.id);
		var c=data;
		if(c.firstMessage==undefined) c.firstMessage=Date.now();
		if((Date.now()-c.firstMessage)>=86400000){
			c.firstMessage=Date.now();
			var t=(c.messageAveragePerDay*0.7+c.messagesSentToday*0.3);
			c.messageAveragePerDay=t|0;
			c.messagesSentToday=0;
				
				//Activity
				var roles=["728036419314122755","728036310513614851","728036144666771476","728035985492934750","728035734359113769","728035637810167910","728035417441697794"]
				var change=0; //Dead
				if(t>125){
					change=6; //Insanely Active
				} else if(t>100){
					change=5; //Very Active
				} else if(t>70){
					change=4; //Active
				} else if(t>40){
					change=3; //Usually Active
				} else if(t>10){
					change=2; //Not very active
				} else if(t>2){
					change=1; //Inactive
				}
				if(member.roles.cache.array().find(t=>{return (t.id==roles[change]);})==undefined){
					member.roles.remove(roles).then(mb=>{
						mb.roles.add(roles[change]);
					});
				}	
			}
		c.messagesSentToday+=points;
		c.messagesEverSent+=points;
		var level=c.level;
		while(c.messagesEverSent>(30*Math.pow(1.6,level-1))){
		      level+=1;
		}
		if(level>c.level){
			const message=new Discord.MessageEmbed().setDescription("🎊 **Congratulations <@!"+member.id+">!** You reached level **"+level+"**!").setColor("GREEN");
			if(member.lastMessage!=null) member.lastMessage.channel.send(message);
			else { member.guild.channels.cache.get("728025726556569631").send(message) }
		}
		c.level=level;
		return await info.save(member.id,c);
}

async function mute(member,seconds){
	var data = await info.load(member.id);
	data.mutedTo=Date.now()+seconds*1000;
	await member.roles.add("728216095835815976");
	await info.save(member.id,data);
	setTimeout(function(){
		member.roles.remove("728216095835815976");
	},seconds*1000);
	return true;
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
	client.guilds.cache.array()[0].roles.resolve("728216095835815976").members.array().forEach(member=>{
		info.load(member.id).then(data=>{
			if(![0,undefined].includes(data.mutedTo)) {
				if(Date.now()>data.mutedTo) {
					member.roles.remove("728216095835815976");
				} else {
					setTimeout(function(){
						member.roles.remove("728216095835815976");
					},data.mutedTo-Date.now());
				}
			}
		});
	});
	client.guilds.cache.array()[0].members.cache.array().forEach(member=>{
		info.load(member.id,data=>{
			var remTime=data.firstMessage+86405000-Date.now();
			if(remTime>0){
				setTimeout(function(){
					updateProfile(member,0);
				},remTime);
			} else {
				updateProfile(member,0);	
			}
		});
	});
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
	if(message.channel.type=="dm") return;
	
	log(message.author.username + " `ID: " + message.member.id + "` sent message `ID : " + message.id + "` in channel '" + message.channel.name + "' `ID: " + message.channel.id + "`\n```"+message.content+"```");
	
	//Anti-Spam
	if(message.author.antiSpamCount==undefined) message.author.antiSpamCount=0;
	if(message.author.antiSpamCount==0) message.author.antiSpamFirst=Date.now();
	message.author.antiSpamCount+=1;
	
	if(Date.now()-message.author.antiSpamFirst<4000){
		if(message.author.antiSpamCount>8){
			mute(message.member,3600).then(()=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+message.member.id+"> was muted for **1** hour.\n**Reason:** Spam.").setColor("RED"))
					adminlog(message.member.displayName+" `ID: "+message.member.id+"` was automatically muted for **1** hour.\n**Reason:** Spam.")
			});
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
		
	
	if(message.member.messageCombo==undefined) message.member.messageCombo=0;
	message.member.messageCombo++;
	if(message.member.messageCombo>=10){
		message.member.messageCombo=0;
		updateProfile(message.member,10);
	}
	
	//Commands
	if(message.channel.id!="728025726556569631") return;
	var args=message.content.toLowerCase().split(" ");
	var args_case=message.content.split(" ");
	if(args[0].startsWith("!")) args[0].replace("!","");
	
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
		updateProfile(userToFind,0).then(()=>{
			info.load(userToFind.id).then(data=>{
				var last=(30*Math.pow(1.6,data.level-2));
				if(data.level==1) last=0;
				const all=data.messagesEverSent-last;
				const next=(30*Math.pow(1.6,data.level-1))-last;
				const prog=all/next;
				message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+">'s level is " + data.level + "!").addField("Progress","█".repeat(Math.max(prog*10,0)|0)+"▒".repeat(Math.max(1-prog,0)*10|0)+" "+(prog*100|0)+"%").setColor("GREEN"));
			});
		});
	} else if(args[0]=="uptime"){
		message.channel.send(new Discord.MessageEmbed().setDescription("I've been up for "+msToString(client.uptime)+"!").setColor("YELLOW"));
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
		updateProfile(userToFind,0).then(()=>{
			info.load(userToFind.id).then(data=>{
				var last=(30*Math.pow(1.6,data.level-2));
				if(data.level==1) last=0;
				const all=data.messagesEverSent-last;
				const next=(30*Math.pow(1.6,data.level-1))-last;
				const prog=all/next;
				message.channel.send(new Discord.MessageEmbed().setTitle(userToFind.displayName+"'s profile").addField("Level",data.level).addField("Progress","█".repeat(Math.max(prog*10,0)|0)+"▒".repeat(Math.max(1-prog,0)*10|0)+" "+(prog*100|0)+"%").addField("Gold",data.gold).addField("Joined at",new Date(userToFind.joinedTimestamp)).setColor("RANDOM").setThumbnail(userToFind.user.displayAvatarURL()));
			})
		});
		
	} else if(args[0]=="color"){
		const roles=["729438971456651394","729438974854168636","729438972161556610","729437918078435358","729421506328657950","729437914542505985","729437921802846239","729421500137865261","729421492835844207","729421510804242492","729421484560482379","729421488431562752","729421479846084648","729421473810219079","729421468752150689","729421463614128238","729395073904672860","729392489617948783"]
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
	
		const commands = [{
			name: "ping",
			description: "Shows the bot's latency.",
			usage: "ping"
		},{
			name: "uptime",
			description: "Shows the bot's uptime.",
			longDescription: "This command shows for how much time the bot was up.",
			usage: "uptime"
		},{
			name: "profile",
			description: "Displays your/someone's full profile.",
			usage: "profile [<user>]"
		},{
			name: "level",
			description: "Displays your/someone's level.",
			usage: "level [<user>]"
		},{
			name: "gold",
			description: "Displays your/someone's gold.",
			usage: "gold [<user>]"
		},{
			name: "color",
			description: "Name color commands.",
			longDescription: "This commands is used to change your name color, or to see your/someone's color.",
			subcommands: "set, list",
			usage: "color <set/list> (color name)"
		}];
		
		if(["",undefined].includes(args[1])){
			var embed= new Discord.MessageEmbed().setColor("AQUA").setTitle("Command list").setDescription("Use `help <command>` for specific command help");
			commands.forEach(cmd=>{
				embed.addField(cmd.name,cmd.description);
			})
			message.channel.send(embed);
		} else if(commands.find(t=>(t.name==args[1]))!=undefined){
			
			const cmd=commands.find(t=>(t.name==args[1]));
			var embed= new Discord.MessageEmbed().setColor("fafafa").setTitle("Command help: " + args[1]);
			embed.addField("Description",cmd.longDescription||cmd.description);
			embed.addField("Sub-commands",cmd.subcommands||"None.");
			embed.addField("Usage","*"+cmd.usage+"*")
			message.channel.send(embed);
			
		} else {
			message.channel.send(new Discord.MessageEmbed().setDescription("This command doesn't exist :(").setColor("RED"));
		}
		
	} else if(message.member.roles.cache.get("728034751780356096")||message.member.roles.cache.get("728034436997709834")){
	
		if(args[0]=="mute"){
			try{
				const muted=message.mentions.members.array()[0];
				const time=eval(args[2].replace("m","*60").replace("h","*3600"));

				const reason=args.join(" ").replace(args[0]+" ","").replace(args[1]+" ","").replace(args[2]+" ","");
				if(![muted,time].includes(undefined)){
					mute(muted,time).then(()=>{
						message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+muted.id+"> was muted by <@!"+message.author.id+"> for "+msToString(time*1000)+".\n**Reason:** "+(reason||"Unspecified.")).setColor("RED"));
						adminlog(muted.displayName+" `ID: "+muted.id+"` was muted by "+message.member.displayName+""+" `ID: "+message.author.id+"` for "+msToString(time*1000)+".\n**Reason:** "+(reason||"Unspecified."))
					});	
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("**Syntax:** mute <user> <time> [reason]").setColor("GRAY"))
				}
			}catch(err){
				message.channel.send(new Discord.MessageEmbed().setDescription("**Syntax:** mute <user> <time> [reason]").setColor("GRAY"))
			}
		} else if(args[0]=="event"){
		
			if(args[1]=="create"){
				if(["",undefined].includes(args[2])){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an identifier for the event.").setColor("GRAY"));
				} else {
					if (message.guild.events==undefined) message.guild.events = [];
					message.guild.events.push({
						id: args[2],
						host: message.member
					});
					message.channel.send(new Discord.MessageEmbed().setDescription("Event created with identifier: **"+args[2]+"**.").setColor("GREEN"))
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` created event with identifier: " + args[2]);
				}
			} else if(args[1]=="name"){
				if((["",undefined].includes(args[2]))||(message.guild.events.find(e=>(e.id==args[2]))==undefined)){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an existing event identifier.").setColor("GRAY"));
				} else if(["",undefined].includes(args[3])) {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct name for the event.").setColor("GRAY"));
				} else {
					const name=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
					message.guild.events.find(e=>(e.id==args[2])).name=name;
					message.channel.send(new Discord.MessageEmbed().setDescription("Event **"+args[2]+"** named: **"+name+"**.").setColor("GREEN"))
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` named event with identifier: " + args[2] + " to **"+name+"**");
				}
			} else if(args[1]=="description"){
				if((["",undefined].includes(args[2]))||(message.guild.events.find(e=>(e.id==args[2]))==undefined)){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an existing event identifier.").setColor("GRAY"));
				} else if(["",undefined].includes(args[3])) {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct description for the event.").setColor("GRAY"));
				} else {
					const desc=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
					message.guild.events.find(e=>(e.id==args[2])).desc=desc;
					message.channel.send(new Discord.MessageEmbed().setDescription("Event **"+args[2]+"**'s description updated: **"+desc+"**.").setColor("GREEN"))
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` updated description of event with identifier: " + args[2] + " to **"+desc+"**");
				}
			} else if(args[1]=="startsin"){
				if((["",undefined].includes(args[2]))||(message.guild.events.find(e=>(e.id==args[2]))==undefined)){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an existing event identifier.").setColor("GRAY"));
				} else if(["",undefined].includes(args[3])) {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct time for the event.").setColor("GRAY"));
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` updated date of event with identifier: " + args[2] + " to **"+(new Date(Date.now()+time))+"**");
				} else {
					
					try{const time=eval(args[3].replace("m","*60").replace("h","*3600"));
					message.guild.events.find(e=>(e.id==args[2])).time=Date.now()+time*1000;
					message.channel.send(new Discord.MessageEmbed().setDescription("Event **"+args[2]+"** starts in: "+msToString(time*1000)+".").setColor("GREEN"))
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` updated date of event with identifier: " + args[2] + " to **"+(new Date(Date.now()+time*1000))+"**");
					   
					   }catch(err){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct time for the event.").setColor("GRAY"));
					}
					
				}
			} else if(args[1]=="announce"){
				if((["",undefined].includes(args[2]))||(message.guild.events.find(e=>(e.id==args[2]))==undefined)){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an existing event identifier.").setColor("GRAY"));
				} else {
				
					const event=message.guild.events.find(e=>(e.id==args[2]));
					const embed= new Discord.MessageEmbed().setTitle(event.name).setDescription(event.desc).setColor("AQUA").addField("Host","<@!"+event.host.id+">").addField("Date",new Date(event.time)).addField("Starts in",msToString(event.time-Date.now()));
					message.guild.channels.cache.get("728022865622073446").send("<@&728223648942653451> <@&728224459487576134> **New Event!**",embed);
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` announced event with identifier: " + args[2]);
					
				}
				
			} else if(args[1]=="start"){
			
					const embed= new Discord.MessageEmbed().setTitle("Event Started!").setColor("GREEN");
					message.guild.channels.cache.get("728022865622073446").send(embed);
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` started the event.");
				
			} else if(args[1]=="end"){
			
					const embed= new Discord.MessageEmbed().setTitle("Event ended! :(").setColor("RED");
					message.guild.channels.cache.get("728022865622073446").send(embed);
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` ended the event.");
				
			}
			
		}
	}
	
});

//VC
client.on("voiceStateUpdate",(o,n)=>{

	const vcs=["728008557911605341","728027365820727407","728027460515659838","728027677344268337","728027756906020865","728027832747556892","728027908127457370"];
	const mvcs=["728030297911853176","728029167286878240"];
	if(n.channel==o.channel) return;
	if(n.channel!=null){
		log(n.member.displayName + " `ID: " + n.member.id + "` joined voice channel **"+n.channel.name+"** `ID : " + n.channel.id + "`");
		if(vcs.includes(n.channel.id)){
			n.member.roles.remove(["729502041122013195","729502308634853456"]).then(m=>{
			m.roles.add("729502041122013195");
			});
			n.member.guild.channels.cache.get("729354613064728636").send(new Discord.MessageEmbed().setDescription("<@!"+n.member.id+"> joined **" + n.channel.name + "**").setColor("GREEN"));
		} else if(mvcs.includes(n.channel.id)){
			n.member.roles.remove(["729502041122013195","729502308634853456"]).then(m=>{
			m.roles.add("729502308634853456");
			});
			n.member.guild.channels.cache.get("728029565607346227").send(new Discord.MessageEmbed().setDescription("<@!"+n.member.id+"> joined **" + n.channel.name + "**").setColor("GREEN"));
		} 
	} else if(o.channel!=null){
		log(o.member.displayName + " `ID: " + o.member.id + "` left voice channel **"+o.channel.name+"** `ID : " + o.channel.id + "`");
		if(vcs.includes(o.channel.id)){
			n.member.guild.channels.cache.get("729354613064728636").send(new Discord.MessageEmbed().setDescription("<@!"+o.member.id+"> left **" + o.channel.name + "**").setColor("RED"));
			n.member.roles.remove(["729502041122013195","729502308634853456"]);
		} else if(mvcs.includes(o.channel.id)){
			n.member.guild.channels.cache.get("728029565607346227").send(new Discord.MessageEmbed().setDescription("<@!"+o.member.id+"> left **" + o.channel.name + "**").setColor("RED"));
			n.member.roles.remove(["729502041122013195","729502308634853456"]);
		}
	}
	
});

///Welcoming
client.on('guildMemberAdd',member=>{

	log("Member " + member.displayName + " `ID: "+member.id+"` joined the guild.")
	var startRoles=["728018741174075412","728212856046223480","728035160448041021","728018742965174382","728031955685343312","728214239784861776","728032333671825479","729438972161556610"];
	var welcome_channel=member.guild.channels.cache.get("728008557911605340");
	welcome_channel.send(new Discord.MessageEmbed().addField("Hey hey hey!","We've been waiting for you!").setTitle("Welcome " + member.displayName + "!").setThumbnail(member.user.displayAvatarURL()));
	member.roles.add(startRoles);
	member.send(new Discord.MessageEmbed().setTitle("Welcome " + member.displayName + " to " + member.guild.name + "!").setDescription("Make sure to read rules! Then you can customize your profile by choosing a color in #color and picking some roles in #role-self-assign, have fun <3!").setColor("fafafa"));
	
});

client.on('guildMemberRemove',member=>{
	log("Member " + member.displayName + " `ID: "+member.id+"` left the guild.");
});


// -------------------------------------------
//
//                   Music Bot
//
// -------------------------------------------

const music = require("discord.js-musicbot-addon")
music.start(client, {
	youtubeKey: "AIzaSyAT-lCRVKfYrprwdKqk69TszCfoh1jqqjM",
	botPrefix: "music ",
	maxQueueSize: 0,
	musicPresence: true,
	clearPresence: true,
	channelWhitelist: ["728029565607346227"]
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


