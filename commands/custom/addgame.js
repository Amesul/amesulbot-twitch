// const superagent = require('superagent');
// module.exports = {
//     name: 'addgame',
//     moderatorsOnly: true,
//     cooldown: 0,
//     usage: '<description>',
//     execute(client, channel, tags, args) {
//         if (!args[0]) throw 'Syntax error.';
//         async function AddGame() {
//             var currentGame;
//             // Get current stream category
//             await superagent.get('https://api.twitch.tv/helix/channels?broadcaster_id=170815359')
//                 .set('Authorization', 'Bearer 2gtne1hel59bkoh2foy057ndmacyw8')
//                 .set('Client-Id', 'gp762nuuoqcoxypju8c569th9wz7q5')
//                 .then((res) => {
//                     currentGame = res.body.data[0].game_name;
//                 });
//             const doc = {
//                 name: currentGame,
//                 description: `${args.join(' ')}`
//             };

//             // Check if description exists
//             const databaseEntry = await client.dbFind('games', currentGame)
//             if (databaseEntry[0]) return client.action(channel, ': La description du jeu existe déjà ! Utilise !editgame');

//             client.dbAdd("games", doc);
//             client.action(channel, `: La description pour ${currentGame} a bien été ajoutée ${tags['display-name']} !`);
//         }
//         AddGame();
//     }
// }