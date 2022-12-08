const axios = require('axios');
const {
  bearer,
  clientId
} = require('../../config.json')
module.exports = {
    name: 'addgame',
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
            console.log(currentGame);
            const doc = {
                name: currentGame,
                description: `${args.join(' ')}`
            };
            // Check if description exists
            const databaseEntry = await client.dbFind('games', currentGame)
            if (databaseEntry[0]) return client.action(channel, ': La description du jeu existe déjà ! Utilise !editgame');

            client.dbAdd("games", doc);
            client.action(channel, `: La description pour ${currentGame} a bien été ajoutée ${tags['display-name']} !`);
        }
        AddGame();
    }
}