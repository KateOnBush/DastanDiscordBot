import { MessageEmbed } from 'discord.js';

module.exports = (member) => {
    const welcome_channel = member.guild.channels.find("id", "728008557911605340");
    welcome_channel.send(
        new MessageEmbed()
            .addField("Hey hey hey!", "We've been waiting for you!")
            .setTitle("Welcome " + member.displayName + "!")
            .setThumbnail(member.user.displayAvatarURL())
    );
}