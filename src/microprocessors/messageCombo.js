module.exports = (message, global) => {
    if(!message.author.messageCombo) message.author.messageCombo = 1;
    if(message.author.messageCombo >= 20){
        message.author.messageCombo = 0;
        global.info.load(message.author.id).then(data => {
            const c = data;

            if(!c.firstMessage) c.firstMessage = Date.now();

            if(Date.now() - c.firstMessage > 86400000) {
                c.firstMessage = Date.now();

                const t = (c.messageAveragePerDay + c.messagesSentToday) / 2;
                c.messageAveragePerDay = t;
                c.messagesSentToday = 0;
            };

            c.messagesSentToday += 20;
            c.messagesEverSent += 20;

            global.info.save(message.author.id.c);
        });
    };
};