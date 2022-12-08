const axios = require('axios');
const {
    bearer,
    clientId
} = require('../../config.json')
module.exports = {
    name: 'editgame',
    moderatorsOnly: true,
    cooldown: 0,
    usage: '<description>',
    execute(client, channel, tags, args) {
        if (!args[0]) throw 'Syntax error.';
        async function AddGame() {
            // Get current stream category
            const gameRes = await axios({
                method: 'GET',
                url: 'https://api.twitch.tv/helix/channels?broadcaster_id=170815359',
                headers: {
                    'Authorization': bearer,
                    'Client-Id': clientId
                }
            })
            if (!gameRes.data.data[0]) return client.action(channel, `: La catégorie n\'a pas pu être récupérée !`);
            const currentGame = gameRes.data.data[0].game_name;
            const doc = {
                description: `${args.join(' ')}`
            };
            client.dbEdit("games", doc, currentGame);
            client.action(channel, `: La description pour ${currentGame} a bien été modifiée ${tags['display-name']} !`);
        }
        AddGame();
    }
}