//Data management
module.exports = {
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