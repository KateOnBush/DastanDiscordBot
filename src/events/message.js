module.exports = async (message, global) => {

    // ? Global checks

    if (message.channel.type === "dm") return;
    //If bot has sent the message
    if (message.author.bot) return;

    // ! Microprocessors

    global.modules.microprocessors.debug(message);
    global.modules.microprocessors.checkInfo(message, global);
    global.modules.microprocessors.membership(message, global);
    global.modules.microprocessors.messageCombo(message, global);

    // ! Commands below

    //If wrong channel
    if(message.channel.id != "728025726556569631") return;
    //If in dms

    //Try to find a command
    const command = require('../../commands')
        .find(c => c.inputs
            .some(i => (
                (message.content.toLowerCase().startsWith(`+${i}`) && !c.mod) || (message.content.toLowerCase().startsWith(`+${i}`) && c.mod)
            ))
        );

    if (command) global.modules[command.file](message, global);
};