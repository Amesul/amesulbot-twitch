const axios = require('axios');
const {
    ngrokTunnelUrl
} = require('./url.json');
module.exports = {
    execute(client, channel, event) {
        axios({
            method: 'post',
            url: ngrokTunnelUrl,
            headers: {
                'Event-Type': 'poll.begin'
            },
            data: {
                title: event.title,
                choices: event.choices,
            }
        });
    }
}