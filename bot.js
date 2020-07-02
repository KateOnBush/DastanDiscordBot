const Discord = require('discord.js');
let snekfetch = require("snekfetch");
const client = new Discord.Client();
let request = require('request');

//lol
	// file system module to perform file operations
	const fs = require('fs');

//lol

function uno_random_card_arena(){
	var v=uno_random_card();
	if(!isNaN(parseInt(v.name))){
		return v;	
	}
	return uno_random_card_arena();
}
function color_code_from_text(c){
	if(c==undefined) return;
	if(c=="yellow") return "#d9d202";
	if(c=="green") return "#07c400";
	if(c=="red") return "#d90602";
	if(c=="blue") return "#02aad9";
	return "#ffffff";
}
function uno_random_card(){
	var cards=["1","2","3","4","5","6","7","8","9","0","reverse","draw2","skip","wild","wilddraw4"];
	var colors=["red","blue","green","yellow"];
	var c1=cards[Math.floor(Math.random()*cards.length)];
	var c2=colors[Math.floor(Math.random()*colors.length)];
	return {
		name: c1,
		color: c2
	};
}
function uno_card_to_text(card){
	if (card==undefined) return;
	if (card.name==undefined) return;
	if (card.color==undefined) return;
	var g = client.guilds.array()[0];
	if (["wild","wilddraw4"].includes(card.name)){
		return g.emojis.find("name",card.name).toString();	
	}
	if (["reverse","skip","draw2"].includes(card.name)){
		return g.emojis.find("name",card.name+card.color).toString();	
	}
	return g.emojis.find("name",card.color+"card").toString() + card.name;
}
function uno_cards_playable(cards,cia){
	if (cards==undefined) return;
	if (cia==undefined) return;
	var ret=[];
	cards.forEach(c=>{
		if(["wild","wilddraw4"].includes(c.name)){
			ret.push(c);	
		}else if(cia.name==c.name){
			ret.push(c);	
		}else if(cia.color==c.color){
			ret.push(c);
		}
	});
	return ret;
}
var uno_game = {
	status: 0,
	mode: "solo",
	players: [],
	current_turn: 0,
	direction: 1,
	card_in_arena: {},
	c: "#ffffff",
	start: function(){
		this.status = 1;
		this.current_turn=0;
		this.card_in_arena= uno_random_card_arena();
		for(var i=0;i<this.players.length;i++){
			var g = client.guilds.array()[0];
			g.members.find("id",this.players[i].id).addRole(g.roles.find("name","Uno - Solo - Player " + (i + 1)));	
			var c = g.channels.find("name","solo-player-"+(i+1));
			c.send("<@"+this.players[i].id+"> The game has started!");
			for(var o=0;o<6;o++){
				this.players[i].cards.push(uno_random_card());
			}
		}
		this.play_turn();
	},
	play_turn: function(){
		this.c=color_code_from_text(this.card_in_arena.color);
		for(var y=0;y<this.players.length;y++){
			if(this.players[y].cards.length==0){
				this.end_game(this.players[y]);
				return;
			}
		}
		for(var i=0;i<this.players.length;i++){
			var g = client.guilds.array()[0];
			var c = g.channels.find("name","solo-player-"+(i+1));
			//c.send("~~------------------------------------~~");
			var em= new Discord.RichEmbed().setColor(this.c);
			var otherc="";
			if(i==this.current_turn){
				var cp=this.players[i];
				var cn=i+1;
			}
			if((this.players[i].uno)&&(this.players[i].cards.length>1)){
				this.players[i].uno=false;
			}
			for(var j=0;j<this.players.length;j++){
				if (this.current_turn==j){
					em.setTitle("**"+this.players[j].name+"'s turn!**");
				}
				if(j!=i){
					otherc=otherc+this.players[j].name+"'s cards: ";
					var cii=g.emojis.find("name","unocard").toString()+" ";
					otherc=otherc+cii.repeat(this.players[j].cards.length);
				} else {
					otherc=otherc+"**Your cards: **";
					for(var n=0;n<this.players[j].cards.length;n++){
						otherc=otherc+uno_card_to_text(this.players[j].cards[n])+" ";
					}
				}
				if(this.players[j].uno){
					otherc=otherc+" **UNO!**";	
				}
				otherc=otherc+"\n";
			}
			em.addField("Players' Cards",otherc);
			em.addField("Card Played:",uno_card_to_text(this.card_in_arena));
			c.send(em);
		}
		var c=client.guilds.array()[0].channels.find("name","solo-player-"+cn);
		var cards="";
		var em=new Discord.RichEmbed().setColor(this.c);
		cp.cards.forEach(card=>{
			cards=cards+uno_card_to_text(card)+" ";
		});
		var playable = uno_cards_playable(cp.cards,this.card_in_arena);
		em.setTitle("**It's your turn!**");
		em.addField("You have:",cards);
		if(playable.length==0){
			em.setTitle("**It's your turn but you can't play any card!**");
			em.addField("Oh no!","You can't play any card, draw 1!");
			for(var i=0;i<this.players.length;i++){
				if(i!=cn-1){
				var cc=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
				cc.send(new Discord.RichEmbed().setColor(this.c).setTitle(cp.name +" drew a card!"));
				}
			}
			cp.cards.push(uno_random_card());
			if(this.players[cn-1].uno) this.players[cn-1].uno=false;
		} else {
			var pl="";
			playable.forEach(card=>{
				pl=pl+uno_card_to_text(card)+" ";
			});
			em.addField("You can play",pl);
			em.setFooter("Write \"play (number)\" to play one of these cards!\nOr write \"draw\" to draw a card instead!")
		}
		c.send(em);
		if(playable.length==0){
			setTimeout(function(){uno_game.next_turn(0);},2000);
		}
	},
	next_turn: function(type){
		//0: normal
		//1: reverse
		//2: skip
		//3: draw
		this.c=color_code_from_text(this.card_in_arena.color);
		if(type==undefined) return;
		if(type==0){
			this.current_turn+=this.direction;
		}
		if(type==1){
			this.direction=-this.direction;
			this.fix_turn();
			for(var i=0;i<this.players.length;i++){
				var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
				if(this.players.length>2){
				c.send(new Discord.RichEmbed().setColor(this.c).setTitle("Reverse!"));
				}else{
				c.send(new Discord.RichEmbed().setColor(this.c).setTitle("Reverse back to " + this.players[this.current_turn].name + "!"));
				}
			}
			if(this.players.length>2){
				this.current_turn+=this.direction;
			}
		}
		if(type==2){
			this.current_turn+=this.direction;
			this.fix_turn();
			for(var i=0;i<this.players.length;i++){
				var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
				c.send(new Discord.RichEmbed().setColor(this.c).setTitle("Skip!"));
				if(i==this.current_turn){
				c.send(new Discord.RichEmbed().setColor(this.c).setTitle("You've been skipped!"));	
				}
			}
			this.current_turn+=this.direction;
		}
		if(type==3){
			this.current_turn+=this.direction;
			this.fix_turn();
			for(var i=0;i<this.players.length;i++){
				var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
				if(this.card_in_arena.name=="draw2") c.send(new Discord.RichEmbed().setColor(this.c).setTitle("Draw 2!"));
				if(this.card_in_arena.name=="wilddraw4") c.send(new Discord.RichEmbed().setColor(this.c).setTitle("Draw 4!"));
				if(i==this.current_turn){
					c.send(new Discord.RichEmbed().setColor(this.c).setTitle("You've been skipped!"));
					var t=2;
					if(this.card_in_arena.name=="wilddraw4") t=4;
					for(var f=0;f<t;f++){
						this.players[i].cards.push(uno_random_card());
					}
				}
			}
			this.current_turn+=this.direction;
		}
		this.fix_turn();
		this.play_turn();
	},
	fix_turn: function(){
		if(this.current_turn==this.players.length){
			this.current_turn=0;	
		}
		if(this.current_turn==-1){
			this.current_turn=this.players.length-1;	
		}	
	},
	end_game: function(win){
		this.status=2;
		for(var i=0;i<this.players.length;i++){
			var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
			c.send(new Discord.RichEmbed().setColor("#ffffff").setTitle(win.name+" won the game!\nGame closing in 5 seconds."));
		}
		if(this.mainchannel!=undefined) this.mainchannel.send("Uno game ended! Winner: **<@!"+win.id+">**");
		setTimeout(function(){
			uno_game.status=0;
			for(var i=0;i<uno_game.players.length;i++){
				client.guilds.array()[0].members.find("id",uno_game.players[i].id).removeRole(client.guilds.array()[0].roles.find("name","Uno - Solo - Player " + (i+1)));
			}
			uno_game.players=[];
		},5000);
	}
}
const prefix = "."
var welcomes = ["https://media.giphy.com/media/3o6Zt6zRQw8yStXfxe/giphy.gif",
		"https://media.giphy.com/media/10a9ikXNvR9MXe/giphy.gif",
		"https://media3.giphy.com/media/OF0yOAufcWLfi/giphy.gif",
		"https://i.imgflip.com/1thlr1p.gif",
		"https://thumbs.gfycat.com/ExcellentGrouchyBass-max-1mb.gif",
		"https://66.media.tumblr.com/5ab0c2fde2312b3bcbf5a64bc222d6a6/tumblr_o4sdnnQ8DT1udh5n8o1_500.gif"];
function showError(message,err){
	message.channel.send(":no_entry: **A error has occured while performing this execution.** Please report this to <@123413327094218753> .\n```js\n"+err+"\n```")		
}
function sendGif(channel,search){
	snekfetch.get("https://api.tenor.com/v1/search?q="+search+"&key=4ZLIWNNTXTXW&limit=5").then(r => {
			var b = r.body;
				var one = b.results[Math.floor(Math.random()*b.results.length)];
				var embed = new Discord.RichEmbed();
				embed.addField("**Need a gif? There you go**","Search : *" + search.split("+").join(" ") + "*");
				embed.setColor("#"+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9))
				embed.setImage(one.media[0].gif.url);
				embed.setFooter("Using tenor.com API | https://api.tenor.com")
				channel.send(embed);
		});
}

function sendMeme(channel,search){
	snekfetch.get("https://api.tenor.com/v1/search?q=meme+"+search+"&key=4ZLIWNNTXTXW&limit=50").then(r => {
			var b = r.body;
				var one = b.results[Math.floor(Math.random()*b.results.length)];
				var embed = new Discord.RichEmbed();
				embed.addField("**Random meme**","Meme about : *" + search.split("+").join(" ") + "*");
				embed.setColor("#"+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9)+Math.floor(Math.random()*9))
				embed.setImage(one.media[0].gif.url);
				embed.setFooter("Using tenor.com API | https://api.tenor.com")
				channel.send(embed);
		});
}
client.on('ready', () => {
    console.log('Spectre is ready!');
	var ch = client.guilds.find('id','427484376482447365').channels.find('id',"566764780619038751");
	client.user.setPresence({ game: { name: 'in the darkness.' , streaming: true}, status: 'dnd' })
  	.then()
  	.catch(err => { console.log(err);});
	
});

client.on('presenceUpdate', (o,n) => {
	var embed = new Discord.RichEmbed();
		if((o.presence.game == null) && (n.presence.game != null)){
			if(n.presence.game.streaming == true){
				embed.setTitle("<:pingwhat:427562015897288716> Click here to watch!")
				.setURL(n.presence.game.url)
				.setColor("7f0893")
				.addField("**" + n.user.username + "** IS NOW STREAMING!","Watch it before it ends!")
				.setThumbnail(n.user.displayAvatarURL);
				n.guild.channels.find('id','565653636688904222').send(embed);
				n.addRole(n.guild.roles.find('id','565653248338427944'));
			} if(n.presence.game.name == "Dreamphase"){
				client.channels.find("id","613564167269646338").send("**" + n + "** has started playing **Dreamphase**");
				n.guild.members.find("id",n.id).startPlay = new Date().getTime();
				n.addRole(n.guild.roles.find('id','613563019921981467'));
			}
		} else if((o.presence.game != null) && (n.presence.game == null)){
			if (o.presence.game.streaming == true){	
				embed.setTitle("<:huh:427562025229484033> Oh noo !")
				.addField("**" + n.user.username + "** just ended his/her stream.","The stream is no longer live.")
				.setColor("960f00")
				.setThumbnail(n.user.displayAvatarURL);
				n.guild.channels.find('id','565653636688904222').send(embed);
				n.removeRole(n.guild.roles.find('id','565653248338427944'));	    
			} if(o.presence.game.name == "Dreamphase"){
				var mm = n.guild.members.find("id",n.id);
				var c = "";
				if (mm.startPlay != undefined){
					c = "*(Time spent playing : " + (((new Date().getTime() - mm.startPlay)/60000)|0) + " minutes)*";
				}
				client.channels.find("id","613564167269646338").send("**" + n + "** has finished playing **Dreamphase** "+c);
				n.removeRole(n.guild.roles.find('id','613563019921981467'));
			}
		} else if ((o.presence.game != null) && (n.presence.game != null)){
			if ((o.presence.game.streaming == false) && (n.presence.game.streaming == true)){
				embed.setTitle("<:pingwhat:427562015897288716> Click here to watch!")
				.setURL(n.presence.game.url)
				.setColor("7f0893")
				.addField("**" + n.user.username + "** IS NOW STREAMING!","Watch it before it ends!")
				.setThumbnail(n.user.displayAvatarURL);
				n.guild.channels.find('id','565653636688904222').send(embed);
				n.addRole(n.guild.roles.find('id','565653248338427944'));
			} else if ((o.presence.game.streaming == true) && (n.presence.game.streaming == false)){
				embed.setTitle("<:huh:427562025229484033> Oh noo !")
				.addField("**" + n.user.username + "** just ended his/her stream.","The stream is no longer live.")
				.setColor("960f00")
				.setThumbnail(n.user.displayAvatarURL);
				n.guild.channels.find('id','565653636688904222').send(embed);
				n.removeRole(n.guild.roles.find('id','565653248338427944'));	    
			} if((n.presence.game.name == "Dreamphase")&&(o.presence.game.name != "Dreamphase")){
				client.channels.find("id","613564167269646338").send("**" + n + "** has started playing **Dreamphase**");
				n.guild.members.find("id",n.id).startPlay = new Date().getTime();
				n.addRole(n.guild.roles.find('id','613563019921981467'));
			} else if((n.presence.game.name != "Dreamphase")&&(o.presence.game.name == "Dreamphase")){
				var mm = n.guild.members.find("id",n.id);
				var c = "";
				if (mm.startPlay != undefined){
					c = "*(Time spent playing : " + (((new Date().getTime() - mm.startPlay)/60000)|0) + " minutes)*";
				}
				client.channels.find("id","613564167269646338").send("**" + n + "** has finished playing **Dreamphase** "+c);
				n.removeRole(n.guild.roles.find('id','613563019921981467'));
			}
	}
});

client.on('raw', event => {
	if (event.t === 'MESSAGE_REACTION_ADD'){
		var g = client.guilds.find('id',event.d.guild_id);
		var c = g.channels.find('id',event.d.channel_id);
		var msg = c.fetchMessage(event.d.message_id).then(msg => {
		var user = g.members.find('id',event.d.user_id);
		if ((event.d.message_id === "565632576493060099") && !(user.roles.array().includes(g.roles.find('id','565634749142663169')))){
			user.addRole(g.roles.find('id','565634749142663169'));
			user.send("You've unlocked the channel : #talk-to-the-human")
		}
		if (c.id == "566743327681019905"){
			c.fetchMessage(event.d.message_id).then(message => {
				var role = message.mentions.roles.first();
				if (role != undefined){
					if(user.roles.array().includes(role)){
						user.removeRole(role);
						user.send("The role **" + role.name + "** was removed.")
					} else {
						user.addRole(role);
						user.send("The role **" + role.name + "** was added.")
					}
				}
			}).catch(console.error);
		}
		}).catch();
	}
});

client.on('message', msg => {
	if(msg.channel.id != "564594023419871242") return;
	if(msg.author.bot) return;
	msg.channel.send("~~--------------------------------~~\n**- Suggestion :**\nRequested by : <@!" + msg.author.id + ">\n**Content : ** "+msg.content+"\n**State : ** Waiting for a response.\n~~--------------------------------~~");
	msg.delete().then().catch();
	
});
client.on('message' , message =>{
	if (message.mentions.users.first() != undefined){
		if((message.mentions.users.first().name == client.user.name) && (message.content.includes("dude help me"))){
			message.author.send("P | 8 | download welcome image");						
		}
	}
	if ((message.channel.name === "escape-game") && (message.content === "iO5o&vQPeu")){
		message.delete();
		message.guild.channels.find("name","announcements").send("@everyone \n\n " + message.author + " won the weekly escape game and successfully found the code : **iO5o&vQPeu**");
	}
});
client.on('message', message =>{
	if((message.channel.type === "dm")&&(message.author.id==="123413327094218753")){
		if ((message.content.startsWith("--news"))&&(message.channel.news==undefined)){
			message.channel.send("What is the name of what you want to announce?");
			message.channel.news = 1;
			message.channel.current_news = {};
		} else if ((message.content.startsWith("--cancel_news"))&&(message.channel.news!=undefined)){
			message.channel.news = undefined;
			message.channel.send("Process canceled.")
		} else if(message.channel.news!=undefined){
			switch(message.channel.news){
				case 1:
					{
						message.channel.current_news.name = message.content;
						message.channel.send("What is the description of your news?")
						message.channel.news += 1;
						break;
					}
				case 2:
					{
						message.channel.current_news.desc = message.content;
						message.channel.send("What is the url of your announcement?")
						message.channel.news +=1;
						break;
					}
				case 3:
					{
						message.channel.current_news.url = message.content;
						message.channel.send("What files do you want in the announcement?");
						message.channel.news +=1;
						break;
					}
				case 4:
					{
						if (message.attachments.array().length != 0){
							message.channel.current_news.file = message.attachments.first().url;
						}
						message.channel.send("Done!");
						message.channel.news = undefined;
						if (message.channel.current_news.url.startsWith("http")){
							var url = message.channel.current_news.url;	
						} else {
							var url = undefined;	
						}	
						var embed = new Discord.RichEmbed();
						embed.setAuthor("Announcement","https://media.discordapp.net/attachments/595992829826957324/714479591728742510/logoandstuff.png",url);		
						embed.setImage(message.channel.current_news.file);
						embed.addField(message.channel.current_news.name,message.channel.current_news.desc);
						embed.setColor("586e85");
						function t(l){
							var n = l +"";
							if (n.length==1){
								return "0"+n;
							} else {
								return n;	
							}
						}
						var today = new Date();
						var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
						var time = t(today.getHours()) + ":" + t(today.getMinutes()) + ":" + t(today.getSeconds());
						var dateTime = date+' at '+time;
						embed.setFooter(dateTime);
						client.channels.find("name","game-announcements").send(embed);
						break;
					}
			}
		}
	}
});
client.on('message', message => {
	try{
		var command = message.content.replace(prefix,"").split(" ")[0];
		if (!command) return;
		var args_case = message.content.replace(prefix + command + " ","").split(" ");
		var args = message.content.toLowerCase().replace(prefix + command + " ","").split(" ");
		if(command==="purge") {
			async function purge() {
			    message.delete();

			    if (message.author.id !== "123413327094218753") {
				return;
			    }

			    if (isNaN(parseInt(args[1]))) {
				message.channel.send('Specify a number please.')
				return;
			    }

			    const fetched = await message.channel.fetchMessages({limit: parseInt(args[1])});
			    console.log(fetched.size + ' Messages Found, Deleting....' );

			    message.channel.bulkDelete(fetched)
				.catch(error => message.channel.send(`Error: ${error}`));
				message.author.send('Messages Deleted: ' + fetched.size)
			}
			purge();
		    } 
	   var sf = message.content.toLowerCase().replace(prefix + command + " ","");
		command.toLowerCase();
		if(message.author.bot) return;
		if(message.channel.type != 'text') return;

		if(message.channel.id === "566764780619038751"){
			if(command === "gif"){
				sendGif(message.channel,args_case.join("+"));	
			}else if(command === "meme"){
				sendMeme(message.channel,args_case.join("+"));	
			}
		}
		if((uno_game.status==1)&&(message.content.toLowerCase()=="uno")){
			var t = false;
			for(var i = 0; i<uno_game.players.length;i++){
				if(uno_game.players[i].id==message.author.id){
					t = true;
					var ii=i;
					i = uno_game.players.length;}}
			if(t){
				if((uno_game.current_turn==ii)&&(uno_game.players[ii].cards.length==2)){
					if(!uno_game.players[ii].uno){
						message.delete();
						for(var i = 0; i<uno_game.players.length;i++){
							var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
							c.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle(message.author.username + ": UNO!"))
						}
						uno_game.players[ii].uno=true;
					} else {
						message.channel.send("You already said uno!")
					}
				}
			}
		}
		if(message.author.awaiting_color==true){
			if(["blue","red","yellow","green"].includes(message.content.toLowerCase())){
				message.author.awaiting_color=undefined;
				uno_game.card_in_arena.color=message.content.toLowerCase();
				uno_game.c=color_code_from_text(uno_game.card_in_arena.color);
				for(var i=0;i<uno_game.players.length;i++){
					var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
					c.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle("The color is now **"+uno_game.card_in_arena.color+"!**"));
				}
				clearTimeout(colortimer);
				if (uno_game.card_in_arena.name=="wilddraw4") uno_game.next_turn(3);
				else uno_game.next_turn(0);
			} else {
				message.channel.send("Please write down either: *blue, red, yellow or green*.");	
			}
		}
		if(uno_game.status==1){
				var aaa = message.content.toLowerCase().split(" ");
				var t = false;
					for(var i = 0; i<uno_game.players.length;i++){
						if(uno_game.players[i].id==message.author.id){
							t = true;
							var ii=i;
							i = uno_game.players.length;
						}
					}
				if(t){
					if(uno_game.current_turn==ii){
							if(message.channel.name==("solo-player-"+(ii+1))){
								var pp=uno_cards_playable(uno_game.players[ii].cards,uno_game.card_in_arena);
								if (pp.length==0) return;
								if(aaa[0]=="draw"){
									for(var i=0;i<uno_game.players.length;i++){
										var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
										c.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle(message.author.username +" drew a card!"));
									}
									var ncard=uno_random_card();
									message.channel.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle("You drew " + uno_card_to_text(ncard) + " !"));
									uno_game.players[ii].cards.push(ncard);
									if(uno_game.players[ii].uno) uno_game.players[ii].uno=false;
									uno_game.next_turn(0);
								}
								if(aaa[0]=="play"){
									if(isNaN(parseInt(aaa[1]))){
										message.channel.send("Please write a number between 1 and " + (pp.length));	
									}else if(parseInt(aaa[1])<1){
										message.channel.send("Please write a number between 1 and " + (pp.length));
									} else if(parseInt(aaa[1])>(pp.length)){
										message.channel.send("Please write a number between 1 and " + (pp.length));
									} else {
										var forgotuno=false;
										if((!uno_game.players[ii].uno)&&(uno_game.players[ii].cards.length==2)){
											forgotuno=true;
											message.channel.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle("You forgot to say UNO! Draw 2!"));
											uno_game.players[ii].cards.push(uno_random_card());
											uno_game.players[ii].cards.push(uno_random_card());
										}
										for(var i=0;i<uno_game.players.length;i++){
											var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
											if((forgotuno)&&(i!=ii)){
												c.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle(message.author.username + " forgot to say UNO! Draw 2!"));
											}
											c.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle(message.author.username+" played "+uno_card_to_text(pp[parseInt(aaa[1])-1])+"!"));
										}
										uno_game.card_in_arena=pp[parseInt(aaa[1])-1];
										uno_game.players[ii].cards.forEach((cc,ind)=>{
											if(cc==uno_game.card_in_arena){
												uno_game.players[ii].cards.splice(ind,1);
												return;
											}
										});
										var ty=0;
										if(["wild","wilddraw4"].includes(uno_game.card_in_arena.name)){
											message.channel.send("What color do you want to set?");
											message.author.awaiting_color=true;
											colortimer = setTimeout(function(){
												if (message.author.awaiting_color!=true) return;
												message.author.awaiting_color=false;
												uno_game.card_in_arena.color="red";
												uno_game.c=color_code_from_text(uno_game.card_in_arena.color);
												for(var i=0;i<uno_game.players.length;i++){
													var c=client.guilds.array()[0].channels.find("name","solo-player-"+(i+1));
													c.send(new Discord.RichEmbed().setColor(uno_game.c).setTitle("The color is now **"+uno_game.card_in_arena.color+"!**"));
												}
												if (uno_game.card_in_arena.name=="wilddraw4") uno_game.next_turn(3);
												else uno_game.next_turn(0);
											},25000);
										}else{
											if(uno_game.card_in_arena.name=="draw2") ty=3;
											if(uno_game.card_in_arena.name=="reverse") ty=1;	
											if(uno_game.card_in_arena.name=="skip") ty=2;
											uno_game.next_turn(ty);
										}
									}
								}
							}
					}
				}
			}
		if(command === "uno"){
			if(message.channel.id != "565273875827392539") return;
			if (args[0]==="join"){
				if(uno_game.status==0){
					var t = false;
					for(var i = 0; i<uno_game.players.length;i++){
							if(uno_game.players[i].id==message.author.id){
								t = true;
								i = uno_game.players.length;
							}
						}
					if(!t){
						if(uno_game.players.length!=8){
							var l=uno_game.players.push({
								name: message.author.username,
								id: message.author.id,
								cards: [],
								uno: false
							});
							message.channel.send(message.author + " has joined the game. (*"+l+"*/8)");
							if (l==2){
								message.channel.send("Game is starting in 20 seconds.");
								uno_game.mainchannel=message.channel;
								uno_game.timer = setTimeout(function(){
								uno_game.start();
								uno_game.mainchannel.send("Game has started!");
								},20000);
							}
						} else { message.reply("Game is full!"); }
					} else { message.reply("You're already in game"); }
				} else {
					message.reply("The game has already started!");	
				}
				
			} else if(args[0]==="leave"){
				if(uno_game.status==0){
					var t = false;
					for(var i = 0; i<uno_game.players.length;i++){
							if(uno_game.players[i].id==message.author.id){
								t = true;
								i=uno_game.players.length;
							}
						}
					if(t){
						for(var i = 0; i<uno_game.players.length;i++){
							if(uno_game.players[i].id==message.author.id){
								uno_game.players.splice(i,1);
							}
						}
						var l=uno_game.players.length;
						if (l==1){
							if (uno_game.timer!=undefined){
								clearTimeout(uno_game.timer);
								uno_game.timer=undefined;
								message.channel.send("Game no longer starting. Not enough players.");
							}
						}
					}else{
						message.reply("You're not in queue/game.");	
					}
				}
			}
		}
		if(message.channel.id != "565273875827392539") return;
		if(command === "ping"){
			var embed = new Discord.RichEmbed()
			.setColor("42F46B")
			.addField("Pong!","My latency is **" + (client.ping|0) + "** ms.");
			message.channel.send(embed)
				.then()
				.catch(err =>{
					showError(message,err);
				});
		} else if(command === "ttt"){
			var c = message.channel;
			var letters = ["a","b","c","d","e","f","g","h","i"];
			function similar(a,b,c){
				if ((a == b) && (b == c)) {
					return true;	
				}
				return false;
			}
			function checkWin(a,b,c,d,e,f,g,h,i){
				if (similar(a,b,c)||similar(d,e,f)||similar(g,h,i)||similar(a,d,g)||similar(b,e,h)||similar(c,f,i)||similar(a,e,i)||similar(c,e,g)){
					return true;
				}
				return false;
			}
			if (args[0] === "join"){
				if (c.p1 == message.author){
					c.send("You've already joined the game! --'")	
				} else if (c.p2 != undefined){
					c.send("**Sorry!** The game has already started.");
				} else if(c.p1 == undefined){
					c.send("**<@"+message.author.id+">** has joined. (*1 player remaining*).")
					c.p1 = message.author;
				} else if(c.p2 == undefined){
					c.send("**<@"+message.author.id+">** has joined. (*Game starting...*).")
					c.p2 = message.author;
					c.turn = c.p1;
					for(var n = 0; n <= 8; n++){
						eval("c.box" + letters[n] + " = ':regional_indicator_' + letters[n] + ':';");
					}
					c.send(c.boxa + " " + c.boxb + " " + c.boxc + " \n" + c.boxd + " " + c.boxe + " " + c.boxf + " \n" + c.boxg + " " + c.boxh + " " + c.boxi);
					c.send(c.turn + "'s turn : write *.ttt do <letter>*");
				}
			} else if(args[0] === "leave"){
				if ((c.p1 != message.author) && (c.p2 != message.author)){
					c.send("You're not currently in game.");
				} else {
					c.p1 = null;
					c.p2 = null;
					c.send("You left the queue/game.")
				}
			} else if (args[0] === "do"){
				if (c.p2 == null){
					c.send("No game is currently on , to start a game , write *.ttt join* and invite a friend!")	
				} else if ((c.p1 != message.author) && (c.p2 != message.author)){
					c.send("You're not currently in game.");	
				} else if (c.turn != message.author){
					c.send("This is not your turn.");	
				} else if (!letters.includes(args[1])){
					c.send("Please write either : " + letters.join(","));	
				} else if (eval("(c.box"+args[1]+" != ':regional_indicator_"+args[1]+":')")){
					c.send("This box is already used.")	
				} else {
					if (c.p1 == message.author) {eval("c.box"+args[1]+" = ':red_circle:'");}
					if (c.p2 == message.author) {eval("c.box"+args[1]+" = ':white_circle:'");}
					c.send(c.boxa + " " + c.boxb + " " + c.boxc + " \n" + c.boxd + " " + c.boxe + " " + c.boxf + " \n" + c.boxg + " " + c.boxh + " " + c.boxi);
					var win = checkWin(c.boxa,c.boxb,c.boxc,c.boxd,c.boxe,c.boxf,c.boxg,c.boxh,c.boxi);
					var end = true;
					for(var n = 0; n <= 8; n++){
						if(eval("(c.box" + letters[n] + " == ':regional_indicator_' + letters[n] + ':')")){
							end = false;	
						}
					}
					if (!end){
						if (win) {
							c.send("**<@" + message.author.id + ">** wins the game!")
							c.send("Game end.")
							c.p1 = null;
							c.p2 = null;
							c.turn = null;
						} else {
							if (c.turn == c.p1){
								c.turn = c.p2;	
							} else {
								c.turn = c.p1;	
							}
							c.send(c.turn + "'s turn : write *.ttt do <letter>*");
						}
					} else {
						c.send("**LOL!** Noone won this game.")
						c.send("Game end.")
						c.p1 = null;
						c.p2 = null;
						c.turn = null;	
					}
				}
			} else {
				c.send("Command arguments : *.ttt do* , *.ttt join* , *.ttt leave*");	
			}
		}else if(command === "gtn"){
			if(args[0]==="start"){
				if (message.channel.gtn_started == undefined){
					///Stars the game
					message.channel.gtn_number = (Math.random()*1000)|0;
					message.channel.gtn_started = true;
					message.channel.send("The number is between 0 and 1000 , write *.gtn try <number>*  to guess it!");
				} else {
					message.channel.send(message.author + ", the game has already started.")	
				}
			} else if (args[0]==="try"){
				if (message.channel.gtn_started == undefined){
					message.channel.send("The game didn't yet start , start it with *.gtn start* !");	
				} else {
					if(isNaN(args[1])){
						message.channel.send("The number you wrote is not a valid number.");
					} else if(parseInt(args[1]) > message.channel.gtn_number){
						message.channel.send(message.author + ", Lower!");	
					} else if(parseInt(args[1]) < message.channel.gtn_number){
						message.channel.send(message.author + ", Higher!");
					} else {
						message.channel.send(message.author + " just guessed the number! It was indeed **"+args[1]+"**");
						message.channel.gtn_started = undefined;
					}
				}
			} else {
				message.channel.send("Command arguments : *.gtn start* , *.gtn try*");	
			}
		} else if(command === "un"){
			function emojify(t){
				var str = "";
				var text = t.toLowerCase();
				for(var b = 0; b<text.length;b++){
					if (text.charAt(b) !== "-"){
					str += ":regional_indicator_"+text.charAt(b)+": ";
					} else {
					str += ":white_large_square: ";	
					}
				}
				return str;
			}
			if(args[0]==="start"){
				if (message.channel.gtw_started == undefined){
					///Stars the game
					//https://random-word-api.herokuapp.com/all?key=U9ECD55J
					function shuffle(x) {
						  if (typeof x === "object"){
						        var j, c, i;
							var a = x;
							for (i = a.length - 1; i > 0; i--) {
								j = Math.floor(Math.random() * (i + 1));
								c = a[i];
								a[i] = a[j];
								a[j] = c;
							}
							  return a;
						  } else if (typeof x === "string"){
						    var a = x.split(""),
							n = a.length;

						    for(var i = n - 1; i > 0; i--) {
							var j = Math.floor(Math.random() * (i + 1));
							var tmp = a[i];
							a[i] = a[j];
							a[j] = tmp;
						    }
						    return a.join("");
						}
					}
					function getAWord(){
						snekfetch.get("http://dreamphase.000webhostapp.com/data/api/random-word.txt").then(r =>{
							message.channel.gtw_word = JSON.parse(r.body.toString())[Math.floor(Math.random()*(JSON.parse(r.body.toString()).length))];
							if (message.channel.gtw_word.length <= 3) {
								console.log("short! " + message.channel.gtw_word);
								return getAWord();	
							}
							message.channel.gtw_word =message.channel.gtw_word.replace("-","");
							message.channel.displayed = shuffle(message.channel.gtw_word);
							message.channel.gtw_started = true;
							message.channel.send("The shuffled word is : **" + emojify(message.channel.displayed) + "** , use *.gtw try <word>* , good luck!");
							return true;
						}).catch(err => {
							console.log(err);
							message.channel.send("Error has occured , please try again.")
							return false;
						});
					}
					getAWord();
				} else {
					message.channel.send(message.author + ", the game has already started.")	
				}
			} else if (args[0]==="try"){
				if (message.channel.gtw_started == undefined){
					message.channel.send("The game didn't yet start , start it with *.un start* !");	
				} else {
					if (args[1].toLowerCase().includes(message.channel.gtw_word)){
						message.channel.send(message.author + " just guessed the word , it was indeed **" + emojify(message.channel.gtw_word) + "**");
						message.channel.gtw_started = undefined;
					} else {
						var str = "";
						var number = 0;
						for(var b = 0; b<message.channel.gtw_word.length;b++){
							if (message.channel.gtw_word.charAt(b) === args[1].charAt(b)){
								str += ":regional_indicator_"+message.channel.gtw_word.charAt(b)+": ";	
								number += 1;
							} else {
								str += ":x: ";	
							}
						}
						message.channel.send(message.author + ", you've got "+ number + " letters correct : " + str)
					}
				}
			}else if((args[0]==="stop")&&(message.author.id==="123413327094218753")){
				if (message.channel.gtw_started == undefined){
					message.channel.send("The game didn't yet start , start it with *.un start* !");	
				} else {	
					message.channel.send(message.author + ", gave up. The word was " + emojify(message.channel.gtw_word));
					message.channel.gtw_started = undefined;
				}
			}else{
				message.channel.send("Command arguments : *.un start* , *.un try*");
			}
		} else if(command==="c"){
			function checkWinner(obj){
				var str = "";
				for(var k = 5; k >= 0; k--){
					var str2 = "";
					for(var i = 0;i<obj.length;i++){
						if (obj[i][k] == undefined){
							str2 += ":black_circle: ";
						} else {
							if (obj[i][k].owner == 1){
								str2 += ":red_circle: ";	
							} else {
								str2 += ":white_circle: ";
							}
						}
					}
					str += str2 + "\n";
				}
				if(str.includes(":white_circle: :white_circle: :white_circle: :white_circle:")){
					return 2;	
				} else if(str.includes(":red_circle: :red_circle: :red_circle: :red_circle:")){
					return 1;	
				}
				str = "";
				for(var i = 0;i<obj.length;i++){
					var str2 = "";
					for(var k = 5; k >= 0; k--){
						if (obj[i][k] == undefined){
							str2 += ":black_circle: ";
						} else {
							if (obj[i][k].owner == 1){
								str2 += ":red_circle: ";	
							} else {
								str2 += ":white_circle: ";
							}
						}
					}
					str += str2 + "\n";
				}
				if(str.includes(":white_circle: :white_circle: :white_circle: :white_circle:")){
					return 2;	
				} else if(str.includes(":red_circle: :red_circle: :red_circle: :red_circle:")){
					return 1;	
				}
				for(var i = 0;i<obj.length;i++){
					for(var k = 5; k >= 0; k--){
						if((obj[i] != undefined)&&(obj[i+1] != undefined)&&(obj[i+2] != undefined)&&(obj[i+3] != undefined)){
							if ((obj[i][k] != undefined)&&(obj[i+1][k+1] != undefined)&&(obj[i+2][k+2] != undefined)&&(obj[i+3][k+3] != undefined)){
								if ((obj[i][k].owner == obj[i+1][k+1].owner) && (obj[i+1][k+1].owner == obj[i+2][k+2].owner) && (obj[i+2][k+2].owner == obj[i+3][k+3].owner)){
									return obj[i][k].owner;
								}
							}
						}
					}
				}
				for(var i = 0;i<obj.length;i++){
					for(var k = 5; k >= 0; k--){
						if((obj[i] != undefined)&&(obj[i+1] != undefined)&&(obj[i+2] != undefined)&&(obj[i+3] != undefined)){
							if ((obj[i][k] != undefined)&&(obj[i+1][k-1] != undefined)&&(obj[i+2][k-2] != undefined)&&(obj[i+3][k-2] != undefined)){
								if ((obj[i][k].owner == obj[i+1][k-1].owner) && (obj[i+1][k-1].owner == obj[i+2][k-2].owner) && (obj[i+2][k-2].owner == obj[i+3][k-3].owner)){
									return obj[i][k].owner;
								}
							}
						}
					}
				}
				return 0;
			}
			function displayConnect(obj){
				var str = "";
				
				for(var k = 5; k >= 0; k--){
					var str2 = "";
					for(var i = 0;i<obj.length;i++){
						if (obj[i][k] == undefined){
							str2 += ":black_circle: ";
						} else {
							if (obj[i][k].owner == 1){
								str2 += ":red_circle: ";	
							} else {
								str2 += ":white_circle: ";
							}
						}
					}
					str += str2 + "\n";
				}
				return str;
			}
			var Connect = [[],[],[],[],[],[],[]];
			if(args[0] == "join"){
				if (message.channel.connect == undefined) {
					message.channel.connect = {
						player1: message.author,
						player2: undefined,
						map: Connect
					}
					message.channel.send(message.author + " has joined the game *(1/2 players)*")
				} else if (message.channel.connect.player2 == undefined){
					message.channel.connect.player2 = message.author;
					message.channel.send(message.author + " has joined the game *(2/2 players)*")
					message.channel.connect.turn = message.channel.connect.player1;
					message.channel.send(message.channel.connect.player1 + " 's turn")
					message.channel.send(":one: :two: :three: :four: :five: :six: :seven: \n" + displayConnect(message.channel.connect.map));
				} else {
					message.channel.send("Game has already started.")	
				}
			} else if(args[0] == "put"){
				if ((message.channel.connect == undefined) || (message.channel.connect.player2 == undefined)){
					message.channel.send("No game is currently on. Join with *.c join*")	
				} else if(message.channel.connect.turn != message.author){
					message.channel.send("It's not your turn.")	
				} else if(isNaN(args[1])){
					message.channel.send("The number you specified is incorrect.")	
				} else {
					if((parseInt(args[1]) > 0) && (parseInt(args[1])<8))	{
						if (message.channel.connect.map[parseInt(args[1])-1].length == 6){
							message.channel.send("This row is full.");
						} else {
							if (message.channel.connect.player1 == message.author)
							{
								var o = 1;
								message.channel.connect.turn = message.channel.connect.player2;
							} else {
								var o = 2;
								message.channel.connect.turn = message.channel.connect.player1;
							}
							message.channel.connect.map[parseInt(args[1])-1].push({owner: o});
							message.channel.send(":one: :two: :three: :four: :five: :six: :seven: \n" + displayConnect(message.channel.connect.map));
							var win = checkWinner(message.channel.connect.map);
							if (win != 0){
								if (win = 1){
									message.channel.send(message.channel.connect.player1 + " won!");
								} else if (win = 2){
									message.channel.send(message.channel.connect.player2 + " won!");	
								}
								message.channel.connect = undefined;
							} else {
								message.channel.send(message.channel.connect.turn + " 's turn.")	
							}
						}
					} else {
						message.channel.send("Please specify a number between 1 and 7.")		
					}
				}
			}
		} else if(command === "games"){
			message.channel.send(new Discord.RichEmbed()
					    .setFooter("Spectre Bot")
					    .setColor("FFFFFF")
					    .setTitle("Current available games:")
					    .setThumbnail(client.user.displayAvatarURL)
					    .addField("Tic-tac-toe",".ttt join/do/leave")
					    .addField("Guess the number",".gtn start/try")
					    .addField("Unscramble the word",".un start/try")
					    .addField("Connect 4",".c start/put/leave")
					    .addField("Uno - Card Game",".uno join/leave/play/draw"));
		} else if(command === "help"){
			message.channel.send(new Discord.RichEmbed()
					     .setFooter("Spectre Bot")
					     .setTitle("Help")
					     .addField("Games",".games"));
		}
	}catch(err){
		showError(message,err);
	}
});
//DEBBUGING
client.on('message', message => {
	if((message.author.id === "123413327094218753") && (message.channel.id === "565589937970479104")){
		try{
			message.channel.send("**Input:**\n```js\n"+message.content+"\n```\n**Output:**\n```js\n"+eval(message.content)+"\n```");	
		}catch(err){
			message.channel.send("**Input:**\n```js\n"+message.content+"\n```\n**Caught error:**\n```js\n"+err+"\n```");
		}
		message.delete();
	}
	
});
client.on("guildMemberAdd", member =>{
	member.addRole(member.guild.roles.find("name","dudes"));
	member.guild.channels.find("name","welcome").send(new Discord.RichEmbed().setColor("FFFFFF").setImage(welcomes[Math.floor(Math.random()*welcomes.length)]).addField("Welcome!","Welcome **" + member.displayName + "**! i don't know how the fuck you got here , but have fun!").setThumbnail(member.user.displayAvatarURL));
	member.send("**Oh hey there! Seems like you've joined our server!** What now? ... \n\nHead over into *#general-chat* , talk to everyone , don't be shy! \nTalk to our super funny bot , in #talk-to-the-human , but before , read #how-to-talk-to-human.\nListen to some music in #music-center , have some fun.\nWhat about me , try my features in #bot-playground !\nGet yourself some amazing roles in #role-self-assign.\nAs well as you can participate in projects!");

});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


