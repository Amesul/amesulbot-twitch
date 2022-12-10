const axios = require('axios');
const {
    bearer,
    clientId
} = require('../../config.json')
module.exports = {
    name: 'jeu',
    moderatorsOnly: false,
    cooldown: 60,
    execute(client, channel, tags, args) {
        const newGame = args.join(' ');
        async function GetGame() {
            const gameRes = await axios({
                method: 'GET',
                url: 'https://api.twitch.tv/helix/channels?broadcaster_id=170815359',
                headers: {
                    'Authorization': bearer,
                    'Client-Id': clientId
                }
            })
            const currentGame = JSON.stringify(gameRes.data.data[0].game_name) || 'La catégorie n\'a pas pu être récupérée';
            if (!newGame) {
                var description;
                const document = await client.dbFind('games', JSON.parse(currentGame));
                if (document[0]) description = document[0].description
                else description = 'Impossible de récupérer la description du jeu. Sans doute n\'a-t-elle pas été ajoutée par Amesul... Sonne-lae pour qu\'iel le rajoute !';
                return await client.action(channel, `: ${description}`)
            }

            if (newGame && !tags.mod && !tags.username == 'amesul') return client.action(channel, `: Tu n'as pas l'autorisation de modifier la catégorie ${tags['display-name']} !'`)

            if (newGame && (tags.mod || tags.username == 'amesul')) {
                const idRes = await axios({
                    method: 'GET',
                    url: `https://api.twitch.tv/helix/games?name=${newGame}`,
                    headers: {
                        'Authorization': bearer,
                        'Client-Id': clientId
                    }
                });
                if (!idRes.data.data[0]) return client.action(channel, `La catégorie ${newGame} n'existe pas !`);
                const newGameId = idRes.data.data[0].id
                if (newGameId) {
                    await axios.patch('https://api.twitch.tv/helix/channels?broadcaster_id=170815359', {
                            game_id: newGameId
                        }, {
                            headers: {
                                'Authorization': bearer,
                                'Client-Id': clientId,
                                'Content-Type': 'application/JSON'
                            }
                        })
                        .then(res => {
                            return client.action(channel, `: Catégorie modifiée (${currentGame} -> "${newGame}")`)
                        });
                }
            }
        }
        GetGame();
    }
}