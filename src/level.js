import { MessageEmbed } from 'discord.js';

module.exports = (message, global) => {
    return global.info.load(message.author.id).then(data => {
        message.channel.send(new MessageEmbed().setTitle("You are level " + data.level + "!"));
    });
};