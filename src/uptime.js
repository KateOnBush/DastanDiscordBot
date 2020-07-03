module.exports = (message) => {
    return message.channel.send("I've been up for **" +((client.uptime/1000)|0)+"** seconds!");
};