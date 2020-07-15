const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');

let dataCache = [];

//Logs
function log(info){
	client.channels.resolve("729155101746528286").send(info);
}
function adminlog(info){
	client.channels.resolve("729744865776107550").send(info);
}
function msToString(ms){
	var weeks=((ms/1000)/604800)|0;
	var days=((ms/1000)-(weeks*604800))/86400|0;
	var hours=((ms/1000)-(weeks*604800)-(days*86400))/3600|0;
	var minutes=((ms/1000)-(weeks*604800)-(days*86400)-(hours*3600))/60|0;
	var seconds=((ms/1000)-(weeks*604800)-(days*86400)-(hours*3600)-(minutes*60))|0;
	let s = `${weeks>0 ? `**${weeks}** weeks, ` : '' }` + `${days>0 ? `**${days}** days, ` : '' }` + `${hours>0 ? `**${hours}** hours, ` : '' }` + `${minutes>0 ? `**${minutes}** minutes and ` : '' }` + `**${seconds}** seconds`;
	return s.replace(" and **0** seconds","");
}
function timeformatToSeconds(f){
	return eval(f.replace("s","+").replace("m","*60+").replace("h","*3600+").replace("d","*3600*24+").replace("w","*3600*24*7+").replace("mo","*3600*24*30+").replace("y","*3600*24*365+")+"0");	
}
function levelXp(level){
return 30*level*(1+level);
}
function restart(){
	log("Restarting...")
	var token = '47e28c9c-9dd4-47b7-9219-d3c0d65ee334';
	var appName = 'manic353-bot';
	var dynoName = 'worker';
	request.delete(
	    {
		url: 'https://api.heroku.com/apps/' + appName + '/dynos/',
		headers: {
		    'Content-Type': 'application/json',
		    'Accept': 'application/vnd.heroku+json; version=3',
		    'Authorization': 'Bearer ' + token
		}
	    },
	    function(error, response, body) {
		// Do stuff
		console.log(error);
		console.log(response)
	    }
	)	
}
function eventReminder(){

	client.guilds.cache.array()[0].channels.cache.get("728022865622073446").messages.fetch({limit:1}).then(ms=>{
		let message=ms.array()[0];
		let em=message.embeds[0];
		if((em!=undefined)&&(em.footer!=undefined)){
			let time=parseInt(em.footer.text.replace("!eventannounce ",""));
			if((time!=NaN)&&(time-Date.now()>0)){
				if(time-Date.now()>0) setTimeout(function(){
					message.guild.roles.fetch("730598527654297771").then(role=>{
						role.members.array().forEach(member=>{
							member.send(new Discord.MessageEmbed().setDescription("🔔 Event is starting shortly...").setColor("PURPLE"));
						});
					});
				},time-Date.now());
				
				if(time-Date.now()-3600*1000>0) setTimeout(function(){
					message.guild.roles.fetch("730598527654297771").then(role=>{
						role.members.array().forEach(member=>{
							member.send(new Discord.MessageEmbed().setDescription("🔔 Event is starting in **1** hour!").setColor("PURPLE"));
						});
					});
				},time-Date.now()-3600*1000);
				
				if(time-Date.now()-1800*1000>0) setTimeout(function(){
					message.guild.roles.fetch("730598527654297771").then(role=>{
						role.members.array().forEach(member=>{
							member.send(new Discord.MessageEmbed().setDescription("🔔 Event is starting in **30** minutes!").setColor("PURPLE"));
						});
					});
				},time-Date.now()-1800*1000);
				
				if(time-Date.now()-900*1000>0) setTimeout(function(){
					message.guild.roles.fetch("730598527654297771").then(role=>{
						role.members.array().forEach(member=>{
							member.send(new Discord.MessageEmbed().setDescription("🔔 Event is starting in **15** minutes!").setColor("PURPLE"));
						});
					});
				},time-Date.now()-900*1000);
				
				if(time-Date.now()-300*1000>0) setTimeout(function(){
					message.guild.roles.fetch("730598527654297771").then(role=>{
						role.members.array().forEach(member=>{
							member.send(new Discord.MessageEmbed().setDescription("🔔 Event is starting in **5** minutes!").setColor("PURPLE"));
						});
					});
				},time-Date.now()-300*1000);
				
				if(time-Date.now()-3600*3*1000>0) setTimeout(function(){
					message.guild.roles.fetch("730598527654297771").then(role=>{
						role.members.array().forEach(member=>{
							member.send(new Discord.MessageEmbed().setDescription("🔔 Event is starting in **3** hours!").setColor("PURPLE"));
						});
					});
				},time-Date.now()-3600*3*1000);
			}
		}
	})
	
}
function numberBeautifier(number,sep){
  return (number+"").split("").map((item,i,array)=>{if((array.length-i-1)%3==0&&(i!=array.length-1)) return item+sep; else return item;}).join("");
}
function membershipUpdate(member){
		//Membership
		var days=((Date.now()-member.joinedTimestamp)/(1000*24*3600));
		var roles=["728214239784861776","730628941429342208","728214473638412310","728214612222410784","728214677578055713","728214723182723183","728214892187746365"]
		var change=0;
		if(days>730){
			change=6; //Two years
		} else if(days>365){
			change=5; //One year
		} else if(days>182){
			change=4; //6 Months
		} else if(days>90){
			change=3; //3 Months
		} else if(days>30){
			change=2; //1 Month
		} else if(days>7){
			change=1; //1 Month
		}
		if(member.roles.cache.array().find(t=>{return (t.id==roles[change]);})==undefined){
			member.roles.remove(roles).then(mb=>{
				mb.roles.add(roles[change]);
			});
		}	
}
async function updateProfile(member,points){
	if(member.user.bot) return;
	membershipUpdate(member);
	const data = await info.load(member.id);
		var c=data;
		if(c.firstMessage==undefined) c.firstMessage=Date.now();
		if((Date.now()-c.firstMessage)>=86400000){
			setTimeout(function(){
				updateProfile(member,0);
			},86400000);
			c.firstMessage=Date.now();
			var t=(c.messageAveragePerDay*0.7+c.messagesSentToday*0.3);
			c.messageAveragePerDay=t|0;
			c.messagesSentToday=0;
				
				//Activity 
				var roles=["728036419314122755","728036310513614851","728036144666771476","728035985492934750","728035734359113769","728035637810167910","728035417441697794"]
				var change=0; //Dead
				if(t>350){
					change=6; //Insanely Active
				} else if(t>175){
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
		let mult=1;
		if(member.roles.cache.array().find(rl=>rl.id=="732234963310608426")!=undefined){
			mult=2;
		}
		c.messagesSentToday+=points*mult;
		c.messagesEverSent+=points*mult;
		var level=c.level;
		let gold=c.gold;
		while(c.messagesEverSent>levelXp(level)){
			level+=1;
			gold+=50;
			if(level%5==0) gold+=200;
		}
		if(level>c.level){
			const message=new Discord.MessageEmbed().setDescription("🎊 **Congratulations <@!"+member.id+">!** You reached level **"+level+"**!").setColor("GREEN");
			message.setDescription(message.description + "\nYou have received **"+(gold-c.gold)+"** gold!");
			if(member.lastMessage!=null) member.lastMessage.channel.send(message);
			else { member.guild.channels.cache.get("728025726556569631").send(message) }
		}
		c.level=level;
		c.gold=gold;
		return await info.save(member.id,c);
}

async function mute(member,seconds){
	var data = await info.load(member.id);
	if(data.mutedTo==undefined) data.mutedTo=0;
	data.mutedTo=Math.max(Date.now(),data.mutedTo)+seconds*1000;
	await member.roles.add("728216095835815976");
	await info.save(member.id,data);
	setTimeout(function(){
		member.roles.remove("728216095835815976");
	},seconds*1000);
	return true;
}

async function unmute(member){
	var data = await info.load(member.id);
	data.mutedTo=0;
	await member.roles.remove("728216095835815976");
	await info.save(member.id,data);
	return true;
}

//Data Management
var info = {
	exists: false,
	init: async function(data){
		await client.channels.cache.get("728363315138658334").send(JSON.stringify(data));
	},
	save: async function(id,data){
		var exists=undefined;
		let messageID = undefined;
		let toEdit=undefined;
		if(dataCache.find(i=>i.id==id)!=undefined){ messageID = dataCache.find(i=>i.id==id).message};
		if(messageID==undefined){
			var col = await client.channels.cache.get("728363315138658334").messages.fetch({limit: (client.guilds.cache.array()[0].memberCount+5)});
			var messages = col.array();
			for(var i=0;i<messages.length;i++){
				if(messages[i].content.includes(id)){
					toEdit=messages[i];
				}
			}
		} else if(client.channels.cache.get("728363315138658334").messages.cache.array().find(m=>m.id==messageID)==undefined){
			toEdit=await client.channels.cache.get("728363315138658334").messages.fetch(messageID);
		} else {
			toEdit=client.channels.cache.get("728363315138658334").messages.cache.array().find(m=>m.id==messageID);
		}	
		exists=await toEdit.edit(JSON.stringify(data));
		if(exists==undefined){
			await this.init(data);
		}
	},
	load: async function(id){	
		var exists=undefined;
		let messageID = undefined;
		if(dataCache.find(i=>i.id==id)!=undefined){ messageID = dataCache.find(i=>i.id==id).message};
		if(messageID==undefined){
			var col = await client.channels.cache.get("728363315138658334").messages.fetch({limit: (client.guilds.cache.array()[0].memberCount+5)});
			messages=col.array();
			for(var i=0;i<messages.length;i++){
				if(messages[i].content.includes(id)){
					dataCache.push({
						id: id,
						message: messages[i].id
					});
					exists=JSON.parse(messages[i].content);
				} 
			}
		} else if(client.channels.cache.get("728363315138658334").messages.cache.array().find(m=>m.id==messageID)==undefined){
			let msg=await client.channels.cache.get("728363315138658334").messages.fetch(messageID);
			exists=JSON.parse(msg.content);
		} else {
			exists=JSON.parse(client.channels.cache.get("728363315138658334").messages.cache.array().find(m=>m.id==messageID).content);
		}
		if(exists==undefined){
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
		} else {	
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

	if(message.channel.type=="dm") return;
	if(message.author.bot) return;
	if(message.author.id!="123413327094218753") return;
	if(message.channel.id!="728356553672884276"&&!message.content.startsWith("executehere")) return;
	try{
		message.channel.send("**Output:**\n```js\n" + eval(message.content.replace("executehere","")) + "\n```");	
	}catch(err){
		message.channel.send("**Error:**\n```js\n" + err + "\n```");
	}
	
});
client.on('error',err=>{
	log("Error encountered: `"+err+"`");
});
client.on('ready',()=>{
	log("Ready!");
	eventReminder();
	client.guilds.cache.array()[0].roles.fetch("728216095835815976").then(role=>{
		role.members.array().forEach(member=>{
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
	});
	client.guilds.cache.array()[0].members.fetch().then(members=>{
		members.array().forEach(member=>{
			info.load(member.id).then(data=>{
				if(data.firstMessage==null) data.firstMessage=Date.now();
				var remTime=data.firstMessage+86405000-Date.now();
				info.save(member.id,data).then(data=>{
					if(remTime>0){
						setTimeout(function(){
							updateProfile(member,0);
						},remTime);
					} else {
						updateProfile(member,0);	
					}
				});
			});
		});
	});
	client.guilds.cache.array()[0].roles.fetch("732234963310608426").then(role=>{
		role.members.array().forEach(member=>{
			info.load(member.id).then(data=>{
				if(![0,undefined].includes(data.doubleXp)) {
					if(Date.now()>data.doubleXp) {
						member.roles.remove("732234963310608426");
					} else {
						setTimeout(function(){
							member.roles.remove("732234963310608426");
						},data.doubleXp-Date.now());
					}
				} else {
					member.roles.remove("732234963310608426");
				}
			});
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
			if(react.message.channel.id=="728022865622073446"){
				react.message.channel.messages.fetch({limit: 2}).then(messages=>{
					if(messages.array()[0].embeds[0]==undefined) return;
					if(!(messages.array()[0].embeds[0].footer||{text:""}).text.includes("!eventend")){
						if(messages.array().includes(message)){
							if(react.emoji.name=="🎉") {
								member.roles.add("730056362029219911");
								member.send(new Discord.MessageEmbed().setDescription("You've joined the event!").setColor("GREEN"))
							}
							if(react.emoji.name=="🔔") {
								member.roles.add("730598527654297771");
								member.send(new Discord.MessageEmbed().setDescription("You've activated reminder for the event!").setColor("GREEN"))
							}
						}
					}
				});
			}
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
	} else if(event.t=="MESSAGE_REACTION_REMOVE"){
		const data=event.d;
		const channel = client.channels.resolve(data.channel_id);
		channel.messages.fetch(data.message_id).then(message=>{
			const emojiKey = (data.emoji.id) ? `${data.emoji.id}` : data.emoji.name;
			const react = message.reactions.cache.get(emojiKey);
			const member = message.guild.members.resolve(data.user_id);
			if(member.user.bot==true) return;
			log(member.displayName + " `ID: " + member.id + "` unreacted with " + react.emoji.name + " on a message `ID : " + react.message.id + "` in channel '" + react.message.channel.name + "' `ID: " + react.message.channel.id + "`");
			if(react.message.channel.id=="728022865622073446"){
				react.message.channel.messages.fetch({limit: 2}).then(messages=>{
					if(messages.array()[0].embeds[0]==undefined) return;
					if(!(messages.array()[0].embeds[0].footer||{text:""}).text.includes("!eventend")){
						if(messages.array().includes(message)){
							if(react.emoji.name=="🎉") {
								member.roles.remove("730056362029219911");
								member.send(new Discord.MessageEmbed().setDescription("You've left the event!").setColor("RED"))
							}
							if(react.emoji.name=="🔔") {
								member.roles.remove("730598527654297771");
								member.send(new Discord.MessageEmbed().setDescription("You've desactivated reminder for the event!").setColor("RED"))
							}
						}
					}
				});
			}
		});
	}
})

//Store
client.on('message',message=>{
	
	let args=message.content.toLowerCase().split(" ");
	let args_case=message.content.split(" ");
	if(message.channel.type=="dm") return;
	if(message.channel.id!="731648543579963423") return;
	
	const items = [{
		name: "Events",
		description: "All what you need to make your event experience better!",
		subcommand: "events",
		items: [{
			name: "Event automatic joiner",
			description: "Automatically joins events when they are announced, you can disable/enable at any time using `autoevent` command.",
			longDescription: "With this upgrade, whenever a new event is announced, this will allow you to automatically join it, you will then unlock the command `autoevent <on/off>`, which will give you the ability to enable/disable this perk at any time!",
			price: 300,
			id: 1,
			multiple: false,
			buy: function(member){
				member.roles.add("731828010923065405");
				return true;
			}
		}]
	},{
		name: "Boosts",
		description: "Make your server experience much more enjoyable with a bunch of server boosts!",
		subcommand: "boosts",
		items: [{
			name: "Double XP - 6 hours",
			description: "With this upgrade you get doubled xp for 6 hours!",
			price: 120,
			id: 6,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.doubleXp=(data.doubleXp||Date.now());
					data.doubleXp=Math.max(data.doubleXp,Date.now())+3600*+6000;
					member.roles.add("732234963310608426");
					info.save(member.id,data)
					setTimeout(function(){
						member.roles.remove("732234963310608426");
					},data.doubleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Double XP - 1 day",
			description: "With this upgrade you get doubled xp for 1 day! Level up fast today!",
			price: 400,
			id: 7,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.doubleXp=(data.doubleXp||Date.now());
					data.doubleXp=Math.max(data.doubleXp,Date.now())+3600*24000;
					member.roles.add("732234963310608426");
					info.save(member.id,data)
					setTimeout(function(){
						member.roles.remove("732234963310608426");
					},data.doubleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Double XP - 1 week",
			description: "With this upgrade you get doubled xp for full 7 days! Boost your experience!",
			price: 2200,
			id: 8,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.doubleXp=(data.doubleXp||Date.now());
					data.doubleXp=Math.max(data.doubleXp,Date.now())+3600*7*24000;
					member.roles.add("732234963310608426");
					info.save(member.id,data)
					setTimeout(function(){
						member.roles.remove("732234963310608426");
					},data.doubleXp-Date.now());
				})
				return true;
			}
		}]
	}]
	if(args[0]=="help"){
		
		const commands = [{
			name: "store",
			description: "Displays buyable items.",
			longDescription: "Displays buyable items and information about them.",
			usage: "store [category] [item]"
		},{
			name: "gold",
			description: "Shows your gold.",
			usage: "gold"
		},{
			name: "buy",
			description: "Buy an item.",
			longDescription: "Purchase an item using its ID, check `store` for item IDs.",
			usage: "buy <item id>"
		}];
		
		if(["",undefined].includes(args[1])){
			var embed= new Discord.MessageEmbed().setColor("GOLD").setTitle("Store command list").setDescription("Use `help <command>` for specific command help");
			commands.forEach(cmd=>{
				embed.addField(cmd.name,cmd.description,true);
			})
			message.channel.send(embed);
		} else if(commands.find(t=>(t.name==args[1]))!=undefined){
			
			const cmd=commands.find(t=>(t.name==args[1]));
			var embed= new Discord.MessageEmbed().setColor("fafafa").setTitle("Command help: " + args[1]);
			embed.addField("Description",cmd.longDescription||cmd.description);
			embed.addField("Sub-commands",cmd.subcommands||"None.",true);
			embed.addField("Usage","*"+cmd.usage+"*",true)
			message.channel.send(embed);
			
		} else {
			message.channel.send(new Discord.MessageEmbed().setDescription("This command doesn't exist :(").setColor("RED"));
		}
		
	} else if(["store","s","shop","list"].includes(args[0])){
		if(!["",undefined].includes(args[1])&&items.find(cat=>cat.subcommand==args[1])!=undefined){
			let cat=items.find(cat=>cat.subcommand==args[1]);
			if(!["",undefined].includes(args[2])&&cat.items.find(item=>item.id==parseInt(args[2]))!=undefined){
				let item=cat.items.find(item=>item.id==parseInt(args[2]));
				let embed=new Discord.MessageEmbed().setColor("YELLOW").setTitle("Item: "+item.name);
				embed.setDescription(item.longDescription||item.description);
				embed.addField("Price",item.price,true);
				embed.addField("ID",item.id,true);
				embed.setFooter("Use (buy "+item.id+") to buy this item.")
				message.channel.send(embed);
			} else {
				let embed=new Discord.MessageEmbed().setColor("YELLOW").setTitle("Category: "+cat.name).setDescription(cat.description).setFooter("Use (store "+cat.subcommand+" <item ID>) to see a specific item.");
				cat.items.forEach(item=>{
					embed.addField(item.name,"**Price:** "+item.price+"\n**ID:** "+item.id,true);
				})
				message.channel.send(embed);
			}
			
		} else {
			let embed=new Discord.MessageEmbed().setColor("GOLD").setTitle("Store categories:").setFooter("Use (store <category>) to see category items.")
			items.forEach(cat=>{
				embed.addField(cat.name,cat.description+"\n**Subcommand:** "+cat.subcommand,true);
			})
			message.channel.send(embed);
		}
		
	} else if(args[0]=="gold"){
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		info.load(userToFind.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+"> has " + data.gold + " gold!").setColor("GOLD"));
		})	
	} else if(["buy","purchase","get"].includes(args[0])){
		let item=undefined;
		items.forEach(cat=>{
			item=cat.items.find(i=>i.id==parseInt(args[1]));
		})
		if(["",undefined].includes(args[1])){
			message.channel.send(new Discord.MessageEmbed().setDescription("Please specifiy an item ID, check `store` for items.").setColor("RED"));
		} else if(item==undefined){
			message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't find any item with that ID :(").setColor("RED"));	
		} else {
			info.load(message.member.id).then(data=>{
				if(data.items==undefined) data.items=[];
				if(data.gold<item.price){
					message.channel.send(new Discord.MessageEmbed().setDescription("You need **"+(item.price-data.gold)+"** more gold to buy this item.").setColor("RED"));
				} else if(data.items.includes(item.id)&&item.multiple!=true){ 
					message.channel.send(new Discord.MessageEmbed().setDescription("You already have this item!").setColor("RED"));
				} else {
					data.gold-=item.price;
					if(item.multiple!=true) data.items.push(item.id)
					info.save(message.member.id,data).then(()=>{
						item.buy(message.member);
						
					});
					message.channel.send(new Discord.MessageEmbed().setDescription("You have successfully bought **"+item.name+"**!").setColor("GREEN"));
				}
			})	
		}
		
	}
	
	
})

//User event
client.on('message',message=>{
	
	if(message.channel.type=="dm") return;
	
	if(message.member.id=="302050872383242240"){
		if(message.embeds[0]==undefined) return;
		if(!message.embeds[0].description.includes(message.guild.waitingForDisboard.id)) return;
		if(!message.embeds[0].description.includes("Bump done")) return;
		let g=50+Math.random()*50|0;
		info.load(message.guild.waitingForDisboard.id).then(data=>{
			data.gold+=g;
			info.save(message.guild.waitingForDisboard.id,data).then(()=>{
				message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Thank you <@!"+message.guild.waitingForDisboard.id+"> for bumping the server!** Here is **"+g+"** gold!"))
			})
		})
	}
	
	//Normal messages
	if(message.author.bot) return;
	
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
		membershipUpdate(message.member);
		
	
	if(message.member.messageCombo==undefined) message.member.messageCombo=0;
	message.member.messageCombo++;
	if(message.member.messageCombo>=10){
		message.member.messageCombo=0;
		updateProfile(message.member,10);
	}
	
	var args=message.content.toLowerCase().split(" ");
	var args_case=message.content.split(" ");
	//Global commands
	if(args[0]=="nextevent"){
		message.guild.channels.cache.get("728022865622073446").messages.fetch({
		limit: 1
		}).then(messages=>{
			const embed = messages.array()[0].embeds[0];
			const st=parseInt((embed.footer||{text:""}).text.replace("!eventannounce ",""));
			if(embed==undefined){
				message.channel.send(new Discord.MessageEmbed().setDescription("🚫 No event planned/in progress!").setColor("RED"));
			} else if(embed.footer==undefined){
				message.channel.send(new Discord.MessageEmbed().setDescription("🚫 No event planned/in progress!").setColor("RED"));
			} else if(embed.footer.text=="!eventstart"){
				message.channel.send(new Discord.MessageEmbed().setDescription("🥳 An event is already in progress!").setColor("AQUA"));
			} else if(embed.footer.text=="!eventend"){
				message.channel.send(new Discord.MessageEmbed().setDescription("🚫 No event planned/in progress!").setColor("RED"));
			} else if(st!=NaN){
				if(st-Date.now()>0){
					let f=msToString(st-Date.now());
					message.channel.send(new Discord.MessageEmbed().setDescription("🕙 Event starts in " + f + "!").setColor("AQUA"));	
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("⏰ Event will start shortly...").setColor("ORANGE"));	
				}
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("🚫 No event planned/in progress!").setColor("RED"));	
			}
		})
	} else if((args[0] + args[1])=="!dbump"){
		
		message.guild.waitingForDisboard=message.member;
		
	}	
	
	//Commands
	if(message.channel.id!="728025726556569631") return;
	if(["dailyreward","daily","dr","reward"].includes(args[0])){
	
		info.load(message.member.id).then(data=>{
			if(data.dailyReward==undefined||(Date.now()-data.dailyReward>3600*24*1000)){
				if(data.dailyReward==undefined) data.dailyReward=0; 
				let gold=30;
				let embed=new Discord.MessageEmbed().setColor("GREEN").setDescription("💸 You have claimed your **40** gold daily reward!");
				if(Date.now()-data.dailyReward-3600*24*1000<10*1000){
					gold+=150;
					embed.setDescription(embed.description+"\n⌛ You have claimed your reward very early! You received an additional **120** gold!");
				}
				data.gold+=gold;
				data.dailyReward=Date.now(); 
				info.save(message.member.id,data).then(()=>{
					message.channel.send(embed);
				})
			} else {
				let embed=new Discord.MessageEmbed().setColor("RED").setDescription("🕙 Come back in "+msToString(data.dailyReward+3600*24*1000-Date.now())+" to claim your daily reward!");	
				message.channel.send(embed)
			}
		})
		
	} else if(["ping","latency"].includes(args[0])){
		var d=Date.now();
		message.channel.send(new Discord.MessageEmbed().setDescription("**Pong!**").setColor("RED")).then(msg => {
            		msg.edit(new Discord.MessageEmbed().setDescription("**Pong!** My latency is "+(Date.now()-d)+" ms!").setColor("GREEN"));
		});
	} else if(["level","xp","exp","experience","progress","l"].includes(args[0])){
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		if(userToFind.user.bot) userToFind=message.member;
		updateProfile(userToFind,0).then(()=>{
			info.load(userToFind.id).then(data=>{
				var last=levelXp(data.level-1);
				if(data.level==1) last=0;
				const all=data.messagesEverSent-last;
				const next=levelXp(data.level)-last;
				const prog=all/next;
				message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+">'s level is " + data.level + "!").addField("Progress","`"+"██".repeat(Math.max(prog*10,0)|0)+"  ".repeat(Math.max(1-prog,0)*10|0)+"`  **"+(prog*100|0)+"**%").setColor("GREEN"));
			});
		});
	} else if(args[0]=="uptime"){
		message.channel.send(new Discord.MessageEmbed().setDescription("I've been up for "+msToString(client.uptime)+"!").setColor("YELLOW"));
	} else if(args[0]=="gold"){
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		if(userToFind.user.bot) userToFind=message.member;
		info.load(userToFind.id).then(data=>{
			message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+"> has " + data.gold + " gold!").setColor("GOLD"));
		})	
	} else if(args[0]=="profile"){
		
		var userToFind=message.member;
		if(message.mentions.members.array().length!=0){
			userToFind=message.mentions.members.array()[0];
		}
		if(userToFind.user.bot) userToFind=message.member;
		updateProfile(userToFind,0).then(()=>{
			info.load(userToFind.id).then(data=>{
				var last=levelXp(data.level-1);
				if(data.level==1) last=0;
				const all=data.messagesEverSent-last;
				const next=levelXp(data.level)-last;
				const prog=all/next;
				message.channel.send(new Discord.MessageEmbed().setTitle(userToFind.displayName+"'s profile").addField("Level",data.level,true).addField("Progress","`"+"██".repeat(Math.max(prog*10,0)|0,)+"  ".repeat(Math.max(1-prog,0)*10|0)+"`  **"+(prog*100|0)+"**%",true).addField("Gold",data.gold,true).addField("Joined at",new Date(userToFind.joinedTimestamp)).addField("Average Daily Activity Points",numberBeautifier(data.messageAveragePerDay,","),true).addField("All-Time Activity Points",numberBeautifier(data.messagesEverSent,","),true).setColor("RANDOM").setThumbnail(userToFind.user.displayAvatarURL()));
			})
		});
		
	} else if(args[0]=="autoevent"){
		info.load(message.member.id).then(data=>{
		if(data.items==undefined) return;
		if(!data.items.includes(1)) return;
		  if(["on","off"].includes(args[1])){
			  if(args[1]=="on"){
				  message.member.roles.add("731828010923065405");
				  message.channel.send(new Discord.MessageEmbed().setDescription("Event automatic joiner enabled!").setColor("GREEN"))
			  } else {
				  message.member.roles.remove("731828010923065405");
				  message.channel.send(new Discord.MessageEmbed().setDescription("Event automatic joiner disabled!").setColor("ORANGE"))
			  }
		  } else {
			message.channel.send(new Discord.MessageEmbed().setDescription("Please specify **on** or **off**").setColor("RED"))	  
		  }
		});
		  
	}else if(args[0]=="color"){
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
			if(member.user.bot) member=message.member;
			var role=undefined;
			roles.forEach(t=>{
				if(member.roles.cache.get(t)!=undefined) role=member.roles.cache.get(t);
			})
			if(role==undefined) role=member.guild.roles.cache.get("729438972161556610");
			member.roles.add(role);
			message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+member.id+">'s color is **"+role.name+"**").setColor(role.color))
		}
	} else if(args[0]=="restart"){
		  
		if(message.author.id!="123413327094218753") return;
		message.channel.send("All bots restarting...");
		restart();
		  
	}else if(args[0]=="help"){
	
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
		},{
			name: "dailyreward",
			description: "Claim your daily reward.",
			longDescription: "Claim a daily **40** gold reward, if you get lucky and claim it soon enough, you may get more gold!",
			usage: "dailyreward"
		}];
		
		if(["",undefined].includes(args[1])){
			var embed= new Discord.MessageEmbed().setColor("AQUA").setTitle("Command list").setDescription("Use `help <command>` for specific command help");
			commands.forEach(cmd=>{
				embed.addField(cmd.name,cmd.description,true);
			})
			message.channel.send(embed);
		} else if(commands.find(t=>(t.name==args[1]))!=undefined){
			
			const cmd=commands.find(t=>(t.name==args[1]));
			var embed= new Discord.MessageEmbed().setColor("fafafa").setTitle("Command help: " + args[1]);
			embed.addField("Description",cmd.longDescription||cmd.description);
			embed.addField("Sub-commands",cmd.subcommands||"None.",true);
			embed.addField("Usage","*"+cmd.usage+"*",true)
			message.channel.send(embed);
			
		} else {
			message.channel.send(new Discord.MessageEmbed().setDescription("This command doesn't exist :(").setColor("RED"));
		}
		
	} else if(message.member.roles.cache.get("728034751780356096")||message.member.roles.cache.get("728034436997709834")){
	
		if(args[0]=="unmute"){
			try{
				const muted=message.mentions.members.array()[0];
				unmute(muted).then(()=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+muted.id+"> was unmuted by <@!"+message.author.id+">").setColor("RED"));
					adminlog(muted.displayName+" `ID: "+muted.id+"` was unmuted by "+message.member.displayName+""+" `ID: "+message.author.id+"`");
				});
				
			}catch(err){
				message.channel.send(new Discord.MessageEmbed().setDescription("**Syntax:** unmute <user>").setColor("RED"))
			}
		} else if(args[0]=="mute"){
			try{
				const muted=message.mentions.members.array()[0];
				const time=timeformatToSeconds(args[2]);
				
				var reason=args_case.join(" ").replace(args_case[0]+" ","").replace(args_case[1]+" ","").replace(args_case[2]+"","");
				if([""," ",undefined].includes(reason)) reason="Unspecified."
				if(![muted,time].includes(undefined)){
					mute(muted,time).then(()=>{
						message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+muted.id+"> was muted by <@!"+message.author.id+"> for "+msToString(time*1000)+".\n**Reason:** "+reason).setColor("RED"));
						adminlog(muted.displayName+" `ID: "+muted.id+"` was muted by "+message.member.displayName+""+" `ID: "+message.author.id+"` for "+msToString(time*1000)+".\n**Reason:** "+reason)
					});	
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("**Syntax:** mute <user> <time> [reason]").setColor("RED"))
				}
			}catch(err){
				message.channel.send(new Discord.MessageEmbed().setDescription("**Syntax:** mute <user> <time> [reason]").setColor("RED"))
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
					
					try{const time=timeformatToSeconds(args[3]);
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
					const embed= new Discord.MessageEmbed().setTitle(event.name).setDescription(event.desc).setColor("AQUA").addField("Host","<@!"+event.host.id+">").addField("Date",new Date(event.time)).addField("Starts in",msToString(event.time-Date.now())).setFooter("!eventannounce " + event.time).addField("Join","React with 🎉 to join the event.\nReact with 🔔 to activate reminders.");
					message.guild.channels.cache.get("728022865622073446").send("<@&728223648942653451> <@&728224459487576134> **New Event!**",embed).then(m=>{
					m.react("🎉")
					m.react("🔔")
					eventReminder();
					});;
					message.guild.roles.cache.get("731828010923065405").members.array().forEach(t=>{
						t.roles.add("730056362029219911");
						t.send(new Discord.MessageEmbed().setDescription("🥳 You have automatically joined the event!").setColor("GREEN"))
					})
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` announced event with identifier: " + args[2]);
					
				}
				
			} else if(args[1]=="start"){
					const embed= new Discord.MessageEmbed().setTitle("Event Started!").setColor("GREEN").setFooter("!eventstart");
					message.guild.channels.cache.get("728022865622073446").send(embed)
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` started the event.");
					message.guild.roles.cache.get("730598527654297771").members.array().forEach(m=>{
						m.send(new Discord.MessageEmbed().setDescription("🥳 Event has started!").setColor("GREEN"))
					});
			} else if(args[1]=="end"){
			
					const embed= new Discord.MessageEmbed().setTitle("Event ended! :(").setColor("RED").setFooter("!eventend");
					message.guild.channels.cache.get("728022865622073446").send(embed);
					adminlog(message.member.displayName+" `ID: "+message.author.id+"` ended the event.");
					message.guild.roles.cache.get("730598527654297771").members.array().forEach(m=>{
						m.roles.remove("730056362029219911");
					});
					message.guild.roles.cache.get("730598527654297771").members.array().forEach(m=>{
						m.send(new Discord.MessageEmbed().setDescription("😧 Event has ended :(!").setColor("RED"))
						m.roles.remove("730598527654297771");
					});
					
				
			}
			
		}
	}
	
});

//VC
client.on("voiceStateUpdate",(o,n)=>{

	const vcs=["728008557911605341", "728027365820727407","728027460515659838","728027677344268337","728027756906020865","728027832747556892","728027908127457370"];
	const mvcs=["728030297911853176","728029167286878240"];
	if(n.member.user.bot) return;
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
		if(n.member.timer!=undefined) clearInterval(n.member.timer);
		n.member.timer = setInterval(function(){
		if((n.member.guild.members.cache.get(n.member.id).voice.channel==null)||(n.member.guild.members.cache.get(n.member.id).voice.channel.id=="728037836774703235")) clearInterval(n.member.timer); 
		info.load(n.member.id).then(data=>{
			updateProfile(n.member,Math.random()*10|0);
		});
		},60000)
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

	if((member.lastLeft!=undefined)&&(member.lastLeft<Date.now()+60*10000)) member.kick().then(member=>{
		member.user.send("You need to wait 10 minutes before joining again.")
	}) 
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

client.on('guildMemberRemove',member=>{
	
	member.lastLeft=Date.now();

})


// -------------------------------------------
//
//                   Music Bot
//
// -------------------------------------------

const treble = new Discord.Client();
const pitch = new Discord.Client();
const { Player } = require("discord-music-player");
const options = {
	leaveOnEnd: false,
	leaveOnEmpty: false,
	leaveOnStop: false
}
treble.player = new Player(treble, "AIzaSyAT-lCRVKfYrprwdKqk69TszCfoh1jqqjM", options);
pitch.player = new Player(pitch, "AIzaSyAT-lCRVKfYrprwdKqk69TszCfoh1jqqjM", options);

treble.on("ready",()=>{
	treble.channels.resolve("729155101746528286").send("Ready!");
	treble.guilds.cache.array()[0].channels.cache.get("728030297911853176").join();
	treble.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: "",
							type: "PLAYING",
							url: null
						}});
});
pitch.on("ready",()=>{
	pitch.channels.resolve("729155101746528286").send("Ready!");
	pitch.guilds.cache.array()[0].channels.cache.get("728029167286878240").join();
	pitch.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: "",
							type: "PLAYING",
							url: null
						}});
});

treble.on("message",(message)=>{musicMessage(message)});
pitch.on("message",(message)=>{musicMessage(message)});

async function musicMessage(message){
	//Music Commands
	if(message.channel.type=="dm") return;
	if(message.channel.id!="728029565607346227") return;
	if(message.author.bot) return;
	var args=message.content.toLowerCase().split(" ");
	var args_case=message.content.split(" ");
	if(message.member.voice.channel!=undefined){
		var chosenclient = pitch;
		if(message.member.voice.channel.id=="728030297911853176") chosenclient = treble;
		if(chosenclient.user.id!=message.client.user.id) return;
		let tqueue = await chosenclient.player.getQueue(message.guild.id);
		let isEmpty = !(await chosenclient.player.isPlaying(message.guild.id));
		var np=undefined;
		if(!isEmpty) np = await chosenclient.player.nowPlaying(message.guild.id);
		if(["p","search","s","play","add"].includes(args[0])){
			message.channel.startTyping();
			let isPlaying = chosenclient.player.isPlaying(message.guild.id);
			if(isPlaying){
				chosenclient.player.addToQueue(message.guild.id,message.content.replace(args_case[0],""),"<@!"+message.member.id+">").then(songPlayer=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("**Added to queue:** "+songPlayer.song.name+" (Requested by "+songPlayer.song.requestedBy+")").setColor("AQUA"))
					message.channel.stopTyping();
				}).catch(err=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't find the song, maybe try with more details?").setColor("RED"))
					message.channel.stopTyping();
				});
			} else {
				chosenclient.player.play(message.member.voice.channel,message.content.replace(args_case[0],""),"<@!"+message.member.id+">").then(song=>{
				message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Now playing: **" +song.song.name + " (Requested by " + song.song.requestedBy+")"))
				message.channel.stopTyping();
				chosenclient.player.songStarted=Date.now()/1000;
				chosenclient.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: song.song.name,
							type: "PLAYING",
							url: song.song.url
						}});
				chosenclient.player.getQueue(message.guild.id).on('songChanged', (oldSong, song) => {
			    		message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Now playing: **" +song.name + " (Requested by " + song.requestedBy+")"))
					chosenclient.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: song.name,
							type: "PLAYING",
							url: song.url
						}});
					chosenclient.player.songStarted=Date.now()/1000;
					if(chosenclient.player.repeatqueue==true){ 
						chosenclient.player.getQueue(message.guild.id).songs.push(oldSong);
					}
				}).on("end",()=>{
					chosenclient.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: "",
							type: "PLAYING",
							url: null
						}});
				});
				}).catch(err=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't find the song, maybe try with more details?").setColor("RED"))
					message.channel.stopTyping();
				});;
			}
		} else if(["queue","q"].includes(args[0])){
			var page=(parseInt(args[1])||1);
			let queue = await chosenclient.player.getQueue(message.guild.id);
			if((queue!=undefined)&&(queue.songs.length!=0)){
				let sec = ("0"+(((Date.now()/1000)-chosenclient.player.songStarted)%60|0));
				let min = (((Date.now()/1000)-chosenclient.player.songStarted)/60|0);
				let time = min + ":" + (sec+"").substring(sec.length-2);
				if((page<=0)||((page-1)>((queue.songs.length-1)/10|0))) page=1;
				message.channel.send(new Discord.MessageEmbed().setColor("GOLD").addField("Now playing",np.name + " (Requested by " + np.requestedBy+") **[**"+time+"**/**"+np.duration+"**]**").addField("Queue" + (()=>{if((queue.songs.length/10|0)>0) return " (Page " + page + "/"+((queue.songs.length/10|0)+1)+")"; else return ""})(),queue.songs.map((song,i)=>{
						if(((i+1)>10*(page-1))&&((i+1)<=10*page)) return (i+1) + " ● " + song.name + " (Requested by " + song.requestedBy+")";
				}).join("\n")))
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("Queue is empty :(").setColor("RED"))	
			}
		} else if((args[0]=="stop")&&(!isEmpty)){
			let queue = await chosenclient.player.getQueue(message.guild.id);
			let r = queue.songs[0].requestedBy;
			if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){
				chosenclient.player.stop(message.guild.id);
				message.channel.send(new Discord.MessageEmbed().setDescription("⏹️ Music stopped!").setColor("RED"))
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("You can't stop the music.").setColor("RED"))	
			}
			
		} else if((args[0]=="skip")&&(!isEmpty)){
			let queue = await chosenclient.player.getQueue(message.guild.id);
			let r = queue.songs[0].requestedBy;
			if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){
				chosenclient.player.skip(message.guild.id);
				message.channel.send(new Discord.MessageEmbed().setDescription("🚫 Song skipped!").setColor("YELLOW"))
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("You can't skip this song.").setColor("RED"))	
			}
			
		} else if((["np","nowplaying"].includes(args[0]))&&(!isEmpty)){
			let song = await chosenclient.player.nowPlaying(message.guild.id);
			let sec = ("0"+(((Date.now()/1000)-chosenclient.player.songStarted)%60|0));
			let min = (((Date.now()/1000)-chosenclient.player.songStarted)/60|0);
			let time = min + ":" + (sec+"").substring(sec.length-2);
			message.channel.send(new Discord.MessageEmbed().setColor("GOLD").setDescription("**Now playing: **" +song.name + " (Requested by " + song.requestedBy+") **[**"+time+"**/**"+song.duration+"**]**"));
		} else if((["clearqueue","clear"].includes(args[0]))&&(!isEmpty)){
			let queue = await chosenclient.player.getQueue(message.guild.id);
			let r = queue.songs[0].requestedBy;
			var t=true;
			queue.songs.forEach(s=>{
				if(!s.requestedBy.includes(message.member.id)) t=false;
			})
			if(message.member.hasPermission("MANAGE_CHANNELS")||t){
				chosenclient.player.clearQueue(message.guild.id).then(()=>{
					chosenclient.player.skip(message.guild.id);
					message.channel.send(new Discord.MessageEmbed().setDescription("Queue cleared!").setColor("YELLOW"))
				});
				
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("You can't clear the queue.").setColor("RED"))	
			}
		} else if((args[0]=="pause")&&(!isEmpty)){
			let queue = await chosenclient.player.getQueue(message.guild.id);
			let r = queue.songs[0].requestedBy;
			if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){
				chosenclient.player.pause(message.guild.id);
				message.channel.send(new Discord.MessageEmbed().setDescription("⏸️ Paused!").setColor("ORANGE"))
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("You can't pause this song.").setColor("RED"))	
			}
		} else if((args[0]=="resume")&&(!isEmpty)){
			let queue = await chosenclient.player.getQueue(message.guild.id);
			let r = queue.songs[0].requestedBy;
			if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){
				chosenclient.player.resume(message.guild.id);
				message.channel.send(new Discord.MessageEmbed().setDescription("▶️ Resumed!").setColor("ORANGE"))
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("You can't resume this song.").setColor("RED"))	
			}
		} else if(args[0]=="repeat"){
			if(isEmpty){
				message.channel.send(new Discord.MessageEmbed().setDescription("Queue is empty").setColor("RED"))
			} else if(args[1]=="song"){
				let r = tqueue.songs[0].requestedBy;
				if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){	
					chosenclient.player.setRepeatMode(message.guild.id, true);
					chosenclient.player.repeatqueue=false;
					message.channel.send(new Discord.MessageEmbed().setDescription("Current song will be repeated indefinitely.").setColor("GREEN"))	
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("You can't manage repetition.").setColor("RED"))	
				}
			} else if(args[1]=="queue"){
				let r = tqueue.songs[0].requestedBy;
				if(tqueue.songs.length<2){
				   	message.channel.send(new Discord.MessageEmbed().setDescription("There is only one song in the queue, use `repeat song` to repeat it indefinitely.").setColor("RED"))
				} else if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){	
					chosenclient.player.setRepeatMode(message.guild.id, false);
					chosenclient.player.repeatqueue=true;
					message.channel.send(new Discord.MessageEmbed().setDescription("The whole queue will be repeated.").setColor("ORANGE"))
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("You can't manage repetition.").setColor("RED"))	
				}
			} else if(args[1]=="off"){
				let r = tqueue.songs[0].requestedBy;
				if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){	
					chosenclient.player.setRepeatMode(message.guild.id, false);
					chosenclient.player.repeatqueue=false;
					message.channel.send(new Discord.MessageEmbed().setDescription("The queue will not be repeated.").setColor("ORANGE"))
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("You can't manage repetition.").setColor("RED"))	
				}
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specify song/queue/off.").setColor("RED"))
			}
		} else if((args[0]=="remove")&&(!isEmpty)){
			let n=parseInt(args[1].replace("last",tqueue.songs.length+"").replace("first","1").replace("current","1"));
			if((n!=NaN)&&(n<=tqueue.songs.length)&&(n>=1)){
				let r = tqueue.songs[n-1].requestedBy;
				if((message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id))){
					chosenclient.player.remove(message.guild.id,n-1).then(()=>{
						if(n==1) chosenclient.player.skip(message.guild.id);
						message.channel.send(new Discord.MessageEmbed().setDescription("Song removed from queue.").setColor("ORANGE"))	
					}).catch(err=>{
						message.channel.send(new Discord.MessageEmbed().setDescription("Unable to remove the song.").setColor("RED"))	
					})
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("You can't remove that song.").setColor("RED"))	
				}
					
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specity a correct number between 1 and " + tqueue.songs.length + "!").setColor("RED"))	
			}
		}else if(args[0]=="help"){
			const commands = [{
				name: "play",
				description: "Searches and add a song to the queue.",
				longDescription: "Searches for a song on youtube, and adds it to the bot's queue.",
				usage: "play <song name/url>"
			},{
				name: "queue",
				description: "Displays the queue.",
				usage: "queue [page]"
			},{
				name: "nowplaying",
				description: "Shows the current song.",
				usage: "nowplaying"
			},{
				name: "remove",
				description: "Remove a song from the queue.",
				longDescription: "Removes a song from the queue depending on its number",
				usage: "remove <number/first/last/current>"
			},{
				name: "pause",
				description: "Pauses the current song",
				usage: "pause"
			},{
				name: "resume",
				description: "Resumes the current song",
				usage: "resume"
			},{
				name: "repeat",
				description: "Manages repetition.",
				longDescription: "Repeats current song/queue, or disable repetition.",
				usage: "repeat <song/queue/off>"
			},{
				name: "stop",
				description: "Stops music.",
				usage: "stop"
			},{
				name: "skip",
				description: "Skips current song.",
				usage: "skip"
			},{
				name: "clear",
				description: "Clears entire queue.",
				usage: "clear"
			}];
			if(["",undefined].includes(args[1])){
				var embed= new Discord.MessageEmbed().setColor("PURPLE").setTitle("Music command list").setDescription("Use `help <command>` for specific command help");
				commands.forEach(cmd=>{
					embed.addField(cmd.name,cmd.description,true);
				})
				message.channel.send(embed);
			} else if(commands.find(t=>(t.name==args[1]))!=undefined){
				const cmd=commands.find(t=>(t.name==args[1]));
				var embed= new Discord.MessageEmbed().setColor("fafafa").setTitle("Command help: " + args[1]);
				embed.addField("Description",cmd.longDescription||cmd.description);
				embed.addField("Sub-commands",cmd.subcommands||"None.",true);
				embed.addField("Usage","*"+cmd.usage+"*",true)
				message.channel.send(embed);

			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("This command doesn't exist :(").setColor("RED"));
			}
		}
	}
}

// THIS  MUST  BE  THIS  WAY
treble.login(process.env.MUSIC2);
pitch.login(process.env.MUSIC1);
client.login(process.env.BOT_TOKEN);


