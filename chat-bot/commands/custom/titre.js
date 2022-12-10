const axios = require('axios');
const {
  bearer,
  clientId
} = require('../../config.json')
module.exports = {
  name: 'titre',
  moderatorsOnly: false,
  cooldown: 60,
  execute(client, channel, tags, args) {
    const newTitle = args.join(' ');
    async function GetTitle() {
      const res = await axios({
        method: 'GET',
        url: 'https://api.twitch.tv/helix/channels?broadcaster_id=170815359',
        headers: {
          'Authorization': bearer,
          'Client-Id': clientId
        }
      })
      const currentTitle = JSON.stringify(res.data.data[0].title) || 'Le titre n\'a pas pu être récupéré';
      if (!newTitle) return client.action(channel, `: ${currentTitle}`)

      if (newTitle && !tags.mod && !tags.username == 'amesul') return client.action(channel, `: Tu n'as pas l'autorisation de modifier le titre ${tags['display-name']} !'`)
      if (newTitle && (tags.mod || tags.username == 'amesul')) {
        await axios.patch('https://api.twitch.tv/helix/channels?broadcaster_id=170815359', {
          title: newTitle
        }, {
          headers: {
            'Authorization': bearer,
            'Client-Id': clientId,
            'Content-Type': 'application/JSON'
          }
        })
        .then(res => {
          return client.action(channel, `: Titre modifié (${currentTitle} -> "${newTitle}")`)
        });
      }
    }
    GetTitle();
  }
}