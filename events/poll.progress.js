const axios = require('axios');
const {
    ngrokTunnelUrl
} = require('./url.json');
module.exports = {
    execute(client, channel, event) {
        // console.log(event);
        var total = 0;
        for (let i = 0; i < event.choices.length; i++) {
            const element = event.choices[i];
            total += parseInt(element.votes);
        }
        axios({
            method: 'post',
            url: ngrokTunnelUrl,
            headers: {
                'Event-Type': 'poll.progress'
            },
            data: {
                title: event.title,
                choices: event.choices,
                total: total
            }
        });
    }
}