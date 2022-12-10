module.exports = {
    execute(client, channel, event) {
        console.log(event);
        const user = event.user_name;
        const amount = event.bits;
        client.say(channel, `: Merci beaucoup pour les ${amount} bits ${user} !`);
    }
}