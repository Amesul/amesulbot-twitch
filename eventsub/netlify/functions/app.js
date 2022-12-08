exports.handler = async (event) => {
    const axios = require('axios').default;
    const {
        headers = []
    } = event;
    const type = headers['twitch-eventsub-message-type'] || undefined;
    if (!type) return {
        statusCode: 204,
        body: ''
    };
    const eventType = headers['twitch-eventsub-subscription-type'];
    const {
        event: twitchEvent
    } = JSON.parse(event.body);

    if (type === 'webhook_callback_verification') {
        const challenge = JSON.parse(event.body).challenge
        return {
            statusCode: 200,
            headers: {
                'Content-Length': 'application/json'
            },
            body: challenge
        };
    };

    if (type === 'notification') {
        await axios.post('https://f36c-79-88-242-127.eu.ngrok.io', {
                event: eventType,
                twitchEvent
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return {
        statusCode: 200,
        body: 'Event received'
    }
};