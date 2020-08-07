const Discord = require('discord.js');
const Canvas = require('canvas-constructor');
const client = new Discord.Client();
const request = require('request');
const dbLink = "https://jsonbox.io/box_1b9370d46ab479194e92"

const colors=["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","orange","aliceblue","antiquewhite","aquamarine","azure","beige","bisque","blanchedalmond","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","gainsboro","ghostwhite","gold","goldenrod","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","limegreen","linen","magenta","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","oldlace","olivedrab","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellowgreen","rebeccapurple"];

function getURL(url,h){
	return new Promise((resolve,reject)=>{
		request.get({
			url: url,
			headers: (h||{})
		},(err,r,body)=>{
			if (err) reject(err);
			if (!err) resolve(body);
		})
	})
}
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function wait(ms){
	return new Promise((resolve,reject)=>{
		setTimeout(resolve,ms);
	});
}

function validHEX(h){
var a = parseInt(h,16);
return (a.toString(16) ===h.toLowerCase());	
}
function sortMembers(){
	dataStorage.sort((a,b)=>{return -a.messagesEverSent+b.messagesEverSent;});
}

async function loadProfile(member){
	sortMembers();
	let stat="#09853b";
	if(member.user.presence.status=="dnd") stat="#e64040";
	if(member.user.presence.status=="idle") stat="#c2a711";
	if(member.user.presence.status=="offline") stat="#404040";
	let data = await info.load(member.id);
	let rank = 1+dataStorage.findIndex(t=>t.id==member.id);
	let xpc = Math.max(0,(data.messagesEverSent-levelXp(data.level-1))/(levelXp(data.level)-levelXp(data.level-1)));
	let backgroundImg=undefined;
	let backgroundCol=undefined;
	let bio = data.bio;
	if(data.bio!=undefined&&(data.bio.split("\n").length-1)>2) data.bio = data.bio.split("\n").join(" ");
	if(data.back!=undefined){
		if(validURL(data.back)){
			try{
				backgroundImg= await Canvas.resolveImage(data.back);
			}catch(err){console.log(err)}	
		} else {
			backgroundCol=data.back;
		}
	}
	let avatar=await Canvas.resolveImage(member.user.displayAvatarURL({format: 'png'}));
	let avatarCanvas =await Canvas.resolveImage(new Canvas.Canvas(80,80).printCircularImage(avatar,40,40,40).clearCircle(67.5,67.5,15).toDataURL());
	let canvas = new Canvas.Canvas(500, 270).setColor((backgroundCol||"#36393e")).printRoundedRectangle(0, 0, 500, 270,15);
	if(backgroundImg!=undefined){canvas = canvas.printRoundedImage(backgroundImg,0,0,500,270,15);}
	canvas = canvas.setGlobalAlpha(0.5).setColor("#000000").printRoundedRectangle(10,10,500-20,270-20,10).setGlobalAlpha(1).setColor('#FFFFFF')
.setTextFont('20px Impact').setShadowColor('#000000').setShadowBlur(30).printImage(avatarCanvas,24,24,80,80).setGlobalAlpha(0.6).setColor("#000000")
	.setShadowBlur(0).printRoundedRectangle(120,79,500-120-24,25,12.5).setGlobalAlpha(1)
	.setColor(stat).printCircle(91.5,91.5,11).setShadowBlur(10)
.setColor(member.displayHexColor).printRoundedRectangle(124,83,(500-120-24-8)*xpc,17,12.5).printText(member.user.tag, 120, 45).setTextAlign('right').setColor("#cfc402").setShadowBlur(0).printText("#"+rank,500-28,45).setColor(member.displayHexColor).setTextFont('10px Impact').setShadowBlur(4).printText((xpc*100|0)+"%",500-28,75).setTextAlign('left').setShadowBlur(4).setColor("#ffffff").setTextFont('12px Impact')
    	.printText((data.pname||""), 120, 62)
	.setShadowBlur(6).setTextFont('12px Impact')
	.setColor("white").printText("Bio:",24,126).setColor(member.displayHexColor).printWrappedText((data.bio||"No bio set."), 70, 126,500-24-70)
	.setColor("white").printText("Level :",24,180).setColor(member.displayHexColor).printText(data.level+"", 70, 180)
	.setColor("white").printText("Gold :",240,180).setColor(member.displayHexColor).printText(numberBeautifier(data.gold,","), 286, 180)
	.setColor("white").printText("Average Daily Activity Points :",24,200).setColor(member.displayHexColor).printText(numberBeautifier(data.messageAveragePerDay,","), 240, 200)
	.setColor("white").printText("All-Time Activity Points :",24,220).setColor(member.displayHexColor).printText(numberBeautifier(data.messagesEverSent,","), 240, 220)
	.setColor("white").printText("Member since: ",24,240).setColor(member.displayHexColor).printText(member.joinedAt.toLocaleDateString()+"", 240, 240)
    	.toBuffer();
	
	return canvas;

}

//Logs
function log(d){
	client.channels.resolve("729155101746528286").send(d);
}
function adminlog(event,member,content,reason){
	client.channels.resolve("729155101746528286").send(new Discord.MessageEmbed().setDescription("**Event:** "+event).addField("Member","<@!"+member.id+">",true).addField("Action/Content",content,true).setTimestamp().setColor("ORANGE").addField("Reason",(reason||"Unspecified"),true));
}
function dropChest(){
	let c=client.channels.cache.get("728025726556569631");
	let em=new Discord.MessageEmbed().setColor("ORANGE").setDescription("📦 A new chest has been dropped! Quickly write `collect` to collect it!");
	c.chest={
		value: 20+Math.random()*100|0,
		collected: false
	}
	if(Math.random()<0.1){
		c.chest.value+=200;
		em.setDescription("💰 **A rare chest** has been dropped! Quickly write `collect` to collect it!!").setColor("GREEN");
	}
	if(Math.random()<0.04){
		c.chest.value+=600;
		em.setDescription("💎 **A very rare chest has been dropped!** Quickly write `collect` to collect it!!!").setColor("AQUA");
	} 
	c.send(em);
	setTimeout(function(){
		if(c.chest.collected==false){
			c.chest.collected=true;
			c.send(new Discord.MessageEmbed().setColor("RED").setDescription("**Oh no!** The chest has disappeared! Better luck next time!"))	
		}
	},5*60*1000)
	setTimeout(dropChest,3600*1000+Math.random()*3*3600*1000|0)
	
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
	rawlog(new Discord.MessageEmbed().setColor("ORANGE").setDescription("Restarting..."))
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
			c.gamblesToday=0;
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
		c.messagesSentToday+=points;
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

var info = {
	exists: false,
	init: async function(data){
		return new Promise((resolve,reject)=>{
			console.log("Initiating data");
			dataStorage.push(data);
			request.post(
				{
					url: dbLink,
					headers: {
					    'Content-Type': 'application/json',
					},
					json: data
				},(err,re,body)=>{
					dataStorage[dataStorage.findIndex(d=>d.id==data.id)] = body;
					if(!err) resolve(body);
					if(err) reject(err);
				});
		});
	},
	save: async function(id,data){
		
		let userdata = dataStorage.find(d=>d.id==id);
		if(userdata!=undefined){
			return new Promise((resolve,reject)=>{
				dataStorage[dataStorage.findIndex(d=>d.id==id)]=data;
				request.put(
					{
					url: dbLink+'/'+userdata._id+'/',
					headers: {
					    'Content-Type': 'application/json',
					},
					json: data
					},(err,re,body)=>{
					if(err) reject(err);
					if(!err) resolve(body)
					});
			});
		} else{
			return this.init(data);	
		}
		
	},
	load: async function(id){
		
		let userdata = dataStorage.find(d=>d.id==id);
		if(userdata!=undefined){
			return userdata;	
		} else {
			let data={
				id: id,
				level:1,
				gold:100,
				messagesEverSent: 0,
				messageAveragePerDay: 0,
				messagesSentToday: 0,
				firstMessage: Date.now()
			}
			this.init(data);
			return data;
		}

	}
}

//Debug
client.on('message',message=>{

	if(message.channel.type=="dm") return;
	if(message.author.bot) return;
	if(message.author.id!="123413327094218753") return;
	if(message.channel.id!="728356553672884276"&&!message.content.startsWith("ex ")) return;
	if(message.content.startsWith("ex ")) message.content=message.content.replace("ex ","");
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
	client.user.setPresence({
		status: "online",
		afk: false,
		activity: {
			name: client.guilds.cache.array()[0].members.cache.array().length+" members do nothing.",
			type: "WATCHING",
			url: null
		}});
	rawlog(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Ready!**"))
	console.log("Ready!")
	setTimeout(dropChest,50000);
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
client.on('message',async message=>{
	
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
			id: 2,
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
			id: 3,
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
			id: 4,
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
		if(["send","give","pay"].includes(args[1])){
			let data = await info.load(message.member.id);
			args=args.join(" ").replace("all",data.gold).replace("half",data.gold/2|0).replace("quarter",data.gold/4|0).replace("third",data.gold/3|0).split(" ");
			if(message.mentions.members.array().length==0||message.mentions.members.array()[0].id==message.member.id){
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please mention a user."));
			} else if(!parseInt(args[3])){
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a correct number."));
			} else {
				let data = await info.load(message.member.id);
				let amount = (parseInt(args[3].split("-").join(""))||0)|0;
				let receiver = message.mentions.members.array()[0];
				if(data.gold<amount){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You need **"+(amount-data.gold)+"** more gold."));	
				} else {
					data.gold-=amount;
					let sentData = await info.load(receiver.id);
					sentData.gold+=amount;
					await info.save(message.member.id,data);
					await info.save(receiver.id,sentData);
					message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Transfer successful**\n<@!"+message.member.id+"> sent **"+amount+"** gold to <@!"+receiver.id+">!"));	
				}
			}
		}else{
			var userToFind=message.member;
			if(message.mentions.members.array().length!=0){
				userToFind=message.mentions.members.array()[0];
			}
			if(userToFind.user.bot) userToFind=message.member;
			info.load(userToFind.id).then(data=>{
				message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+"> has " + data.gold + " gold!").setColor("GOLD"));
			})
		}	
	} else if(["buy","purchase","get"].includes(args[0])){
		let item=undefined;
		items.forEach(cat=>{
			item=(cat.items.find(i=>i.id==parseInt(args[1]))||item);
		});
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
					message.channel.send(new Discord.MessageEmbed().setDescription("You have successfully bought **"+item.name+"** for **"+item.price+"** gold!").setColor("GREEN"));
				}
			})	
		}
		
	}
	
	
})

//User event
client.on('message',async message=>{
	
	if(message.channel.type=="dm") return;
	
	//Normal messages
	if(message.author.bot) return;
	
	if(message.channel.id=="733647169491304508"){
		await message.react("⬆️");
		await message.react("⬇️");
	}
	
	//Anti-Spam
	if(message.author.antiSpamCount==undefined) message.author.antiSpamCount=0;
	if(message.author.antiSpamCount==0) message.author.antiSpamFirst=Date.now();
	message.author.antiSpamCount+=1;
	
	if(Date.now()-message.author.antiSpamFirst<4000){
		if(message.author.antiSpamCount>8){
			mute(message.member,3600).then(()=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+message.member.id+"> was muted for **1** hour.\n**Reason:** Spam.").setColor("RED"))
					adminlog("Mute",message.guild.members.cache.get(client.user.id),"<@!"+message.member.id+"> for **1** hour.","Spam")
			});
		}else if(message.author.antiSpamCount>5){
			message.delete().then(m=>{
				message.channel.send("<@!"+message.author.id+">, please don't spam!");
			});
		}
	} else {
		message.author.antiSpamCount=0;
	}
	
		//Membership
		membershipUpdate(message.member);
		
	
	if(message.member.messageCombo==undefined) message.member.messageCombo=0;
	message.member.messageCombo++;
	if(message.member.messageCombo>=10){
		message.member.messageCombo=0;
		await updateProfile(message.member,10);
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
	}
	
	//Commands
	if(message.channel.id!="728025726556569631") return;
	if(["dailyreward","daily","dr","reward"].includes(args[0])){
	
		info.load(message.member.id).then(data=>{
			if(data.dailyReward==undefined||(Date.now()-data.dailyReward>3600*24*1000)){
				if(data.dailyReward==undefined) data.dailyReward=0; 
				let gold=40;
				let embed=new Discord.MessageEmbed().setColor("GREEN").setDescription("💸 You have claimed your **40** gold daily reward!");
				if(Date.now()-data.dailyReward-3600*24*1000<10*1000){
					gold+=160;
					embed.setDescription(embed.description+"\n⌛ You have claimed your reward very early! You received an additional **160** gold!");
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
		
	} else if(args[0]=="collect"){
		if(message.channel.chest==undefined||message.channel.chest.collected==true){
			message.channel.send(new Discord.MessageEmbed().setDescription("😧 There is no dropped chest now! Come back later!").setColor("RED"))
		} else {
			info.load(message.member.id).then(data=>{
				data.gold+=message.channel.chest.value;
				message.channel.chest.collected=true;
				info.save(message.member.id,data).then(()=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("🌟 **You have opened the chest!** <@!"+message.author.id+">, You received **"+message.channel.chest.value+"** gold!").setColor("GREEN"))
				})
			})	
		}
		
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
				message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+">'s level is " + data.level + "!").addField("Progress","`"+"█".repeat(Math.max(prog*20,0)+1|0)+" ".repeat(Math.max(1-prog,0)*20|0)+"`  **"+(prog*100|0)+"**%").setColor("GREEN"));
			});
		});
	} else if(args[0]=="uptime"){
		message.channel.send(new Discord.MessageEmbed().setDescription("I've been up for "+msToString(client.uptime)+"!").setColor("YELLOW"));
	} else if(args[0]=="gold"){
		if(["send","give","pay"].includes(args[1])){
			let data = await info.load(message.member.id);
			args=args.join(" ").replace("all",data.gold).replace("half",data.gold/2|0).replace("quarter",data.gold/4|0).replace("third",data.gold/3|0).split(" ");
			if(message.mentions.members.array().length==0||message.mentions.members.array()[0].id==message.member.id||message.mentions.members.array()[0].bot){
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please mention a correct user."));
			} else if(!parseInt(args[3])){
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a correct number."));
			} else {
				let data = await info.load(message.member.id);
				let amount = (parseInt(args[3].split("-").join(""))||0)|0;
				let receiver = message.mentions.members.array()[0];
				if(data.gold<amount){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You need **"+(amount-data.gold)+"** more gold."));	
				} else {
					data.gold-=amount;
					let sentData = await info.load(receiver.id);
					sentData.gold+=amount;
					await info.save(message.member.id,data);
					await info.save(receiver.id,sentData);
					message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Transfer successful**\n<@!"+message.member.id+"> sent **"+amount+"** gold to <@!"+receiver.id+">!"));	
				}
			}
		}else{
			var userToFind=message.member;
			if(message.mentions.members.array().length!=0){
				userToFind=message.mentions.members.array()[0];
			}
			if(userToFind.user.bot) userToFind=message.member;
			info.load(userToFind.id).then(data=>{
				message.channel.send(new Discord.MessageEmbed().setDescription("<@!"+userToFind.id+"> has " + data.gold + " gold!").setColor("GOLD"));
			})
		}
	} else if(args[0]=="profile"){
		if(args[1]=="clear"){
			let data=await info.load(message.member.id);
			if(args[2]=="bio"){
				data.bio=undefined;
				message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Bio successfully cleared!"));
			} else if(args[2]=="name"){
				data.pname=undefined;
				message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Profile name successfully cleared!"));
			} else if(args[2]=="back"||args[2]=="background"){
				data.back=undefined;
				message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Profile background successfully cleared!"));
			} else {
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify: **name**, **bio**, **background**."));	
			}
			await info.save(message.member.id,data);
		} else if(args[1]=="set"){
			if(args[2]=="bio"){
				if(["",undefined].includes(args[3])){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a bio."));	
				} else {
					info.load(message.member.id).then(data=>{
						data.bio=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
						if(data.bio.length<5||data.bio.length>200){
							message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Your bio must be between 5 and 200 characters long."));
						} else {
							info.save(message.member.id,data).then(()=>{
								message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Bio successfully updated!"));
							})
						}
					})	
				}
			} else if(args[2]=="name"){
				if(["",undefined].includes(args[3])){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a profile name."));	
				} else {
					info.load(message.member.id).then(data=>{
						data.pname=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
						if(data.pname.length<4||data.pname.length>50){
							message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Your profile name must be between 4 and 50 characters long."));
						} else {
							info.save(message.member.id,data).then(()=>{
								message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Profile name successfully updated!"));
							})
						}
					})	
				}
			} else if(args[2]=="back"||args[2]=="background"){
				let rest=message.content.replace("profile set "+args_case[2]+" ","");
				message.content = message.content.replace("default","#36393e")
				if(args[3]==undefined) args[3]="";
				if(["",undefined].includes(args[3])&&message.attachments.array().length==0){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a color/image URL or attach an image."));	
				} else if(!validURL(rest)&&!colors.includes(args[3])&&!validHEX(args[3].replace("#",""))&&message.attachments.array().length==0){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a correct name color/hex color/image URL or attach an image."));
				} else {
					let data = await info.load(message.member.id);
					data.back=rest;
					if(colors.includes(args[3])) data.back=args[3];
					if(validHEX(args[3].replace("#",""))) data.back="#"+args[3].replace("#",""); 
					if(message.attachments.array().length>0) data.back=message.attachments.array()[0].url;
					await info.save(message.member.id,data);
					message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Profile background successfully updated!"));	
				}
			} else{
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify: **name**, **bio**, **background**."));	
			}
		} else {
			var userToFind=message.member;
			if(message.mentions.members.array().length!=0){
				userToFind=message.mentions.members.array()[0];
			}
			if(userToFind.user.bot) userToFind=message.member;
			message.channel.startTyping();
			await updateProfile(userToFind,0);
			let profile = await loadProfile(userToFind);
			await message.channel.send("",{files: [profile]});
			message.channel.stopTyping();
			
		}
		
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
		let embed=new Discord.MessageEmbed().setDescription("Restarting...").setColor("ORANGE");
		message.channel.send(embed);
		pitch.channels.cache.get(message.channel.id).send(embed);
		treble.channels.cache.get(message.channel.id).send(embed);
		restart();
		  
	} else if(args[0]=="reload"){
		  
		if(message.author.id!="123413327094218753") return;
		let embed=new Discord.MessageEmbed().setDescription("Reloading database...").setColor("RED");
		rawlog(new Discord.MessageEmbed().setColor("ORANGE").setDescription("Reloading database.."))
		message.channel.send(embed).then(msg=>{
			request.get({
				url: dbLink+'?limit=1000',
				headers: {
				    'Content-Type': 'application/json',
				}
				},(err,r,body)=>{
				if (!err) console.log("Data loaded, no error");
				dataStorage=JSON.parse(body);
				msg.edit(new Discord.MessageEmbed().setDescription("Database reloaded!").setColor("GREEN"));
				rawlog(new Discord.MessageEmbed().setColor("GREEN").setDescription("Database Reloaded!"))
			});
		});
		  
	} else if(["tronald","donald","trump","donaldtrump"].includes(args[0])){
		request.get({
			url: "https://www.tronalddump.io/random/quote",
			headers: {
				'Accept': 'application/json',
				}
			},(err,re,body)=>{
				let meme=body;
				if((typeof meme)=="string") meme=JSON.parse(body);
				message.channel.send(new Discord.MessageEmbed().setColor("#72d7e0").setTitle("Donald trump once tweeted:").setDescription(meme.value).setURL(meme._embedded.source[0].url).setFooter(meme._links.self.href));
			})
	} else if(["randommeme","meme","rmeme"].includes(args[0])){
		request.get({
			url: "https://meme-api.herokuapp.com/gimme",
			headers: {
				'Content-Type': 'application/json',
				}
			},(err,re,body)=>{
				let meme=JSON.parse(body);
				message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setTitle(meme.title).setImage(meme.url).setURL(meme.postLink).setFooter("r/"+meme.subreddit));
			})
	} else if(["randomcat"].includes(args[0])){
		let width=(Math.random()*1800+200)|0;
		let height=(Math.random()*1800+200)|0;
		message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Meow!**").setImage("http://placekitten.com/"+width+"/"+height+"/"));
	} else if(["leaderboard","board","list"].includes(args[0])){
		sortMembers();
		let embed=new Discord.MessageEmbed().setColor("AQUA").setDescription("**Leaderboard:**").addField("Rank",["🥇","🥈","🥉",4,5,6,7,8,9,10].join("\n"),true).addField("Member",dataStorage.map((it,i)=>{if(i<10) return "<@!"+it.id+">\n"}).join(""),true);
		message.channel.send(embed)
	} else if(args[0]=="gamble"){
		let data = await info.load(message.member.id);
		args=args.join(" ").replace("all",data.gold).replace("half",data.gold/2|0).replace("quarter",data.gold/4|0).replace("third",data.gold/3|0).split(" ");
		if(!parseInt(args[1])||["",undefined].includes(args[1])||parseInt(args[1])==0){
			message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct amount.").setColor("RED"));
		} else {
			let amount = parseInt(args[1].split("-").join(""))|0;
			if(data.gamblesToday==undefined) data.gamblesToday=0;
			if(data.gamblesToday==5){
				message.channel.send(new Discord.MessageEmbed().setDescription("You have already gambled 5 times today, come back later!").setColor("RED"));
			} else if(amount>data.gold){
				message.channel.send(new Discord.MessageEmbed().setDescription("You do not have enough gold.").setColor("RED"));	
			} else {
				let gambled = Math.random()*Math.random()*2*amount|0;
				gambled += amount*((Math.random()*2)|0);
				gambled -= amount;
				data.gamblesToday+=1;
				let embed = new Discord.MessageEmbed().setDescription("Gambling **"+amount+"** ...");
				let msg=await message.channel.send(embed)
				await wait(3000);
				data = await info.load(message.member.id);
				if(gambled<0){
					embed = new Discord.MessageEmbed().setDescription("**🌑 Oh no, bad luck!** <@!"+message.author.id+">, You just lost **"+ Math.abs(gambled)+"** gold :(.").setColor("RED");	
				}else if(gambled<amount){
					embed = new Discord.MessageEmbed().setDescription("**☄️ Lucky!!** <@!"+message.author.id+">, You gained **"+ gambled+"** gold.").setColor("YELLOW");		
				}else{
					embed = new Discord.MessageEmbed().setDescription("**🍀 Four-leaf clover!!** <@!"+message.author.id+">, You gained **"+ gambled+"** gold.").setColor("GREEN");		
				}
				data.gold+=gambled;
				await info.save(message.member.id,data);
				msg.edit(embed);
				
			}
		}
	}else if(["word","words","dictionnary","w"].includes(args[0])){
		if(["def","definition","meaning","m","means"].includes(args[1])){
			if(["",undefined].includes(args[2])){
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a word.").setColor("RED"));
			} else {
				let word = args.join(" ").replace(args[0]+" "+args[1]+" ","");
				console.log(word);
				let body = await getURL("http://api.datamuse.com/words?sp="+word.split(" ").join("+")+"&md=d");
				let words=JSON.parse(body);
				if(words.length==0){
					message.channel.send(new Discord.MessageEmbed().setDescription("No definition for the word **"+word+"** was found.").setColor("RED"));	
				} else {
					let embed=new Discord.MessageEmbed().setColor("#c2ed6b").setDescription("Definition for search: **"+word+"**");
					let hehe=word;
					words.forEach((word,i)=>{
					if(word.defs!=undefined) word.defs.forEach((desc,i,t)=>{
						if(desc.startsWith("n")) t[i]=desc.replace("n","*(n.)* —");
						if(desc.startsWith("adj")) t[i]=desc.replace("adj","*(adj.)* —");
						if(desc.startsWith("v")) t[i]=desc.replace("v","*(v.)* —");
						if(desc.startsWith("adv")) t[i]=desc.replace("adv","*(adv.)* —");
						if(desc.startsWith("u")) t[i]=desc.replace("u","*(n/a)* —");
					})
					let desc="No definitions available."
					let n=6;
					if(hehe.includes(word)) n=1;
					if(word.defs!=undefined) desc="Definition(s):\n"+word.defs.map(def=>"● "+def).join("\n");
					if(i<n) embed.addField("Word: "+word.word,desc,true)
					})
					await message.channel.send(embed);
				}
			}
		} else if(["rhy","rhyme","rhymes"].includes(args[1])){
			if(["",undefined].includes(args[2])){
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a word.").setColor("RED"));
			} else {
				let word = args.join(" ").replace(args[0]+" "+args[1]+" ","");
				console.log(word);
				let body = await getURL("https://api.datamuse.com/words?rel_rhy="+word.split(" ").join("+"));
				let words=JSON.parse(body);
				if(words.length==0){
					message.channel.send(new Discord.MessageEmbed().setDescription("No rhymes for the word **"+word+"** were found.").setColor("RED"));	
				} else {
					let embed=new Discord.MessageEmbed().setColor("#c2ed6b").setDescription("What rhymes with: **"+word+"** ("+Math.min(25,words.length)+" rhymes)");
					words.forEach((w,i)=>{
					if(i<25) embed.addField("Word: "+w.word,"Syllables: "+w.numSyllables,true);
					})
					await message.channel.send(embed);
				}
			}
		} else if(["syn","synonym","synonyms","like"].includes(args[1])){
			if(["",undefined].includes(args[2])){
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a word.").setColor("RED"));
			} else {
				let word = args.join(" ").replace(args[0]+" "+args[1]+" ","");
				console.log(word);
				let body = await getURL("https://api.datamuse.com/words?rel_syn="+word.split(" ").join("+"));
				let words=JSON.parse(body);
				if(words.length==0){
					message.channel.send(new Discord.MessageEmbed().setDescription("No synonyms for the word **"+word+"** were found.").setColor("RED"));	
				} else {
					let embed=new Discord.MessageEmbed().setColor("#c2ed6b").setDescription("Synonyms for: **"+word+"**").addField(words.length+" synonyms",words.map(w=>w.word).join(", "));
					await message.channel.send(embed);
				}
			}
		} else if(["ant","antonym","antonyms","opposite"].includes(args[1])){
			if(["",undefined].includes(args[2])){
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a word.").setColor("RED"));
			} else {
				let word = args.join(" ").replace(args[0]+" "+args[1]+" ","");
				console.log(word);
				let body = await getURL("https://api.datamuse.com/words?rel_ant="+word.split(" ").join("+"));
				let words=JSON.parse(body);
				if(words.length==0){
					message.channel.send(new Discord.MessageEmbed().setDescription("No antonyms for the word **"+word+"** were found.").setColor("RED"));	
				} else {
					let embed=new Discord.MessageEmbed().setColor("#c2ed6b").setDescription("Antonyms for: **"+word+"**").addField(words.length+" antonyms",words.map(w=>w.word).join(", "));
					await message.channel.send(embed);
				}
			}
		} else if(["sc","syllable","syl","syllables","syllablecount"].includes(args[1])){
			if(["",undefined].includes(args[2])){
				message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a word.").setColor("RED"));
			} else {
				let word = args.join(" ").replace(args[0]+" "+args[1]+" ","");
				console.log(word);
				let body = await getURL("http://api.datamuse.com/words?sp="+word.split(" ").join("+")+"&md=s");
				let words=JSON.parse(body);
				if(words.length==0){
					message.channel.send(new Discord.MessageEmbed().setDescription("No information about the word **"+word+"** was found.").setColor("RED"));	
				} else {
					let embed=new Discord.MessageEmbed().setColor("#c2ed6b").setDescription("Syllable count for search: **"+word+"**");
					let hehe=word;
					words.forEach((word,i)=>{
					let desc="Syllable count: "+word.numSyllables;
					embed.addField("Word: "+word.word,desc,true)
					})
					await message.channel.send(embed);
				}
			}
		}
								  
	}else if(["rfact","randomfact"].includes(args[0])){
		let body = await getURL("https://uselessfacts.jsph.pl/random.json?language=en");
		let fact=JSON.parse(body);
		message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription("**Random useless fact:**\n\n"+fact.text).setFooter("Source: "+fact.source));
	}else if(["nfact","numberfact","numfact"].includes(args[0])){
		if(!parseInt(args[1])){
			let body = await getURL("http://numbersapi.com/random");
			message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription("**Random number fact:**\n\n"+body));	
		} else {
			let number=parseInt(args[1]);
			let body=await getURL("http://numbersapi.com/"+number);
			message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription("**Fact about number "+number+":**\n\n"+body));
		}
	}else if(args[0]=="help"){
	
		const commands = [{
			name: "Info & Customization",
			description: "All you need to know!",
			commands:[{
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
				longDescription: "Use this command to display someone's full profile, or to edit your own profile.",
				usage: "profile [@user/set/clear] (name/bio/background) (value)",
				subcommands: "set, clear"
			},{
				name: "level",
				description: "Displays your/someone's level.",
				usage: "level [@user]"
			},{
				name: "color",
				description: "Name color commands.",
				longDescription: "This commands is used to change your name color, or to see your/someone's color.",
				subcommands: "set, list",
				usage: "color <set/list> (color name)"
			},{
				name: "leaderboard",
				description: "Displays top 10 server members.",
				usage: "leaderboard"
			}]
		},{
			name: "Economy",
			description: "Use your gold and gain rewards!",
			commands:[{
				name: "dailyreward",
				description: "Claim your daily reward.",
				longDescription: "Claim a daily **40** gold reward, if you get lucky and claim it soon enough, you may get more gold!",
				usage: "dailyreward"
			},{
				name: "gold",
				description: "Displays your/someone's gold.",
				usage: "gold [@user/give] (@user)",
				subcommands: "give"
			},{
				name: "collect",
				description: "Collect a dropped chest.",
				longDescription: "Use this command to collect a chest whenever it is dropped!",
				usage: "collect"
			},{
				name: "gamble",
				description: "Gamble and if you're lucky enough, double your money :)",
				usage: "gamble <amount>"
			}]
		},{
			name: "Fun & Entertainement",
			description: "Just fun commands!",
			commands:[{
				name: "randomcat",
				description: "Random cute picture of a cat!",
				usage: "randomcat"
			},{
				name: "randommeme",
				description: "Random meme from reddit!",
				usage: "randommeme"
			},{
				name: "tronald",
				description: "Dumbest quotes Donald Trump has ever said!",
				usage: "tronald"
			}]
		},{
			name: "Knowledge",
			description: "Big brain stuff!",
			commands:[{
				name: "word",
				description: "Get the definition, rhymes and other useful info about English words!",
				usage: "word <meaning/rhyme/syllables/synonyms/antonyms> <word>",
				subcommands: "meaning, rhyme, syllables, synonyms, antonyms"
			},{
				name: "randomfact",
				description: "Random useless fact :)",
				usage: "randomfact"
			},{
				name: "numberfact",
				description: "Random fact about numbers!",
				longDescription: "Random fact about numbers! you can specify a number to get a fact about it",
				usage: "randomfact [number]"
			}]
		}
		]
		let cmd=undefined;
		commands.forEach(cat=>{
			cmd=(cat.commands.find(t=>(t.name==args[1]))||cmd);
		})
		if(["",undefined].includes(args[1])){
			var embed= new Discord.MessageEmbed().setColor("AQUA").setTitle("Command list").setDescription("Use `help <command>` for specific command help");
			commands.forEach(cat=>{
				embed.addField("__"+cat.name+"__","*"+cat.description+"*\n"+cat.commands.map((item,id)=>{return "`"+item.name+"` - "+item.description;}).join("\n"),true);
			})
			message.channel.send(embed);
		} else if(cmd!=undefined){
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
					adminlog("Unmute",message.member,"<@!"+muted.id+">");
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
						adminlog("Mute",message.member,"<@!"+muted.id+"> for "+msToString(time*1000),reason)
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
					adminlog("Event create",message.member,"Created event with identifier: **" + args[2]+"**");
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
					adminlog("Event rename",message.member,"Renamed event with identifier **" + args[2] + "** to **" + name+"**");
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
					adminlog("Event description",message.member,"Updated event description with identifier **" + args[2] + "** to **" + desc+"**");
				}
			} else if(args[1]=="startsin"){
				if((["",undefined].includes(args[2]))||(message.guild.events.find(e=>(e.id==args[2]))==undefined)){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an existing event identifier.").setColor("GRAY"));
				} else if(["",undefined].includes(args[3])) {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct time for the event.").setColor("GRAY"));
				} else {
					
					try{const time=timeformatToSeconds(args[3]);
					message.guild.events.find(e=>(e.id==args[2])).time=Date.now()+time*1000;
					message.channel.send(new Discord.MessageEmbed().setDescription("Event **"+args[2]+"** starts in: "+msToString(time*1000)+".").setColor("GREEN"))
					adminlog("Event time",message.member,"Updated event time with identifier **" + args[2] + "** to **" + (new Date(Date.now()+time*1000))+"**");
					   
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
					adminlog("Event announce",message.member,"Announced event time with identifier **"+args[2]+"**");
					
				}
				
			} else if(args[1]=="start"){
					const embed= new Discord.MessageEmbed().setTitle("Event Started!").setColor("GREEN").setFooter("!eventstart");
					message.guild.channels.cache.get("728022865622073446").send(embed)
					adminlog("Event Start",message.member,"Started the event");
					message.guild.roles.cache.get("730598527654297771").members.array().forEach(m=>{
						m.send(new Discord.MessageEmbed().setDescription("🥳 Event has started!").setColor("GREEN"))
					});
			} else if(args[1]=="end"){
			
					const embed= new Discord.MessageEmbed().setTitle("Event ended! :(").setColor("RED").setFooter("!eventend");
					message.guild.channels.cache.get("728022865622073446").send(embed);
					adminlog("Event Start",message.member,"Ended the event");
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
client.on("voiceStateUpdate",async (o,n)=>{

	const vcs=["728008557911605341", "728027365820727407","728027460515659838","728027677344268337","728027756906020865","728027832747556892","728027908127457370"];
	const mvcs=["728030297911853176","728029167286878240"];
	if(n.member.user.bot) return;
	if(n.channel==o.channel) return;
	if(n.channel!=null){
		log(new Discord.MessageEmbed().setAuthor(o.member.user.tag,o.member.user.displayAvatarURL()).setColor("GREEN").setDescription("Voice channel join").addField("Member","<@!"+o.member.id+">",true).addField("Joined voice channel",n.channel.name,true).setFooter("Channel ID: "+n.channel.id).setTimestamp());
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
	} 
	if(o.channel!=null){
		log(new Discord.MessageEmbed().setAuthor(o.member.user.tag,o.member.user.displayAvatarURL()).setColor("RED").setDescription("Voice channel leave").addField("Member","<@!"+o.member.id+">",true).addField("Left voice channel",o.channel.name,true).setFooter("Channel ID: "+o.channel.id).setTimestamp());
		if(vcs.includes(o.channel.id)){
			n.member.guild.channels.cache.get("729354613064728636").send(new Discord.MessageEmbed().setDescription("<@!"+o.member.id+"> left **" + o.channel.name + "**").setColor("RED"));
			n.member.roles.remove(["729502041122013195","729502308634853456"]);
		} else if(mvcs.includes(o.channel.id)){
			n.member.guild.channels.cache.get("728029565607346227").send(new Discord.MessageEmbed().setDescription("<@!"+o.member.id+"> left **" + o.channel.name + "**").setColor("RED"));
			n.member.roles.remove(["729502041122013195","729502308634853456"]);
		}
	}
	
});
client.on('messageUpdate',(om,nm)=>{
	if(nm.author.bot) return;
	log(new Discord.MessageEmbed().setAuthor(nm.author.tag,nm.author.displayAvatarURL()).setColor("BLUE").setDescription("Message Edit").addField("Member","<@!"+nm.member.id+">",true).addField("Channel","<#"+nm.channel.id+">",true).addField("Old content",(om.cleanContent||"Empty message.")).addField("New content",(nm.cleanContent||"Empty message.")).setFooter("Message ID: "+nm.id).setTimestamp());
})
client.on('messageDelete',(dm)=>{
	if(dm.author.bot) return;
	log(new Discord.MessageEmbed().setAuthor(dm.author.tag,dm.author.displayAvatarURL()).setColor("ORANGE").setDescription("Message Deleted").addField("Member","<@!"+dm.member.id+">",true).addField("Channel","<#"+dm.channel.id+">",true).addField("Content",(dm.cleanContent||"Empty message.")).setFooter("Message ID: "+dm.id).setTimestamp().setImage((dm.attachments.array()[0]||{url: undefined}).url));
})

///Welcoming
client.on('guildMemberAdd',member=>{

	if((member.lastLeft!=undefined)&&(member.lastLeft<Date.now()+60*10000)) member.kick().then(member=>{
		member.user.send("You need to wait 10 minutes before joining again.")
	}) 
	log(new Discord.MessageEmbed().setAuthor(member.user.nametag,member.user.displayAvatarURL()).setColor("BLUE").setDescription("New member").addField("Member","<@!"+member.id+">").setFooter("Member ID: "+member.id).setTimestamp());
	var startRoles=["728018741174075412","728212856046223480","728035160448041021","728018742965174382","728031955685343312","728214239784861776","728032333671825479","729438972161556610"];
	var welcome_channel=member.guild.channels.cache.get("728008557911605340");
	welcome_channel.send(new Discord.MessageEmbed().addField("Hey hey hey!","We've been waiting for you!").setTitle("Welcome " + member.displayName + "!").setThumbnail(member.user.displayAvatarURL()));
	member.roles.add(startRoles);
	member.send(new Discord.MessageEmbed().setTitle("Welcome " + member.displayName + " to " + member.guild.name + "!").setDescription("Make sure to read rules! Then you can customize your profile by choosing a color in #commands and picking some roles in #role-self-assign, have fun <3!").setColor("fafafa"));
	
});

client.on('guildMemberRemove',member=>{
	log(new Discord.MessageEmbed().setAuthor(member.user.nametag,member.user.displayAvatarURL()).setColor("ORANGE").setDescription("Member left").addField("Member",member.user.nametag).setFooter("Member ID: "+member.id).setTimestamp());
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
	treble.channels.resolve("729155101746528286").send(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Ready!**"));
	treble.channels.cache.get("728030297911853176").join();
	treble.channels.cache.get("733527587749363793").join();
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
	pitch.channels.resolve("729155101746528286").send(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Ready!**"));
	pitch.channels.cache.get("728029167286878240").join();
	pitch.channels.cache.get("733528421396643973").join();
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
	var args=message.content.toLowerCase().split(" ");
	var args_case=message.content.split(" ");
	if(message.member.voice.channel!=undefined){
		var chosenclient = pitch;
		if(message.member.voice.channel.id=="728030297911853176") chosenclient = treble;
	}
	if(message.guild.id=="715993163449237616"&&message.channel.id=="739049101424852992"&&message.content.startsWith(">")){
		chosenclient=treble;
		args[0] = args[0].replace(">","");
	} else if(message.channel.id!="728029565607346227"&&message.channel.id!="733527714375663626"){
		return;
	}
	if(message.author.bot) return;
	if(message.member.voice.channel!=undefined){
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
				if(message.guild.id=="728008557244448788") chosenclient.user.setPresence({
						status: "dnd",
						afk: false,
						activity: {
							name: song.song.name,
							type: "PLAYING",
							url: song.song.url
						}});
				chosenclient.player.getQueue(message.guild.id).on('songChanged', (oldSong, song) => {
			    		message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Now playing: **" +song.name + " (Requested by " + song.requestedBy+")"))
					if(message.guild.id=="728008557244448788") chosenclient.user.setPresence({
						status: "dnd",
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
					if(message.guild.id=="728008557244448788") chosenclient.user.setPresence({
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
			await chosenclient.player.resume(message.guild.id);
			let queue = await chosenclient.player.getQueue(message.guild.id);
			let r = queue.songs[0].requestedBy;
			if(message.member.hasPermission("MANAGE_CHANNELS")||r.includes(message.member.id)){
				chosenclient.player.stop(message.guild.id).then(()=>{
				chosenclient.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: "",
							type: "PLAYING",
							url: null
						}});
				});
				message.channel.send(new Discord.MessageEmbed().setDescription("⏹️ Music stopped!").setColor("RED"))
			} else {
				message.channel.send(new Discord.MessageEmbed().setDescription("You can't stop the music.").setColor("RED"))	
			}
			
		} else if((args[0]=="skip")&&(!isEmpty)){
			await chosenclient.player.resume(message.guild.id);
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
			await chosenclient.player.resume(message.guild.id);
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
					chosenclient.player.remove(message.guild.id,n-1).then(async ()=>{
						if(n==1) {
							await chosenclient.player.resume(message.guild.id);
							chosenclient.player.skip(message.guild.id);
						}
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


let dataStorage=[];
request.get({
        url: dbLink+'?limit=1000',
        headers: {
            'Content-Type': 'application/json',
        }
        },(err,r,body)=>{
	if (!err) console.log("Data loaded, no error");
	dataStorage=JSON.parse(body);
	dataStorage.forEach(dat=>console.log(dat.id))
	client.login(process.env.BOT_TOKEN);
});

// THIS  MUST  BE  THIS  WAY
treble.login(process.env.MUSIC2);
pitch.login(process.env.MUSIC1);



