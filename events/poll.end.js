const axios = require('axios');
const {
    ngrokTunnelUrl
} = require('./url.json');
module.exports = {
    execute(client, channel, event) {
        var total = 0;
        const choices = new Map()
        for (let i = 0; i < event.choices.length; i++) {
            const element = event.choices[i];
            choices.set(element.votes, element.id)
            total += parseInt(element.votes);
        }
        const winner = choices.get(Math.max(...choices.keys()))
        console.log(winner);
        axios({
            method: 'post',
            url: ngrokTunnelUrl,
            headers: {
                'Event-Type': 'poll.end'
            },
            data: {
                title: event.title,
                choices: event.choices,
                winner: winner
            }
        });
    }
}