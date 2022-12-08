// const superagent = require('superagent');
// module.exports = {
//   name: 'jeu',
//   moderatorsOnly: false,
//   cooldown: 60,
//   execute(client, channel, tags, args) {
//     const newGame = args.join(' ');
//     var newGameId;
//     var currentGame = 'La catégorie n\'a pas pu être récupérée';
//     async function GetGame() {
//       await superagent.get('https://api.twitch.tv/helix/channels?broadcaster_id=170815359')
//         .set('Authorization', 'Bearer 2gtne1hel59bkoh2foy057ndmacyw8')
//         .set('Client-Id', 'gp762nuuoqcoxypju8c569th9wz7q5')
//         .then((res) => {
//           currentGame = JSON.stringify(res.body.data[0].game_name);
//         });
//       if (!newGame) {
//         var description;
//         const document = await client.dbFind('games', JSON.parse(currentGame));
//         if (document[0]) description = document[0].description
//         else description = 'Impossible de récupérer la description du jeu. Sans doute n\'a-t-elle pas été ajoutée par Amesul... Sonne-lae pour qu\'iel le rajoute !';
//         return await client.action(channel, `: ${description}`)
//       }

//       if (newGame && !tags.mod && !tags.username == 'amesul') return client.action(channel, `: Tu n'as pas l'autorisation de modifier la catégorie ${tags['display-name']} !'`)

//       if (newGame && (tags.mod || tags.username == 'amesul')) {
//         const res = await superagent.get(`https://api.twitch.tv/helix/games?name=${newGame}`)
//           .set('Authorization', 'Bearer 2gtne1hel59bkoh2foy057ndmacyw8')
//           .set('Client-Id', 'gp762nuuoqcoxypju8c569th9wz7q5');
//         if (!JSON.parse(res.text).data[0]) return client.action(channel, `La catégorie ${newGame} n'existe pas !`);
//         newGameId = JSON.parse(res.text).data[0].id
//         if (newGameId) {
//           await superagent.patch('https://api.twitch.tv/helix/channels?broadcaster_id=170815359')
//             .set('Authorization', 'Bearer 2gtne1hel59bkoh2foy057ndmacyw8')
//             .set('Client-Id', 'gp762nuuoqcoxypju8c569th9wz7q5')
//             .set('Content-Type', 'application/JSON')
//             .send(`{"game_id": "${newGameId}"}`)
//             .end((err, res) => {
//               if (err) return console.log(err);
//               return client.action(channel, `: Catégorie modifiée (${JSON.parse(currentGame)} -> ${newGame})`)
//             });
//         }
//       }
//     }
//     GetGame();
//   }
// }