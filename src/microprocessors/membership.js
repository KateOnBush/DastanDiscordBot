module.exports = (message, global) => {
    //Days since user joined
    const days = ((message.member.joinedTimestamp - Date.now()) / (1000*24*3600));
    let change = 0;

    switch(true) {
        case days > 730:
            change = 5;
            break;
        case days > 365:
            change = 4;
            break;
        case days > 182:
            change = 3;
            break;
        case days > 90:
            change = 2;
            break;
        case days > 30:
            change = 1
            break;
    };

    if(message.member.roles.cache.array().find(t => {
        return (t.id == global.membershipRoles[change]);
    }) == undefined) {
        message.member.roles.remove(global.membershipRoles).then(x => {
            x.roles.add(global.membershipRoles[change]);
        });
    };
}