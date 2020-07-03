module.exports = (message, global) => {

    //Return if info checked
    if(message.author.checkInfo) return;

    //Check info
    global.info.check(message.author.id).then(x => {
        if(x) return;
        //Load Info
        global.info.load(message.author.id);
        message.author.checkInfo = true;
    });
};