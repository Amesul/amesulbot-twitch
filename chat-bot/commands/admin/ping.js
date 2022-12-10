module.exports = {
  name: 'ping',
  moderatorsOnly: true,
  cooldown: 0,
  usage: '',
  execute(client, channel, tags, args) {
    client.ping()
    .then((data) => {
      client.say(channel, 'Your ping is: ' + data*1000 + "ms")
      });
  }
}

