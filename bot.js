//Modules
const Discord = require('discord.js');
const client = new Discord.Client();
const loadModules = require('./loadModules');

// ! Global variable
let global = {
	modules: loadModules(),		//Node modules
	info: require('./info'), 	//Infos
	membershipRoles: [ "728214239784861776", "728214473638412310", "728214612222410784", "728214677578055713", "728214723182723183", "728214892187746365" ],
};
global._global = global;

// ? Triggered when recieving a messsage
client.on('message', message => global.modules.events.message(message, global));

// ? Triggered when member joins the server
client.on('guildMemberAdd', member => global.modules.events.guildMemberAdd(member));

// ? Login to discord
client.login(process.env.BOT_TOKEN);