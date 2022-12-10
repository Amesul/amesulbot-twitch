const axios = require('axios');
const {
    bearer,
    clientId
} = require('../config.json')
module.exports = {
    execute(client, channel, event) {
        ShoutOut();
        async function ShoutOut() {
            const username = event.from_broadcaster_user_name;
            const userId = 170815359; //event.from_broadcaster_user_id;
            const viewersCount = event.viewers;
            const followCountRes = await axios({
                method: 'GET',
                url: `https://api.twitch.tv/helix/users/follows?to_id=${userId}`,
                headers: {
                    'Authorization': bearer,
                    'Client-Id': clientId
                }
            });
            const channelGameRes = await axios({
                method: 'GET',
                url: `https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`,
                headers: {
                    'Authorization': bearer,
                    'Client-Id': clientId
                }
            })
            const channelGame = channelGameRes.data.data[0].game_name
            const channelFollowCount = followCountRes.data.total;
            client.action(channel, `: Merci tout plein ${username} pour le raid, et bienvenue aux ${viewersCount} personnes qui nous rejoingnent !`)
            client.say(channel, `/announce Vous ne connaissiez pas ${username} ( ${channelFollowCount} ❤️ ) ? C'est désormais chose faite ! Allez voir sur twitch.tv/${username.toLowerCase()}, la dernière catégorie streamée était ${channelGame}.`)
        }
    }
}