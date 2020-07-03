module.exports = (message) => {
    return message.channel.send("**Pong!** My ping is *"+(Date.now()-message.createdTimestamp|0)+" ms*!");
};