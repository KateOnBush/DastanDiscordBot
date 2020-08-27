const Discord = require('discord.js');
const Canvas = require('canvas-constructor');
const client = new Discord.Client();
const request = require('request');
const dbLink = process.env.DBLINK;
const eventChannelID="742579924149338212";

const achievements = {
	progress: async function(member,id,steps){
		let data=await info.load(member.id);
		if(!data.achievements) data.achievements=[];
		if(!this.list.find(c=>c.id===id)) throw new ReferenceError("Achievement with ID "+id+" doesn't exist"); 
		if(!data.achievements.find(ac=>ac.id===id)) data.achievements.push({ id: id, steps: 0 });
		if(data.achievements.find(ac=>ac.id===id).steps>=this.list.find(c=>c.id===id).steps) return false;
		data.achievements.find(ac=>ac.id===id).steps+=steps;
		if(data.achievements.find(ac=>ac.id===id).steps>=this.list.find(c=>c.id===id).steps){
		let acc=this.list.find(c=>c.id===id);
		data.gold+=acc.reward;
		((member.lastMessage||{channel: undefined}).channel||member.guild.channels.cache.get("728025726556569631")).send(new Discord.MessageEmbed().setColor("GREEN").setDescription("🔓 Achievement unlocked: **"+acc.name+"**\n"+acc.description+"\n"+member.toString()+(acc.reward>0 ? ", you received **"+acc.reward+"** gold!" : ", you don't get money for that do you?")));
		}
		await info.save(member.id,data);
		return true;
	},
	getDone: async function(member){
		let data=await info.load(member.id);
		if(!data.achievements) data.achievements=[];
		return this.list.filter((ac,i)=>{
			let a=data.achievements.find(t=>t.id==ac.id);
			if(a&&a.steps>=ac.steps) return true;
			return false;
		})
		
	},
	getActive: async function(member){
		let data=await info.load(member.id);
		if(!data.achievements) data.achievements=[];
		return this.list.filter((ac,i)=>{
			let a=data.achievements.find(t=>t.id==ac.id);
			if(a&&a.steps>=(ac.steps/2)&&a.steps<ac.steps) return true;
			return false;
		})
		
	},
      	list: [{
		name: "Roles!",
		description: "Assign 10 roles to yourself!",
		id: "ROLES",
		steps: 10,
		reward: 80
	},{
		name: "Level up!",
		description: "Level up the first time!",
		id: "LEVEL_UP",
		steps: 1,
		reward: 50
	},{
		name: "Colorful world!",
		description: "Change your color the first time!",
		id: "COLOR",
		steps: 1,
		reward: 50
	},{
		name: "Talkative!",
		description: "Spend 1 hour in VC!",
		id: "VC1",
		steps: 60,
		reward: 100
	},{
		name: "Public speaker!",
		description: "Spend 10 hours in VC!",
		id: "VC2",
		steps: 600,
		reward: 1000
	},{
		name: "TALKING MACHINE!",
		description: "Spend 50 hours in VC!",
		id: "VC3",
		steps: 3000,
		reward: 6000
	},{
		name: "EMINEM!",
		description: "Spend 100 hours in VC!",
		id: "VC4",
		steps: 6000,
		reward: 15000
	},{
		name: "Spammer!",
		description: "Send 1 000 messages!",
		id: "MSG1",
		steps: 1000,
		reward: 500
	},{
		name: "Rapper!",
		description: "Send 10 000 messages!",
		id: "MSG2",
		steps: 10000,
		reward: 5000
	},{
		name: "Dominator!",
		description: "Send 100 000 messages!",
		id: "MSG3",
		steps: 100000,
		reward: 50000
	},{
		name: "Activity go brrr!",
		description: "Get the <@&728035417441697794> role by being active!",
		id: "ACTIVE",
		steps: 1,
		reward: 1200
	},{
		name: "Music lover!",
		description: "Listen to music for the first time!",
		id: "MUSIC",
		steps: 1,
		reward: 80
	},{
		name: "Events!",
		description: "Participate in your first event!",
		id: "EVENT",
		steps: 1,
		reward: 150
	},{
		name: "Bad guy!",
		description: "Get muted for the first time.",
		id: "MUTE",
		steps: 1,
		reward: 0
	},{
		name: "Gambler!",
		description: "Gamble 10 times.",
		id: "GAMBLE1",
		steps: 10,
		reward: 300
	},{
		name: "Amateur Gambler!",
		description: "Gamble 50 times.",
		id: "GAMBLE2",
		steps: 50,
		reward: 1000
	},{
		name: "Professional Gambler!",
		description: "Gamble 100 times.",
		id: "GAMBLE3",
		steps: 100,
		reward: 5000
	},{
		name: "Good worker!",
		description: "Make 1000 gold from jobs.",
		id: "JOB1",
		steps: 1000,
		reward: 200
	},{
		name: "Money maker!",
		description: "Make 10000 gold from jobs.",
		id: "JOB2",
		steps: 10000,
		reward: 2000
	},{
		name: "What a great deal",
		description: "Purchase your first item from the shop",
		id: "SHOP1",
		steps: 1,
		reward: 120
	},{
		name: "Shop shop shop!",
		description: "Purchase 10 items from the shop",
		id: "SHOP2",
		steps: 10,
		reward: 120
	},{
		name: "Epic booster!",
		description: "Boost the server!",
		id: "BOOST",
		steps: 1,
		reward: 20000
	}]
}
const colors=["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","orange","aliceblue","antiquewhite","aquamarine","azure","beige","bisque","blanchedalmond","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","gainsboro","ghostwhite","gold","goldenrod","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","limegreen","linen","magenta","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","oldlace","olivedrab","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellowgreen","rebeccapurple"];
let addRecord = async function(subject,event){
	let data=await info.load(subject.id);
	if(data.records==undefined) data.records=[];
	data.records.push(event);
	await info.save(subject.id,data);
	return true;
}
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
function eventEmbed(event){
let color ="GREEN";
let ti="Starts in "+msToString(event.time-Date.now());
if(event.time-Date.now()<5000){
	color = "BLUE"
	ti="In progress";
}
let peopleComing = (event.peopleComing.filter((f,i,t)=>t.indexOf(f)==i).map(t=>"<@!"+t+">").join(", ")||"No one.");
return new Discord.MessageEmbed().setColor(color).setTitle(event.name).setDescription(event.desc)
.addField("Host","<@!"+event.host+">",true).addField("Time",new Date(event.time).toString(),true)
.addField("People coming",peopleComing).addField("Status",ti)
.addField("How to join","React with 🎉 to join the event.\nReact with 🔔 to activate reminders.\nReact again to undo the action.").setTimestamp(event.time);	
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
	let xpc = Math.max(0.02,(data.messagesEverSent-levelXp(data.level-1))/(levelXp(data.level)-levelXp(data.level-1)));
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
	let name=member.user.username;
	let tag=member.user.tag.replace(member.user.username,"");
	let avatar=await Canvas.resolveImage(member.user.displayAvatarURL({format: 'png'}));
	let avatarCanvas =await Canvas.resolveImage(new Canvas.Canvas(80,80).printCircularImage(avatar,40,40,40).clearCircle(67.5,67.5,15).toDataURL());
	let canvas = new Canvas.Canvas(500, 270).setColor((backgroundCol||"#36393e")).printRoundedRectangle(0, 0, 500, 270,15);
	if(backgroundImg!=undefined){canvas = canvas.printRoundedImage(backgroundImg,0,0,500,270,15);}
	canvas = canvas.setGlobalAlpha(0.5).setColor("#000000").printRoundedRectangle(10,10,500-20,270-20,10).setGlobalAlpha(1).setColor('#FFFFFF')
.setTextFont('20px Impact').setShadowColor('#000000').setShadowBlur(30).printImage(avatarCanvas,24,24,80,80).setGlobalAlpha(0.6).setColor("#000000")
	.setShadowBlur(0).printRoundedRectangle(120,79,500-120-24,25,12.5).setGlobalAlpha(1)
	.setColor(stat).printCircle(91.5,91.5,11).setShadowBlur(10)
.setColor(member.displayHexColor).printRoundedRectangle(124,83,(500-120-24-8)*xpc,17,12.5);
	let tg = canvas.measureText(name);
	canvas = canvas.printText(name, 120, 45).setGlobalAlpha(0.9).setTextFont('12px Impact').printText(tag,120+tg.width,45).setGlobalAlpha(1).setTextFont('20px Impact').setTextAlign('right').setColor("#cfc402").setShadowBlur(0).printText("#"+rank,500-28,45).setColor(member.displayHexColor).setTextFont('10px Impact').setShadowBlur(4).printText((xpc*100|0)+"%",500-28,75).setTextAlign('left').setShadowBlur(4).setColor("#ffffff").setTextFont('12px Impact')
    	.printText((data.pname||""), 120, 62)
	.setShadowBlur(6).setTextFont('12px Impact')
	.setColor("white").printText("Bio:",24,126).setColor(member.displayHexColor).printWrappedText((data.bio||"No bio set."), 70, 126,500-24-70)
	.setColor("white").printText("Level:",24,180).setColor(member.displayHexColor).printText(data.level+"", 70, 180)
	.setColor("white").printText("Gold:",240,180).setColor(member.displayHexColor).printText(numberBeautifier(data.gold,","), 286, 180)
	.setColor("white").printText("Average Daily Activity Points:",24,200).setColor(member.displayHexColor).printText(numberBeautifier(data.messageAveragePerDay,","), 240, 200)
	.setColor("white").printText("All-Time Activity Points:",24,220).setColor(member.displayHexColor).printText(numberBeautifier(data.messagesEverSent,","), 240, 220)
	.setColor("white").printText("Member since: ",24,240).setColor(member.displayHexColor).printText(new Date(data.joined||member.joinedTimestamp).toLocaleDateString()+"", 240, 240)
    	.toBuffer();
	
	return canvas;

}

//Logs
function log(d){
	client.channels.resolve("729155101746528286").send(d);
}
function adminlog(event,mod,content,subject,reason){
	client.channels.resolve("729744865776107550").send(new Discord.MessageEmbed().setDescription("**Event:** "+event).addField("Mod/Admin","<@!"+mod.id+">",true).addField("Action/Content",content,true).addField("Subject","<@!"+subject.id+">",true).setTimestamp().setColor("BLUE").addField("Reason",(reason||"Unspecified")));
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
	var years=(ms/1000)/31536000|0;
	var months=((ms/1000)-(years*31536000))/2678400|0;
	var weeks=((ms/1000)-(years*31536000)-(months*2678400))/604800|0;
	var days=((ms/1000)-(years*31536000)-(months*2678400)-(weeks*604800))/86400|0;
	var hours=((ms/1000)-(years*31536000)-(months*2678400)-(weeks*604800)-(days*86400))/3600|0;
	var minutes=((ms/1000)-(years*31536000)-(months*2678400)-(weeks*604800)-(days*86400)-(hours*3600))/60|0;
	var seconds=((ms/1000)-(years*31536000)-(months*2678400)-(weeks*604800)-(days*86400)-(hours*3600)-(minutes*60))|0;
	let s = `${years>0 ? `**${years}** year${years>1 ? `s` : ``}, ` : '' }` + `${months>0 ? `**${months}** month${months>1 ? `s` : ``}, ` : '' }` + `${weeks>0 ? `**${weeks}** week${weeks>1 ? `s` : ``}, ` : '' }` + `${days>0 ? `**${days}** day${days>1 ? `s` : ``}, ` : '' }` + `${hours>0 ? `**${hours}** hour${hours>1 ? `s` : ``}, ` : '' }` + `${minutes>0 ? `**${minutes}** minute${minutes>1 ? `s` : ``} and ` : '' }` + `**${seconds}** second${seconds>1 ? `s` : ``}`;
	return s.replace(" and **0** second","").replace(", **0** second","");
}
function timeformatToSeconds(f){
	return eval(f.replace("s","+").replace("m","*60+").replace("h","*3600+").replace("d","*3600*24+").replace("w","*3600*24*7+").replace("mo","*3600*24*30+").replace("y","*3600*24*365+")+"0");	
}
function levelXp(level){
return 30*level*(1+level);
}

async function eventTimer(event){
	if(event.time-Date.now()<(3600*24*1000*15)){
		let remind = async function(){
			let server = await info.load("SERVER");
			let evo = server.events.find(ev=>ev.id==event.id);
			if(evo&&evo.time==event.time){
				let msg= await client.channels.cache.get(eventChannelID).messages.fetch(evo.messageID);
				evo.reminders.forEach(p=>{
					let mem=client.guilds.cache.first().member(p);
					if(mem) mem.send(new Discord.MessageEmbed().setColor("BLUE").setDescription("Event **"+evo.name+"** starts in "+msToString(evo.time-Date.now())+"."));
				});
				msg.edit(msg.content,eventEmbed(evo));
			}
		}
		let start = async function(){
			let server = await info.load("SERVER");
			let evo = server.events.find(ev=>ev.id==event.id);
			if(evo&&evo.time==event.time){
				let msg= await client.channels.cache.get(eventChannelID).messages.fetch(evo.messageID);
				evo.peopleComing.forEach(p=>{
					let mem=client.guilds.cache.first().member(p);
					if(mem){
						mem.send(new Discord.MessageEmbed().setColor("BLUE").setDescription("🥳 Event **"+evo.name+"** has started!!"));
						mem.roles.add("730056362029219911");
					}
				});
				msg.edit(msg.content,eventEmbed(evo));
			}
		}
		let hour=3600*1000;
		if(event.time-14*24*hour>Date.now()) setTimeout(remind,event.time-14*24*hour-Date.now()-500)
		if(event.time-7*24*hour>Date.now()) setTimeout(remind,event.time-7*24*hour-Date.now()-500)
		if(event.time-3*24*hour>Date.now()) setTimeout(remind,event.time-3*24*hour-Date.now()-500)
		if(event.time-24*hour>Date.now()) setTimeout(remind,event.time-24*hour-Date.now()-500)
		if(event.time-6*hour>Date.now()) setTimeout(remind,event.time-6*hour-Date.now()-500)
		if(event.time-3*hour>Date.now()) setTimeout(remind,event.time-3*hour-Date.now()-500)
		if(event.time-1*hour>Date.now()) setTimeout(remind,event.time-1*hour-Date.now()-500)
		if(event.time-0.5*hour>Date.now()) setTimeout(remind,event.time-0.5*hour-Date.now()-500)
		if(event.time-0.25*hour>Date.now()) setTimeout(remind,event.time-0.25*hour-Date.now()-500)
		if(event.time>Date.now()) setTimeout(start,event.time-Date.now())
	}
}
function restart(){
	log(new Discord.MessageEmbed().setColor("ORANGE").setDescription("Restarting..."))
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
function numberBeautifier(number,sep){
  return (number+"").split("").map((item,i,array)=>{if((array.length-i-1)%3==0&&(i!=array.length-1)) return item+sep; else return item;}).join("");
}
async function membershipUpdate(member){
		//Membership
		let data=await info.load(member.id);
		let join=(data.joined||member.joinedTimestamp);
		var days=((Date.now()-join)/(1000*24*3600));
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
async function levelUpdate(member){
	let data = await info.load(member.id);
	let l=data.level;
	let roles=["746753260957990953","746753152610467931","746753035820204092","746754220602163281","746752934506922034","746752829003137134","746752634794410036","746752464707125329","746751207887863840"];
	let t=0;
	if(l<200) t++;
	if(l<100) t++;
	if(l<50) t++;
	if(l<40) t++;
	if(l<30) t++;
	if(l<20) t++;
	if(l<10) t++;
	if(l<5) t++;
	let role=roles[t];
	if(!member.roles.cache.get(roles[t])){
		await member.roles.remove(roles.filter((a,i)=>i!=t));
		await member.roles.add(roles[t]);
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
					achievements.progress(member,"ACTIVE",1)
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
		let serverMult=2; //Server Multiplier (xp weeks)
		let mult=1;
		if(member.roles.cache.array().find(rl=>rl.id=="732234963310608426")!=undefined){
			mult=2;
		}
		if(member.roles.cache.array().find(rl=>rl.id=="743620842495410287")!=undefined){
			if(mult=2){
				mult=4;	
			} else {
				mult=3;
			}
		}
		if(member.roles.cache.array().find(rl=>rl.id=="748584004181033030")){
			achievements.progress(member,"BOOST",1);
			mult=mult*2;	
		}
		c.messagesSentToday+=points;
		c.messagesEverSent+=points*mult*serverMult;
		if(c.joined==undefined) c.joined=member.joinedTimestamp;
		var level=c.level;
		let gold=c.gold;
		while(c.messagesEverSent>levelXp(level)){
			level+=1;
			gold+=50;
			if(level%5==0) gold+=200;
		}
		if(level==2) achievements.progress(member,"LEVEL_UP",1)
		if(level>c.level){
			const message=new Discord.MessageEmbed().setDescription("🎊 **Congratulations <@!"+member.id+">!** You reached level **"+level+"**!").setColor("GREEN");
			message.setDescription(message.description + "\nYou have received **"+(gold-c.gold)+"** gold!");
			if(member.lastMessage!=null) member.lastMessage.channel.send(message);
			else { member.guild.channels.cache.get("728025726556569631").send(message) }
		}
		c.level=level;
		c.gold=gold;
		await info.save(member.id,c);
		await levelUpdate(member);
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
	if(!message.member.hasPermission("ADMINISTRATOR")) return;
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
client.on('ready',async ()=>{
	client.user.setPresence({
		status: "online",
		afk: false,
		activity: {
			name: "#commands — help",
			type: "WATCHING",
			url: null
		}});
	log(new Discord.MessageEmbed().setColor("GREEN").setDescription("**Ready!**"))
	client.channels.cache.get("728025726556569631").send(new Discord.MessageEmbed().setColor("GREEN").setDescription("Ready!"))
	console.log("Ready!")
	setTimeout(dropChest,50000);
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
	client.guilds.cache.array()[0].roles.fetch("743620842495410287").then(role=>{
		role.members.array().forEach(member=>{
			info.load(member.id).then(data=>{
				if(![0,undefined].includes(data.doubleXp)) {
					if(Date.now()>data.doubleXp) {
						member.roles.remove("732234963310608426");
					} else {
						if(data.doubleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
							member.roles.remove("732234963310608426");
						},data.doubleXp-Date.now());
					}
				} else {
					member.roles.remove("732234963310608426");
				}
				if(![0,undefined].includes(data.tripleXp)) {
					if(Date.now()>data.tripleXp) {
						member.roles.remove("743620842495410287");
					} else {
						if(data.tripleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
							member.roles.remove("743620842495410287");
						},data.tripleXp-Date.now());
					}
				} else {
					member.roles.remove("743620842495410287");
				}
			});
		});
	});
	let bans=await client.guilds.cache.array()[0].fetchBans();
	let mutes=client.guilds.cache.array()[0].roles.cache.get("728216095835815976").members;
	dataStorage.forEach(async user=>{
		if(user.tempban){
			if(user.tempban<Date.now()&&bans.get(user.id)){
				client.guilds.cache.array()[0].members.unban(user.id)	
			} else if(((user.tempban-Date.now())<3600*24*1000*2)&&(user.tempban-Date.now()>0)){
				setTimeout(function(){
					client.guilds.cache.array()[0].members.unban(user.id)
				},user.tempban-Date.now())
			}
		}
		if(user.mute){
			if(user.mute<Date.now()&&mutes.get(user.id)){
				client.guilds.cache.array()[0].member(user.id).roles.remove("728216095835815976");
			} else if((user.mute-Date.now())<3600*24*1000*2){
				setTimeout(async function(){
					if(client.guilds.cache.array()[0].member(user.id))
					client.guilds.cache.array()[0].member(user.id).roles.remove("728216095835815976");
				},user.mute-Date.now())
			}
		}
	})
	let server = await info.load("SERVER");
	if(!server.events) server.events=[];
	server.events.forEach(async event=>{
		eventTimer(event);
	})
	let updateEvent=async function(){
		let ser = await info.load("SERVER");
		if(!ser.events) ser.events=[];
		server.events.forEach(async ev=>{
			let message = undefined;
			try{
			if(ev.messageID) message = await client.channels.cache.get(eventChannelID).messages.fetch(ev.messageID);}catch(err){}
			if(message) message.edit(message.content,eventEmbed(ev));
		});
	}
	updateEvent()
	setInterval(updateEvent,60*5*1000);
})

client.on('raw',async event=>{
	if(event.t=="MESSAGE_REACTION_ADD"){
		const data=event.d;
		const channel = client.channels.resolve(data.channel_id);
		channel.messages.fetch(data.message_id).then(async message=>{
			const emojiKey = (data.emoji.id) ? `${data.emoji.id}` : data.emoji.name;
			const react = message.reactions.cache.get(emojiKey);
			const member = message.guild.members.resolve(data.user_id);
			if(member.user.bot==true) return;
			if(react.message.channel.id==eventChannelID){
				let server = await info.load("SERVER");
				if(!server.events) server.events=[];
				let event = server.events.find(ev=>ev.messageID===react.message.id);
				if(!event) return;
				if(!event.peopleComing) event.peopleComing=[];
				if(!event.reminders) event.reminders=[];
				if(react.emoji.name=="🎉") {
					react.users.remove(member.id);
					if(event.peopleComing.includes(member.id)){
						event.peopleComing.splice(event.peopleComing.indexOf(member.id),1);
						if(event.time-Date.now()<5000) member.roles.remove("730056362029219911");
						member.send(new Discord.MessageEmbed().setDescription("You've left the event: **"+event.name+"**.").setColor("ORANGE"))
					} else {
						event.peopleComing.push(member.id);
						if(event.time-Date.now()<5000) member.roles.add("730056362029219911");
						member.send(new Discord.MessageEmbed().setDescription("You've joined the event: **"+event.name+"**.").setColor("GREEN"))
					}
					let embed=eventEmbed(event);
					message.edit(react.message.content,embed);
				}
				if(react.emoji.name=="🔔") {
					react.users.remove(member.id);
					if(event.reminders.includes(member.id)){
						event.reminders.splice(event.reminders.indexOf(member.id),1);
						member.send(new Discord.MessageEmbed().setDescription("You turned off reminders for the event: **"+event.name+"**.").setColor("ORANGE"))
					} else {
						event.reminders.push(member.id);
						member.send(new Discord.MessageEmbed().setDescription("You turned on reminders for for the event: **"+event.name+"**.").setColor("GREEN"))
					}
					let embed=eventEmbed(event);
					message.edit(react.message.content,embed);
				}
				server.events[server.events.findIndex(ev=>ev.messageID===react.message.id)] = event;
				info.save("SERVER",server);
			}
			if(react.message.channel.id!="729298706188468234") return;
			react.users.remove(member.id);
			const roleToAdd=react.message.mentions.roles.array().find(e=>{return message.content.includes(react.emoji.name + " - <@&" + e.id + ">")});
			const first=react.message.mentions.roles.array().find(e=>{return message.content.includes("0️⃣ - <@&" + e.id + ">")});
			const hasClickedRole=member.roles.cache.array().map(r=>r.id).includes(roleToAdd.id);
			if(hasClickedRole){
				member.roles.remove(roleToAdd);
			} else if((react.emoji.name=="0️⃣")&&(first!=undefined)){
				member.roles.remove(message.mentions.roles).then(m=>{
					member.roles.add(roleToAdd);
					achievements.progress(member,"ROLES",1)
				});
			
			} else {
				if(first!=undefined) await member.roles.remove(first);
				if(!react.message.content.includes("!multiple")){
					await member.roles.remove(react.message.mentions.roles.array().filter(r=>r.id!==roleToAdd))
					await member.roles.add(roleToAdd);
					achievements.progress(member,"ROLES",1)
				} else {
					await member.roles.add(roleToAdd);
					achievements.progress(member,"ROLES",1)
				}
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
			name: "Event Automatic Joiner",
			description: "Automatically joins events when they are announced, you can disable/enable at any time using `autoevent` command.",
			longDescription: "With this upgrade, whenever a new event is announced, this will allow you to automatically join it, you will then unlock the command `autoevent <on/off>`, which will give you the ability to enable/disable this perk at any time!",
			price: 300,
			id: 1,
			multiple: false,
			buy: function(member){
				member.roles.add("731828010923065405");
				return true;
			}
		},{
			name: "Event Reward Collector",
			description: "Collects 500 gold for you whenever an event you are in ends :)",
			price: 2500,
			id: 2,
			multiple: false,
			buy: function(member){
				member.roles.add("743622344211300481");
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
			id: 3,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.doubleXp=(data.doubleXp||Date.now());
					data.doubleXp=Math.max(data.doubleXp,Date.now())+3600*+6000;
					member.roles.add("732234963310608426");
					info.save(member.id,data)
					if(data.doubleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
						member.roles.remove("732234963310608426");
					},data.doubleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Double XP - 1 day",
			description: "With this upgrade you get doubled xp for 1 day! Level up fast today!",
			price: 400,
			id: 4,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.doubleXp=(data.doubleXp||Date.now());
					data.doubleXp=Math.max(data.doubleXp,Date.now())+3600*24000;
					member.roles.add("732234963310608426");
					info.save(member.id,data)
					if(data.doubleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
						member.roles.remove("732234963310608426");
					},data.doubleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Double XP - 1 week",
			description: "With this upgrade you get doubled xp for full 7 days! Boost your experience!",
			price: 2200,
			id: 5,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.doubleXp=(data.doubleXp||Date.now());
					data.doubleXp=Math.max(data.doubleXp,Date.now())+3600*7*24000;
					member.roles.add("732234963310608426");
					info.save(member.id,data)
					if(data.doubleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
						member.roles.remove("732234963310608426");
					},data.doubleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Triple XP - 6 hours",
			description: "With this upgrade you get tripled xp for 6 hours! If you already have double xp, you get 4x xp!!",
			price: 360,
			id: 6,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.tripleXp=(data.tripleXp||Date.now());
					data.tripleXp=Math.max(data.tripleXp,Date.now())+3600*+6000;
					member.roles.add("743620842495410287");
					info.save(member.id,data)
					if(data.tripleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
						member.roles.remove("743620842495410287");
					},data.tripleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Triple XP - 1 day",
			description: "With this upgrade you get tripled xp for 1 day! Level up fast today! If you already have double xp, you get 4x xp!!",
			price: 1350,
			id: 7,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.tripleXp=(data.tripleXp||Date.now());
					data.tripleXp=Math.max(data.tripleXp,Date.now())+3600*24000;
					member.roles.add("743620842495410287");
					info.save(member.id,data)
					if(data.tripleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
						member.roles.remove("743620842495410287");
					},data.tripleXp-Date.now());
				})
				return true;
			}
		},{
			name: "Triple XP - 1 week",
			description: "With this upgrade you get tripled xp for full 7 days! Boost your experience! If you already have double xp, you get 4x xp!!",
			price: 9000,
			id: 8,
			multiple: true,
			buy: function(member){
				info.load(member.id).then(data=>{
					data.tripleXp=(data.tripleXp||Date.now());
					data.tripleXp=Math.max(data.tripleXp,Date.now())+3600*7*24000;
					member.roles.add("743620842495410287");
					info.save(member.id,data)
					if(data.tripleXp-Date.now()<3600*24*1000*3) setTimeout(function(){
						member.roles.remove("743620842495410287");
					},data.tripleXp-Date.now());
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
		let boost = false;
		if(message.member.roles.cache.array().find(r=>r.id==="748584004181033030")) boost=true;
		if(!["",undefined].includes(args[1])&&items.find(cat=>cat.subcommand==args[1])!=undefined){
			let cat=items.find(cat=>cat.subcommand==args[1]);
			if(!["",undefined].includes(args[2])&&cat.items.find(item=>item.id==parseInt(args[2]))!=undefined){
				let item=cat.items.find(item=>item.id==parseInt(args[2]));
				let embed=new Discord.MessageEmbed().setColor("YELLOW").setTitle("Item: "+item.name);
				embed.setDescription(item.longDescription||item.description);
				embed.addField("Price",boost ? ("~~"+item.price+"~~ **"+(item.price*0.75|0)+"**") : item.price,true);
				embed.addField("ID",item.id,true);
				embed.setFooter("Use (buy "+item.id+") to buy this item." + (boost ? " You are a booster, you have a 25% discount!" : ""))
				message.channel.send(embed);
			} else {
				let embed=new Discord.MessageEmbed().setColor("YELLOW").setTitle("Category: "+cat.name).setDescription(cat.description).setFooter("Use (store "+cat.subcommand+" <item ID>) to see a specific item."+(boost ? " You are a booster, you have a 25% discount!" : ""));
				cat.items.forEach(item=>{
					embed.addField(item.name,"**Price:** "+(boost ? ("~~"+item.price+"~~ **"+(item.price*0.75|0)+"**") : item.price)+"\n**ID:** "+item.id,true);
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
					let price=(boost ? item.price*0.75|0 : item.price)
					data.gold-=price;
					if(item.inventory==true) data.items.push(item.id)
					info.save(message.member.id,data).then(()=>{
						item.buy(message.member);
						
					});
					achievements.progress(message.member,"SHOP1",1);
					achievements.progress(message.member,"SHOP2",2);
					message.channel.send(new Discord.MessageEmbed().setDescription("You have successfully bought **"+item.name+"** for **"+price+"** gold!").setColor("GREEN"));
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
	
	if(Date.now()-message.author.antiSpamFirst<8000){
		if(message.author.antiSpamCount>8){
			adminlog("Mute",client.user,"Muted for "+msToString(3600000),message.member,"Spam.");
			await addRecord(message.member,{
				name: "Mute for "+msToString(3600000),
				type: "mute",
				timestamp: Date.now(),
				reason: "Spam",
				mod: client.user.id
			});
			achievements.progress(message.member,"MUTE",1)
			let data=await info.load(message.member.id);
			data.mute=Date.now()+3600*1000;
			await info.save(message.member.id,data);
			if(((data.mute-Date.now())/1000)<3600*24*2) setTimeout(function(){
				message.member.roles.remove("728216095835815976");
			},data.mute-Date.now())
			message.member.roles.add("728216095835815976");
			let embed = new Discord.MessageEmbed().setDescription("<@"+message.member.id+">, you have been muted for "+msToString(3600000)+"!\n**Reason:** Spam.").setColor("YELLOW");
			let embed2 = new Discord.MessageEmbed().setDescription("<@"+message.member.id+"> has been muted for "+msToString(3600000)+"!\n**Reason:** Spam.").setColor("YELLOW");
			await message.member.send(embed);
			let msg = await message.channel.send(embed2);
			await wait(10000);
			msg.delete();
			
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
	
		//Levels
		levelUpdate(message.member);
		
	
	if(message.member.messageCombo==undefined) message.member.messageCombo=0;
	message.member.messageCombo++;
	if(message.member.messageCombo>=10){
		message.member.messageCombo=0;
		achievements.progress(message.member,"MSG1",10)
		achievements.progress(message.member,"MSG2",10)
		achievements.progress(message.member,"MSG3",10)
		await updateProfile(message.member,10);
	}
	
	message.content=message.content.split(" ").filter(t=>t!=="").join(" ");
	var args=message.content.toLowerCase().split(" ");
	var args_case=message.content.split(" ");
	//Global commands
	if(args[0]==="ows"&&message.channel.id==="729804987714109470"){
		if(args[1]==="start"){
			message.channel.ows=true;
			message.channel.owstory=[];
			message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("One word story started!"))
		} else if(args[1]==="end"){
			message.channel.ows=false;
			message.channel.owstory=(message.channel.owstory||[]);
			if(message.channel.owstory.length==1){
				message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("One word story ended! No story recorded :/"))	
			} else {
				await message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("One word story ended, story:"))
				message.channel.send(message.channel.owstory.join(" "));
			}
		}
		
		
	} else {
		if(message.channel.ows==true){
			message.channel.owstory=(message.channel.owstory||[]);
			message.channel.owstory.push(message.content);
		}
	}
	if(args[0]==="nextevent"){
		let server = await info.load("SERVER");
		if(!server.events) server.events=[];
		server.events.sort((a,b)=>a.time-b.time);
		if(server.events[0]&&server.events[0].time){
			if(server.events[0].time-Date.now()<5000){
				return message.channel.send(new Discord.MessageEmbed().setColor("AQUA").setDescription("🥳 Event **"+server.events[0].name+"** is already in progress!"));	
			}
			message.channel.send(new Discord.MessageEmbed().setColor("BLUE").setDescription("🎉 Next event starts in "+msToString(server.events[0].time-Date.now())));
		} else {
			message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("⛔ There are no planned events currently."));
		}
	} else if(args[0]=="mod"&&message.member.hasPermission("MANAGE_MESSAGES")){
		let commands=[{
			name: "warn",
			description: "Warn a member.",
			usage: "mod warn <@user> [reason]"
		},{
			name: "mute",
			description: "Mute a member.",
			usage: "mod mute <@user> <time> [reason]"
		},{
			name: "unmute",
			description: "Unmute a member.",
			usage: "mod unmute <@user> [reason]"
		},{
			name: "record",
			description: "Show a member's record.",
			usage: "record <@user>"
		},{
			name: "kick",
			description: "Kick a member.",
			usage: "mod kick <@user> [reason]"
		},{
			name: "tempban",
			description: "Temporarily ban a member.",
			usage: "mod tempban <@user> <time> [reason]"
		},{
			name: "ban",
			description: "Permanently ban a member.",
			usage: "mod tempban <@user> <time> [reason]"
		},{
			name: "unban",
			description: "Pardon a banned member.",
			usage: "mod unban <@user> [reason]"
		},{
			name: "clearchat",
			description: "Clear the chat",
			usage: "mod clearchat <message count>"
		},{
			name: "event",
			description: "Manage events (if you're a mod and you want to host an event, please get authorisation first)",
			usage: "mod event <create,delete,set,announce> (name,desc,time/id) (id)"
		}];
		if(args[1]=="help"){
			let embed=new Discord.MessageEmbed().setColor("BLUE").setTitle("Moderation commands help:")
			.addField("Command list",commands.map(t=>"`"+t.name+"` — "+t.description).join("\n"),true)
			.setTimestamp().setAuthor(message.author.tag,message.author.displayAvatarURL());
			if(args[2]&&commands.find(t=>t.name===args[2])){
				let cmd=commands.find(t=>t.name===args[2]);
				embed=new Discord.MessageEmbed().setColor("BLUE").setTitle("Command help: "+cmd.name)
				.addField("Description",cmd.description,true)
				.addField("Usage",cmd.usage,true)
				.setTimestamp().setAuthor(message.author.tag,message.author.displayAvatarURL());
			}
			message.channel.send(embed);
		} else if(message.member.roles.cache.array().find(t=>t.id=="728034436997709834"||t.id=="728034751780356096")){ //Moderator/Admin
			
			if(["event","events"].includes(args[1])){
				let server = await info.load("SERVER");
				if(!server.events) server.events=[];
				if(args[2]==="list"){
					
					let eventlist=server.events.map(ev=>`${ev.messageID ? `🌕` : '🌑' }` + " `"+ev.id+"` - "+(ev.name||"N/A")+" ("+new Date(ev.time).toLocaleDateString()+")").join("\n");
					eventlist = (eventlist||"N/A.");
					message.channel.send(new Discord.MessageEmbed().setColor("BLUE").setDescription("**Event list**\n\n"+eventlist))
					
				} else if(args[2]==="end"){
					
					let current=server.events.find(ev=>ev.time-Date.now()<5000);
					if(current){
						if(current.host===message.member.id){
							current.peopleComing.forEach(async t=>{
								let g=message.guild.member(t);
								if(!g) return;
								g.roles.remove("730056362029219911");
								await updateProfile(g,300);
								if(g.roles.cache.get("743622344211300481")){
								let data=await info.load(t);
								data.gold+=500;
								await info.save(t,data);
								}
								achievements.progress(g,"EVENT",1);
								g.send(new Discord.MessageEmbed().setDescription("Event **"+current.name+"** has ended! You have gained a bit more xp!").setColor("ORANGE"))
							})
							let m=undefined;
							try{
								m=await message.guild.channels.cache.get(eventChannelID).messages.fetch(current.messageID);
							}catch(err){}
							if(m) m.delete();
							message.channel.send(new Discord.MessageEmbed().setDescription("Event **"+current.name+"** ended!").setColor("RED"))
							server.events.splice(server.events.findIndex(v=>v.id===current.id),1);
							
						} else {
							message.channel.send(new Discord.MessageEmbed().setDescription("You are not the host of the current event :(").setColor("RED"))	
						}
					} else {
						message.channel.send(new Discord.MessageEmbed().setDescription("No event in progress.").setColor("RED"))	
					}
					
				} else if(args[2]==="create"){
					if(args[3]){
						if(server.events.find(ev=>ev.id===args[3])){
							message.channel.send(new Discord.MessageEmbed().setDescription("An event already exists with the ID **"+args[3]+"**.").setColor("RED"));	
						} else {
							server.events.push({
								id: args[3],
								createdAt: Date.now()
							})
							message.channel.send(new Discord.MessageEmbed().setDescription("Event with ID **"+args[3]+"** successfully created.").setColor("GREEN"));
						}
					} else {
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct event ID.").setColor("RED"));
					}
				} else if(["announce","update"].includes(args[2])){
					if(args[3]){
						if(!server.events.find(ev=>ev.id===args[3])){
							message.channel.send(new Discord.MessageEmbed().setDescription("No event exists with the ID **"+args[3]+"**.").setColor("RED"));	
						} else {
							let event=server.events.find(ev=>ev.id===args[3]);
							let eventInd=server.events.findIndex(ev=>ev.id===args[3]);
							let err=undefined;
							if(event.time&&Date.now()>event.time) err="Event already started.";
							if(!event.time) err="Time is missing.";
							if(!event.desc) err="Description is missing.";
							if(!event.name) err="Name is missing.";
							if(err){
								message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't announce/update the event: "+err).setColor("RED"));
							} else {
								event.peopleComing=(event.peopleComing||[]);
								eventTimer(event);
								let embed=eventEmbed(event);
								let mm=undefined;
								if(event.messageID){
									try{
										mm=await message.guild.channels.cache.get(eventChannelID).messages.fetch(event.messageID)
									}catch(err){log("Error retreiving event message")}
								}
								if(mm){
									await mm.edit("<@&728223648942653451> <@&728224459487576134>",embed);
									message.channel.send(new Discord.MessageEmbed().setDescription("Event with ID **"+args[3]+"** successfully updated!").setColor("GREEN"));
								} else {
									event.announcedAt=Date.now();
									event.host=message.member.id;
									let role = await message.guild.roles.fetch("731828010923065405");
									role.members.array().forEach(m=>{
										if(!event.peopleComing.includes(m.id)) event.peopleComing.push(m.id);
									});
									role.members.array().forEach(m=>{
										m.send(new Discord.MessageEmbed().setDescription("🥳 You have automatically joined **"+event.name+"**!").setColor("GREEN"))
									})
									embed=eventEmbed(event);
									let msg=await message.guild.channels.cache.get(eventChannelID).send("<@&728223648942653451> <@&728224459487576134>",embed);
									await msg.react("🎉");
									await msg.react("🔔");
									event.messageID=msg.id;
									message.channel.send(new Discord.MessageEmbed().setDescription("Event with ID **"+args[3]+"** successfully announced!").setColor("GREEN"));
								}
							}
							server.events[eventInd]=event;
						}
					} else {
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct event ID.").setColor("RED"));
					}
				} else if(args[2]==="delete"){
					if(args[3]){
						if(!server.events.find(ev=>ev.id===args[3])){
							message.channel.send(new Discord.MessageEmbed().setDescription("No event exists with the ID **"+args[3]+"**.").setColor("RED"));	
						} else {
							if(server.events.find(ev=>ev.id===args[3]).messageID) message.guild.channels.cache.get(eventChannelID).messages.fetch(server.events.find(ev=>ev.id===args[3]).messageID).then(async msg=>{
							msg.delete()
							}).catch(err=>{})
							server.events.splice(server.events.findIndex(ev=>ev.id===args[3]),1);
							message.channel.send(new Discord.MessageEmbed().setDescription("Event with ID **"+args[3]+"** successfully deleted.").setColor("GREEN"));
						}
					} else {
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct event ID.").setColor("RED"));
					}
				} else if(args[2]==="set"){
					if(!args[3]||!["name","desc","time"].includes(args[3])){
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify **name**, **desc**, **time**.").setColor("RED"))	
					} else if(!args[4]){
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify an event ID.").setColor("RED"))
					} else if(!server.events.find(ev=>ev.id===args[4])){
						message.channel.send(new Discord.MessageEmbed().setDescription("No event with that ID was found, please create one or check event list.").setColor("RED"))
					} else if(server.events.find(ev=>ev.id===args[4]).time<Date.now()){
						message.channel.send(new Discord.MessageEmbed().setDescription("Unable to edit event, it has already started.").setColor("RED"))	  
					} else {
						let event=server.events.find(ev=>ev.id===args[4]);
						let eventM=undefined;
						try{
							if(event.messageID) eventM=await message.guild.channels.cache.get(eventChannelID).messages.fetch(event.messageID);
						}catch(err){
							await message.channel.send(new Discord.MessageEmbed().setDescription("Event message was saved but couldn't find it, please re-announce the event.").setColor("RED"))
							event.messageID=undefined;
						}
						if(args[3]==="name"){
							let name = args_case.filter((ar,i)=>i>4).join(" ");
							if(name&&name.length>5){
								event.name=name;
								message.channel.send(new Discord.MessageEmbed().setDescription("Name of event **"+args[4]+"** was updated successfully to **"+name+"**.").setColor("GREEN"))
							} else {
								message.channel.send(new Discord.MessageEmbed().setDescription("Event name must be longer than 5 characters.").setColor("RED"))
							}
						} else if(args[3]==="desc"){
							let desc = args_case.filter((ar,i)=>i>4).join(" ");
							if(desc&&desc.length>15){
								event.desc=desc;
								message.channel.send(new Discord.MessageEmbed().setDescription("Description of event **"+args[4]+"** was updated successfully to **"+desc+"**.").setColor("GREEN"))
							} else {
								message.channel.send(new Discord.MessageEmbed().setDescription("Event description must be longer than 15 characters.").setColor("RED"))
							}
						} else if(args[3]==="time"){
							let time = args_case.filter((ar,i)=>i>4).join(" ");
							let date = new Date(time);
							if(!isNaN(date.getTime())&&date.getTime()>Date.now()){
								event.time=date.getTime();
								message.channel.send(new Discord.MessageEmbed().setDescription("Time of event **"+args[4]+"** was updated successfully to **"+date.toString()+"**.").setColor("GREEN"))
							} else {
								message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct date.\n**Example:** 13 aug 2020 15:00 or 15 january 2021 11:00 gmt+2").setColor("RED"))
							}
						}
						
						server.events[server.events.findIndex(ev=>ev.id===args[4])] = event;
						
					}
				}
				await info.save("SERVER",server);
				
			} else if(["record","records","rec"].includes(args[1])){
				let m=(message.mentions.members.first()||message.guild.member(args[2]));
				if(dataStorage.find(i=>i.id==args[2])) m={id: args[2], user:{bot: false}};
				if(m&&!m.user.bot){
					adminlog("Records Check",message.member,"Checked records.",m);
					let data = await info.load(m.id);
					if(data.records==undefined) data.records=[];
					let filter=args[3];
					let records=data.records;
					if(["warns","mutes","bans"].includes(filter)) records=data.records.filter(t=>(t.type+"s")===filter);
					let embed=new Discord.MessageEmbed().setDescription("<@"+m.id+">'s record:").setColor("ORANGE")
					.addField("Records",(records.map(r=>"`"+new Date(r.timestamp).toLocaleString()+"`     <@!"+r.mod+">      "+r.name+" - "+(r.reason||"Reason Unspecified")).join("\n")||"N/A"),true);
					if(["warns","mutes","bans"].includes(filter)) embed=embed.setDescription("<@"+m.id+">'s "+filter+":")
					message.channel.send(embed);
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			} else if(args[1]=="clearchat"){
				if(parseInt(args[2])){
					try{
						await message.channel.bulkDelete(parseInt(args[2]));
						let msg = await message.channel.send(new Discord.MessageEmbed().setDescription("**"+parseInt(args[2])+"** messages deleted!").setColor("GREEN"));
						await wait(6000);
						await msg.delete()
					}catch(err){
						message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't delete messages! Please try again.").setColor("RED"));
					}
				}
			} else if(args[1]=="warn"){
				let m=(message.mentions.members.first()||message.guild.member(args[2]));
				if(m&&!m.user.bot&&!m.roles.cache.array().find(t=>t.id=="728034436997709834"||t.id=="728034751780356096")){
					let reason=undefined;
					if(args[3]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
					adminlog("Warn",message.member,"Warned.",m,reason);
					await addRecord(m,{
						name: "Warn",
						type: "warn",
						timestamp: Date.now(),
						reason: reason,
						mod: message.member.id
					});
					await message.react('⚠️');
					let embed = new Discord.MessageEmbed().setDescription("<@"+m.id+">, you have been warned by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
					let msg=await message.channel.send(embed);
					await m.send(embed);
					await wait(10000);
					msg.delete();
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			} else if(args[1]=="kick"){
				let m=(message.mentions.members.first()||message.guild.member(args[2]));
				if(m&&!m.user.bot&&m.kickable){
					let reason=undefined;
					if(args[3]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
					adminlog("Kick",message.member,"Kicked.",m,reason);
					await addRecord(m,{
						name: "Kick",
						type: "ban",
						timestamp: Date.now(),
						reason: reason,
						mod: message.member.id
					});
					await message.react('🚪');
					let embed = new Discord.MessageEmbed().setDescription("<@"+m.id+">, you have been kicked by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
					await m.send(embed);
					let embed2 = new Discord.MessageEmbed().setDescription("<@"+m.id+"> was been kicked by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
					let msg = await message.channel.send(embed2);
					await m.kick();
					await wait(10000);
					msg.delete()
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			} else if(args[1]=="ban"){
				let m=(message.mentions.members.first()||message.guild.member(args[2])||args[2]);
				if(typeof m=="string"){
					try{ 
						let reason=undefined;
						if(args[3]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
						await message.guild.members.ban(m);
						await message.react('⛔');
						adminlog("Perma Ban",message.member,"Banned.",{id: m},reason);
						await addRecord({id: m},{
							name: "Perma-ban",
							type: "ban",
							timestamp: Date.now(),
							reason: reason,
							mod: message.member.id
						});
						let embed2 = new Discord.MessageEmbed().setDescription("User ID: **"+m+"** was been perma-banned by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						let msg = await message.channel.send(embed2);
						await wait(10000);
						msg.delete()
						
					}catch(err){
						message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't ban that user, please verify his ID.").setColor("RED"))	   
						
					}
					
				} else if(m&&!m.user.bot&&m.bannable){
					let reason=undefined;
					if(args[3]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
					adminlog("Perma Ban",message.member,"Banned.",m,reason);
					await addRecord(m,{
						name: "Perma-ban",
						type: "ban",
						timestamp: Date.now(),
						reason: reason,
						mod: message.member.id
					});
					await message.react('⛔');
					let embed = new Discord.MessageEmbed().setDescription("<@"+m.id+">, you have been perma-banned by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
					let embed2 = new Discord.MessageEmbed().setDescription("<@"+m.id+"> was been perma-banned by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
					await m.send(embed);
					let msg = await message.channel.send(embed2);
					await m.ban();
					await wait(10000);
					msg.delete();
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			} else if(args[1]=="unban"){
				let m=args[2];
				if(!m){
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a user ID.").setColor("RED"))	   
				}else try{
					await message.guild.members.unban(m);
					let reason=undefined;
					if(args[3]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
					adminlog("Ban Revoke",message.member,"Pardoned.",{id: m},reason);
					await addRecord({id: m},{
						name: "Pardon",
						type: "ban",
						timestamp: Date.now(),
						reason: reason,
						mod: message.member.id
					});
					let data=await info.load(m);
					data.tempban=0;
					await info.save(m,data);
					message.react("👼");
					let embed2 = new Discord.MessageEmbed().setDescription("User ID: **"+m+"** has been unbanned by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
					let msg=await message.channel.send(embed2);
					await wait(10000);
					msg.delete()
					
				}catch(err){
					message.channel.send(new Discord.MessageEmbed().setDescription("The ID you specified isn't banned or doesn't exist, please try again.").setColor("RED"))
				}
			} else if(args[1]=="tempban"){
				let m=(message.mentions.members.first()||message.guild.member(args[2])||args[2]);
				if(typeof m=="string"){
					try{ 
						let seconds=timeformatToSeconds(args[3]);
						let tstr=msToString(seconds*1000);
						let reason=undefined;
						if(args[4]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" "+args_case[3]+" ","");
						await message.guild.members.ban(m);
						await message.react('⛔');
						adminlog("Temp Ban",message.member,"Banned for "+tstr+".",{id: m},reason);
						await addRecord({id: m},{
							name: "Temp-ban for "+tstr,
							type: "ban",
							timestamp: Date.now(),
							reason: reason,
							mod: message.member.id
						});
						let data=await info.load(m);
						data.tempban=Date.now()+seconds*1000;
						await info.save(m,data);
						if(((data.tempban-Date.now())/1000)<3600*24*2) setTimeout(function(){
							message.guild.members.unban(m);
						},data.tempban-Date.now())
						let embed2 = new Discord.MessageEmbed().setDescription("User ID: **"+m+"** has been banned temporarily for "+tstr+" by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						let msg=await message.channel.send(embed2);
						await wait(10000);
						msg.delete()
						
					}catch(err){
						message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't ban that user, please verify his ID and/or the specified time.").setColor("RED"))	   
						
					}
					
				} else if(m&&!m.user.bot&&m.bannable){
					try{
						let seconds=timeformatToSeconds(args[3]);
						let tstr=msToString(seconds*1000);
						let reason=undefined;
						if(args[4]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" "+args_case[3]+" ","");
						adminlog("Temp Ban",message.member,"Banned for "+tstr+".",m,reason);
						await addRecord(m,{
							name: "Temp-ban for "+tstr,
							type: "ban",
							timestamp: Date.now(),
							reason: reason,
							mod: message.member.id
						});
						let data=await info.load(m.id);
						data.tempban=Date.now()+seconds*1000;
						await info.save(m.id,data);
						if(((data.tempban-Date.now())/1000)<3600*24*2) setTimeout(function(){
							message.guild.members.unban(m.id);
						},data.tempban-Date.now())
						await message.react('⛔');
						let embed = new Discord.MessageEmbed().setDescription("<@"+m.id+">, you have been banned temporarily for "+tstr+" by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						let embed2 = new Discord.MessageEmbed().setDescription("<@"+m.id+"> has been banned temporarily for "+tstr+" by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						await m.send(embed);
						let msg = await message.channel.send(embed2);
						await m.ban();
						await wait(10000);
						msg.delete()
					}catch(err){
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct time").setColor("RED"));
					}
						
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			} else if(args[1]=="mute"){
				let m=(message.mentions.members.first()||message.guild.member(args[2]));
				if(m&&!m.user.bot&&!m.roles.cache.array().find(t=>t.id=="728034436997709834"||t.id=="728034751780356096")){
					try{
						let seconds=timeformatToSeconds(args[3]);
						let tstr=msToString(seconds*1000);
						let reason=undefined;
						if(args[4]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" "+args_case[3]+" ","");
						adminlog("Mute",message.member,"Muted for "+tstr+".",m,reason);
						await addRecord(m,{
							name: "Mute for "+tstr,
							type: "mute",
							timestamp: Date.now(),
							reason: reason,
							mod: message.member.id
						});
						achievements.progress(m,"MUTE",1)
						let data=await info.load(m.id);
						data.mute=Date.now()+seconds*1000;
						await info.save(m.id,data);
						if(((data.mute-Date.now())/1000)<3600*24*2) setTimeout(function(){
							m.roles.remove("728216095835815976");
						},data.mute-Date.now())
						await message.react('⛓️');
						m.roles.add("728216095835815976");
						let embed = new Discord.MessageEmbed().setDescription("<@"+m.id+">, you have been muted for "+tstr+" by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						let embed2 = new Discord.MessageEmbed().setDescription("<@"+m.id+"> has been muted for "+tstr+" by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						await m.send(embed);
						let msg = await message.channel.send(embed2);
						await wait(10000);
						msg.delete()
					}catch(err){
						message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct time").setColor("RED"));
					}
						
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			} else if(args[1]=="unmute"){
				let m=(message.mentions.members.first()||message.guild.member(args[2]));
				if(m&&!m.user.bot&&!m.roles.cache.array().find(t=>t.id=="728034436997709834"||t.id=="728034751780356096")){
					if(m.roles.cache.array().find(t=>t.id=="728216095835815976")){
						let reason=undefined;
						if(args[3]) reason=args_case.join(" ").replace(args_case[0]+" "+args_case[1]+" "+args_case[2]+" ","");
						adminlog("Unmute",message.member,"Unmute.",m,reason);
						await addRecord(m,{
							name: "Unmute",
							type: "mute",
							timestamp: Date.now(),
							reason: reason,
							mod: message.member.id
						});
						let data=await info.load(m.id);
						data.mute=0;
						await info.save(m.id,data);
						await message.react('✅');
						m.roles.remove("728216095835815976");
						let embed = new Discord.MessageEmbed().setDescription("<@"+m.id+">, you have been unmuted by <@"+message.member.id+">!\n**Reason:** "+(reason||"Unspecified")).setColor("YELLOW");
						let msg=await message.channel.send(embed);
						await m.send(embed);
						await wait(10000);
						msg.delete();
					} else {
						message.channel.send(new Discord.MessageEmbed().setDescription("This member is not muted.").setColor("RED"));
					}
					
				} else {
					message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct member.").setColor("RED"));	
				}
			}
			
		}
		
	}
	
	//Commands
	if(message.channel.id!="728025726556569631") return;
	if(["dailyreward","daily","dr","reward"].includes(args[0])){
	
		info.load(message.member.id).then(data=>{
			if(data.dailyReward==undefined||(Date.now()-data.dailyReward>3600*24*1000)){
				if(data.dailyReward==undefined) data.dailyReward=0; 
				let gold=50;
				let embed=new Discord.MessageEmbed().setColor("GREEN").setDescription("💸 You have claimed your **50** gold daily reward!");
				if(Date.now()-data.dailyReward-3600*24*1000<60*1000){
					gold+=600;
					embed.setDescription(embed.description+"\n⌛ You have claimed your reward incredibly early! You received an additional **600** gold!");
				}else if(Date.now()-data.dailyReward-3600*24*1000<10*60*1000){
					gold+=300;
					embed.setDescription(embed.description+"\n⌛ You have claimed your reward very early! You received an additional **300** gold!");
				} else if(Date.now()-data.dailyReward-3600*24*1000<3600*1000){
					gold+=150;
					embed.setDescription(embed.description+"\n⌛ You have claimed your reward early! You received an additional **150** gold!");
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
							if(data.pname===message.author.username){
								message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Dude that's literally your name, come on, come up with something more creative!"));
							}
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
		
		const roles=["729438971456651394","729438974854168636","729438972161556610","746749391297314977","729437918078435358","729421506328657950","729437914542505985","729437921802846239","729421500137865261","746749508154556457","746748743025426445","729421492835844207","729421510804242492","746748376170627125","729421484560482379","746748271602565120","746748856468766741","746749037532676126","729421488431562752","729421479846084648","729421473810219079","746749181032398859","729421468752150689","729421463614128238","729395073904672860","729392489617948783"]
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
							achievements.progress(message.member,"COLOR",1)
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
		log(new Discord.MessageEmbed().setColor("ORANGE").setDescription("Reloading database.."))
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
				log(new Discord.MessageEmbed().setColor("GREEN").setDescription("Database Reloaded!"))
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
		let embed=new Discord.MessageEmbed().setColor("AQUA").addField("Leaderboard",dataStorage.map((it,i)=>{if(i<10) return (["🥇","🥈","🥉","**4**","**5**","**6**","**7**","**8**","**9**","**10**"])[i] + " — <@!"+it.id+"> " + numberBeautifier(it.messagesEverSent,",")+" pts. (Level "+it.level+")\n"}).join(""),true);
		message.channel.send(embed)
	} else if(args[0]==="job"||args[0]==="jobs"||args[0]==="work"||args[0]==="j"){
		let jobs=[{
			name: "Teacher",
			salary: 70,
			hours: 6,
			days: ["Mon","Tue","Wed","Thu","Fri"],
			works: ["You have teached a good lesson",
				"Your students had a surprise test",
				"You did some boring exercises with your students",
			        "Your students did not enjoy the lesson, but it's okay",
			        "You had a meeting today, and it was pretty good",
			        "Two of your students did a cool presentation",
			        "You did a cool activity for your students"]
		},{
			name: "Policeman",
			salary: 80,
			hours: 5,
			days: ["Mon","Tue","Wed","Thu","Sat"],
			works: ["You arrested a robber",
			        "You prevented 3 murders",
			        "You saved a pregnant woman's life",
			        "You almost got killed by a mafia but fortunately they got arrested",
			        "There wasn't really any crimes this time, you just ate some donuts in your car",
			        "You caught some drug dealers in the act",
			        "Someone was breaking into a store, but you were there luckily"]
		},{
			name: "Youtuber",
			salary: 120,
			hours: 2,
			days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
			works: ["You recorded a vlog",
			        "You did a little livestream, your fans enjoyed it",
			        "You did a prank on your girlfriend",
				"You recorded a funny video",
			        "You recorded a music video",
			        "You made a cool edit",
			        "You featured another youtuber"]
		},{
			name: "Drug Dealer",
			salary: 280,
			hours: 2,
			days: ["Sat","Sun"],
			works: ["You delt some cocaine",
			        "You got a lot of customers this time",
			        "You made good sales",
			        "You delt just a little this time, but it was enough",
			        "You had a cool customer"]
		},{
			name: "Pilot",
			salary: 350,
			hours: 3,
			days: ["Mon"],
			works: ["You flew from LA to Paris",
			        "You had a late night flight, so tiring",
			        "You just had fun in this flight",
			        "You almost slept in the cockpit",
			        "You flew from Moscow to Berlin",
			        "You flew from Madrid to Marrakesh",
			        "You flew from Marseille to Lisbonne",
			        "You flew from Islamabad to Ankara"]
		}];
		if(args[1]=="list"||!args[1]){
			let data=await info.load(message.member.id);
			if(data.fired==undefined) data.fired=[];
			let embed=new Discord.MessageEmbed().setColor("GREEN").setDescription("**Available jobs for <@!"+message.member.id+">:**");
			if(data.job!=undefined){
				embed=new Discord.MessageEmbed().setColor("AQUA").setDescription("You're working as **"+jobs[data.job].name+"**. If you wish to leave your job, use `job leave`");
			} else if(data.fired.length===jobs.length){
				embed=new Discord.MessageEmbed().setColor("RED").setDescription("You've been fired from all jobs! :( Please wait some time before you can get a job again!");
			}
			jobs.forEach((job,i)=>{
				embed.addField(job.name + (data.fired.includes(i)?" (Fired)":""),"**Salary**: "+job.salary+" gold per hour\n**Time**: "+job.hours+" hours per day\n**Days**: "+job.days.join(", "),true);
			})
			message.channel.send(embed);
		} else if(args[1]==="work"){
			let data=await info.load(message.member.id);
			if(data.job==undefined){
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You do not have a job yet, please use `job list` to see available jobs for you and `job apply` to apply for a job!"));
			} else {
				let days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat",];
				if(!data.lastWorked) data.lastWorked=0;
				if(!data.workedToday) data.workedToday=0;
				if(data.lastDayWorked!=new Date().toLocaleDateString()){
					data.workedToday=0;
					data.lastDayWorked=new Date().toLocaleDateString();
				}
				if(!jobs[data.job].days.includes(days[new Date().getDay()])){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("🌥️ This is a day off, please come back on "+jobs[data.job].days.join(", ")+"."));
				}else if(data.workedToday>=jobs[data.job].hours){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You worked enough today, please come back another day."));
				} else if(Date.now()-data.lastWorked<3600*1000){
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You already worked this hour, please come back in "+msToString(data.lastWorked+3600*1000-Date.now())+"."));
				} else {
					data.gold+=jobs[data.job].salary;
					achievements.progress(message.member,"JOB1",jobs[data.job].salary);
					achievements.progress(message.member,"JOB2",jobs[data.job].salary);
					data.lastWorked=Date.now();
					data.workedToday+=1;
					data.lastDayWorked=new Date().toLocaleDateString();
					let work=jobs[data.job].works[Math.random()*jobs[data.job].works.length|0]
					message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("💼 **"+work+"**! You received **"+jobs[data.job].salary+"** gold!"));
				}
			}
			await info.save(message.member.id,data)
		} else if(args[1]==="leave"){
			let data=await info.load(message.member.id);
			if(data.job){
				message.channel.send(new Discord.MessageEmbed().setColor("AQUA").setDescription("👋 You just left your job: **"+jobs[data.job].name+"**. Your colleagues will miss you!"));
				data.job=undefined;
				data.leftJob=Date.now();
			} else {
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You don't have a job."));
			}
			await info.save(message.member.id,data)
		} else if(args[1]==="apply"){
			let data=await info.load(message.member.id);
			if(!data.job){
				if(args[2]){
					let job=jobs.find(j=>j.name.toLowerCase().split(" ").join("")===args.join("").replace(args[0]+args[1],""));
					let jobID=jobs.findIndex(j=>j.name.toLowerCase().split(" ").join("")===args.join("").replace(args[0]+args[1],""));
					if(data.leftJob&&Date.now()-data.leftJob<3600*24*1000){
						message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You just left a job, please wait "+msToString(data.leftJob+3600*24*1000-Date.now())+" to apply for another job."));
					} else if(job){
						message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("👨‍✈️ You got the job! Congrats, you are now **"+job.name+"**!"));
						data.job=jobID;
					} else {
						message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Couldn't find that job, please check the spelling."));
					}
				} else {
					message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a job."));	
				}
			} else {
				message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You already have a job."));
			}
			await info.save(message.member.id,data)
		}
	} else if(args[0]=="gamble"){
		let boost = !!message.member.roles.cache.array().find(r=>r.id==="748584004181033030");
		let data = await info.load(message.member.id);
		args=args.join(" ").replace("all",data.gold).replace("half",data.gold/2|0).replace("quarter",data.gold/4|0).replace("third",data.gold/3|0).split(" ");
		if(!parseInt(args[1])||["",undefined].includes(args[1])||parseInt(args[1])==0){
			message.channel.send(new Discord.MessageEmbed().setDescription("Please specify a correct amount.").setColor("RED"));
		} else {
			let amount = parseInt(args[1].split("-").join(""))|0;
			if(data.gamblesToday==undefined) data.gamblesToday=0;
			let limit = (boost ? 10 : 5);
			if(data.gamblesToday==limit){
				message.channel.send(new Discord.MessageEmbed().setDescription("You have already gambled "+limit+" times today, come back later!").setColor("RED"));
			} else if(amount>data.gold){
				message.channel.send(new Discord.MessageEmbed().setDescription("You do not have enough gold.").setColor("RED"));	
			} else if(amount<100){
				message.channel.send(new Discord.MessageEmbed().setDescription("You should gamble at least **100** gold.").setColor("RED"));
			} else {
				let f=Math.random()*Math.random();
				let gambled = f*2*amount|0;
				gambled += amount*((Math.random()*2)|0);
				gambled -= amount;
				data.gamblesToday+=1;
				let embed = new Discord.MessageEmbed().setDescription("Gambling **"+amount+"** ...");
				let msg=await message.channel.send(embed)
				achievements.progress(message.member,"GAMBLE1",1);
				achievements.progress(message.member,"GAMBLE2",1);
				achievements.progress(message.member,"GAMBLE3",1);
				await wait(3000);
				data = await info.load(message.member.id);
				if(gambled<0){
					embed = new Discord.MessageEmbed().setDescription("**🌑 Oh no, bad luck!** <@!"+message.author.id+">, You just lost **"+ Math.abs(gambled)+"** gold :(.").setColor("RED");	
				}else if(gambled<amount){
					embed = new Discord.MessageEmbed().setDescription("**☄️ Lucky!** <@!"+message.author.id+">, You gained **"+ gambled+"** gold.").setColor("AQUA");		
				}else{
					embed = new Discord.MessageEmbed().setDescription("**🍀 Four-leaf clover!** <@!"+message.author.id+">, You gained **"+ gambled+"** gold.").setColor("GREEN");		
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
	}else if(["stats","statistics","info","botinfo"].includes(args[0])){
		 
		let embed= new Discord.MessageEmbed().setColor("BLUE")
		.setAuthor("Aouabot",client.user.displayAvatarURL())
		.setDescription("💎 Hello! I'm Aouabot, a private bot made by <@!123413327094218753>, i am still in developement, but if you want to suggest any ideas, please do so!\nHere are some useful info:")
		.addField("Members",message.guild.memberCount,true)
		.addField("Channels",message.guild.channels.cache.size,true)
		.addField("Roles",message.guild.roles.cache.size,true)
		.addField("Bots",message.guild.members.cache.filter(t=>t.user.bot).size,true)
		.addField("Library","Discord.js",true)
		.addField("Developer","<@!123413327094218753>",true)
		.addField("Made at",client.user.createdAt.toLocaleString(),true)
		.addField("Region",message.guild.region,true)
		.addField("Memory Usage",(process.memoryUsage().heapUsed / 1024 / 1024|0) + " MB",true);
		message.channel.send(embed);
		
	}else if(["achievements","achieve","ac"].includes(args[0])){
		
		let user=(message.mentions.members.array()[0]||message.member);
		if(user.bot) user=message.member;
		let acs=await achievements.getDone(user);
		let acs_=await achievements.getActive(user);
		let acst=acs.map(a=>"<:yes:733721073731764417> **"+a.name+"** "+a.description).join("\n")+"\n"+acs_.map(a=>"🕑 **"+a.name+"** "+a.description).join("\n");
		message.channel.send(new Discord.MessageEmbed().setColor("BLUE").setDescription(user.toString()+"'s achievements: \n\n"+(acst=="\n" ? "`No achievements yet`" : acst)))
		
	}else if(args[0]=="help"){
	
		const commands = [{
			name: "Info & Customization",
			description: "All you need to know!",
			commands:[{
				name: "ping",
				description: "Shows the bot's latency.",
				usage: "ping",
				aliases: "latency"
			},{
				name: "stats",
				description: "Info and stats about the bot.",
				usage: "stats" ,
				aliases: "info, statistics, botinfo"
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
				usage: "level [@user]",
				aliases: "l, xp, exp, experience, progress"
			},{
				name: "color",
				description: "Name color commands.",
				longDescription: "This commands is used to change your name color, or to see your/someone's color.",
				subcommands: "set, list",
				usage: "color <set/list> (color name)"
			},{
				name: "leaderboard",
				description: "Displays top 10 server members.",
				usage: "leaderboard",
				aliases: "board, list"
			},{
				name: "achievements",
				description: "Shows you or someone's achievements.",
				usage: "achievements [@user]",
				aliases: "ac, achieve"
			}]
		},{
			name: "Economy",
			description: "Use your gold and gain rewards!",
			commands:[{
				name: "dailyreward",
				description: "Claim your daily reward.",
				longDescription: "Claim a daily **40** gold reward, if you get lucky and claim it soon enough, you may get more gold!",
				usage: "dailyreward",
				aliases: "dr, daily, reward"
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
			},{
				name: "job",
				description: "Get a job, work, get paid!",
				longDescription: "Use this command to get a job, work every hour on the work days, and get paid!",
				subcommands: "list, apply, work, leave",
				usage: "job <list/apply/work/leave> (job)",
				aliases: "jobs, work, j"
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
				usage: "randommeme",
				aliases: "meme, rmeme"
			},{
				name: "tronald",
				description: "Dumbest quotes Donald Trump has ever said!",
				usage: "tronald",
				aliases: "donald, trump, donaldtrump"
			}]
		},{
			name: "Knowledge",
			description: "Big brain stuff!",
			commands:[{
				name: "word",
				description: "Get the definition, rhymes and other useful info about English words!",
				usage: "word <meaning/rhyme/syllables/synonyms/antonyms> <word>",
				subcommands: "meaning, rhyme, syllables, synonyms, antonyms",
				aliases: "words, dictionnary, w"
			},{
				name: "randomfact",
				description: "Random useless fact :)",
				usage: "randomfact",
				aliases: "rfact"
			},{
				name: "numberfact",
				description: "Random fact about numbers!",
				longDescription: "Random fact about numbers! you can specify a number to get a fact about it",
				usage: "numberfact [number]",
				aliases: "numfact, nfact"
			}]
		}
		]
		let cmd=undefined;
		commands.forEach(cat=>{
			cmd=(cat.commands.find(t=>(t.name==args[1]))||cmd);
		})
		if(!cmd) commands.forEach(cat=>{
			cmd=(cat.commands.find(t=>{if(t.aliases) return (t.aliases.includes(" "+args[1])||t.aliases.includes(args[1]+","));})||cmd);
		});
		if(["",undefined].includes(args[1])){
			var embeds=[new Discord.MessageEmbed().setColor("AQUA").setTitle("Command list").setDescription("Use `help <command>` for specific command help")];
			commands.forEach((cat,i)=>{
				if(embeds[i/2|0]==undefined) embeds.push(new Discord.MessageEmbed().setColor("AQUA"));
				embeds[i/2|0].addField("__"+cat.name+"__","*"+cat.description+"*\n"+cat.commands.map((item,id)=>{return "`"+item.name+"` - "+item.description;}).join("\n"),true);
			})
			embeds.forEach(em=>{
				message.channel.send(em);
			})
		} else if(cmd!=undefined){
			var embed= new Discord.MessageEmbed().setColor("fafafa").setTitle("Command help: " + args[1]);
			embed.addField("Description",cmd.longDescription||cmd.description);
			embed.addField("Sub-commands",cmd.subcommands||"None.",true);
			embed.addField("Usage","*"+cmd.usage+"*",true)
			embed.addField("Aliases",cmd.aliases||"No aliases.")
			message.channel.send(embed);
			
		} else {
			message.channel.send(new Discord.MessageEmbed().setDescription("This command doesn't exist :(").setColor("RED"));
		}
		
	}
	
});

//VC
client.on("voiceStateUpdate",async (o,n)=>{

	const vcs=["728008557911605341", "728027365820727407","728027460515659838","728027677344268337","728027756906020865","728027832747556892","728027908127457370"];
	const mvcs=["728030297911853176","728029167286878240"];
	if(n.member.user.bot) return;
	if(n.channel==o.channel) return;
	if(o.channel!=null){
		log(new Discord.MessageEmbed().setAuthor(o.member.user.tag,o.member.user.displayAvatarURL()).setColor("RED").setDescription("Voice channel leave").addField("Member","<@!"+o.member.id+">",true).addField("Left voice channel",o.channel.name,true).setFooter("Channel ID: "+o.channel.id).setTimestamp());
		if(vcs.includes(o.channel.id)){
			await n.member.guild.channels.cache.get("729354613064728636").send(new Discord.MessageEmbed().setDescription("<@!"+o.member.id+"> left **" + o.channel.name + "**").setColor("RED"));
			await n.member.roles.remove(["729502041122013195","729502308634853456"]);
		} else if(mvcs.includes(o.channel.id)){
			if(o.channel.members.array().find(i=>i.id=="730404483519086605")&&o.channel.members.size==1) pitch.player.stop(o.channel.guild.id).then(()=>{
			pitch.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: "",
							type: "PLAYING",
							url: null
						}});
			}).catch();
			if(o.channel.members.array().find(i=>i.id=="730406806316384309")&&o.channel.members.size==1) treble.player.stop(o.channel.guild.id).then(()=>{
			treble.user.setPresence({
						status: "online",
						afk: false,
						activity: {
							name: "",
							type: "PLAYING",
							url: null
						}});
			}).catch();
			await n.member.guild.channels.cache.get("728029565607346227").send(new Discord.MessageEmbed().setDescription("<@!"+o.member.id+"> left **" + o.channel.name + "**").setColor("RED"));
			await n.member.roles.remove(["729502041122013195","729502308634853456"]);
		}
		clearInterval(n.member.timer);
	}
	if(n.channel!=null){
		log(new Discord.MessageEmbed().setAuthor(o.member.user.tag,o.member.user.displayAvatarURL()).setColor("GREEN").setDescription("Voice channel join").addField("Member","<@!"+o.member.id+">",true).addField("Joined voice channel",n.channel.name,true).setFooter("Channel ID: "+n.channel.id).setTimestamp());
		if(vcs.includes(n.channel.id)){
			await n.member.roles.remove(["729502041122013195","729502308634853456"])
			await n.member.roles.add("729502041122013195");
			await n.member.guild.channels.cache.get("729354613064728636").send(new Discord.MessageEmbed().setDescription("<@!"+n.member.id+"> joined **" + n.channel.name + "**").setColor("GREEN"));
		} else if(mvcs.includes(n.channel.id)){
			await n.member.roles.remove(["729502041122013195","729502308634853456"])
			await n.member.roles.add("729502308634853456");
			await n.member.guild.channels.cache.get("728029565607346227").send(new Discord.MessageEmbed().setDescription("<@!"+n.member.id+"> joined **" + n.channel.name + "**").setColor("GREEN"));
		}
		clearInterval(n.member.timer);
		n.member.timer = setInterval(function(){
		if((n.member.guild.members.cache.get(n.member.id).voice.channel==null)||(n.member.guild.members.cache.get(n.member.id).voice.channel.id=="728037836774703235")) clearInterval(n.member.timer); 
		info.load(n.member.id).then(async data=>{
			updateProfile(n.member,Math.random()*10|0);
			await achievements.progress(n.member,"VC1",1);
			await achievements.progress(n.member,"VC2",1);
			await achievements.progress(n.member,"VC3",1);
			await achievements.progress(n.member,"VC4",1);
		});
		},60000)
	} 
	
});
client.on('messageUpdate',(om,nm)=>{
	if(nm.author.bot) return;
	if(nm.content===om.content) return;
	log(new Discord.MessageEmbed().setAuthor(nm.author.tag,nm.author.displayAvatarURL()).setColor("BLUE").setDescription("Message Edit").addField("Member","<@!"+nm.member.id+">",true).addField("Channel","<#"+nm.channel.id+">",true).addField("Old content",(om.content||"Empty message.")).addField("New content",(nm.content||"Empty message.")).setFooter("Message ID: "+nm.id).setTimestamp());
})
client.on('messageDelete',(dm)=>{
	if(dm.author.bot) return;
	let embed=new Discord.MessageEmbed().setAuthor(dm.author.tag,dm.author.displayAvatarURL()).setColor("ORANGE").setDescription("Message Deleted").addField("Member","<@!"+dm.member.id+">",true).addField("Channel","<#"+dm.channel.id+">",true).addField("Content",(dm.cleanContent||"Empty message.")).setFooter("Message ID: "+dm.id).setTimestamp();
	if(dm.attachments.array()[0]) embed=embed.setImage(dm.attachments.array()[0].url);
	log(embed);
})

///Welcoming
client.on('guildMemberAdd',async member=>{

	let data=await info.load(member.id);
	var startRoles=["728018741174075412","728212856046223480","728035160448041021","728018742965174382","728031955685343312","728214239784861776","728032333671825479","729438972161556610"];
	if((data.mute)&&(data.mute>Date.now())) startRoles.push("728216095835815976");
	log(new Discord.MessageEmbed().setAuthor(member.user.tag,member.user.displayAvatarURL()).setColor("BLUE").setDescription("New member").addField("Member","<@!"+member.id+">").setFooter("Member ID: "+member.id).setTimestamp());
	var welcome_channel=member.guild.channels.cache.get("728008557911605340");
	welcome_channel.send(new Discord.MessageEmbed().addField("Hey hey hey!","We've been waiting for you!").setTitle("Welcome " + member.displayName + "!").setThumbnail(member.user.displayAvatarURL()));
	member.roles.add(startRoles);
	member.send(new Discord.MessageEmbed().setTitle("Welcome " + member.displayName + " to " + member.guild.name + "!").setDescription("Make sure to read rules! Then you can customize your profile by choosing a color in #commands and picking some roles in #role-self-assign, have fun <3!").setColor("fafafa"));
	
});

client.on('guildMemberRemove',member=>{
	log(new Discord.MessageEmbed().setAuthor(member.user.tag,member.user.displayAvatarURL()).setColor("ORANGE").setDescription("Member left").addField("Member",member.user.tag).setFooter("Member ID: "+member.id).setTimestamp());
});


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
treble.player = new Player(treble, process.env.YOUTUBEKEY, options);
pitch.player = new Player(pitch, process.env.YOUTUBEKEY, options);

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
					achievements.progress(client.guilds.cache.array()[0].member(message.member.id),"MUSIC",1)
					message.channel.stopTyping();
				}).catch(err=>{
					message.channel.send(new Discord.MessageEmbed().setDescription("Couldn't find the song, maybe try with more details?").setColor("RED"))
					message.channel.stopTyping();
				});
			} else {
				chosenclient.player.play(message.member.voice.channel,message.content.replace(args_case[0],""),"<@!"+message.member.id+">").then(song=>{
				message.channel.send(new Discord.MessageEmbed().setColor("ORANGE").setDescription("**Now playing: **" +song.song.name + " (Requested by " + song.song.requestedBy+")"))
				achievements.progress(client.guilds.cache.array()[0].member(message.member.id),"MUSIC",1)
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
process.on("unhandledRejection", error => {
	log(new Discord.MessageEmbed().setColor("RED").setDescription("**Unhandled Promise Rejection:**\n```js\n"+error.stack+"\n```").setTimestamp());
});

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


