module.exports = {
  name: 'roulette',
  moderatorsOnly: false,
  cooldown: 180,
  execute(client, channel, tags, args) {
    if (tags.mod) return;
    const randInt = Math.floor(Math.random() * (6 + 1) + 1);
    if (randInt != 6) return client.action(channel, ': Tu as de la chance...');
    client.action(channel, 'Ahah, perdu !');
    client.timeout(channel, tags.username, 90, "Roulette");
  }
}