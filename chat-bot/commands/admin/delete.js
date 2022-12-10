const fs = require('fs');
module.exports = {
  name: 'delete',
  moderatorsOnly: true,
  cooldown: 0,
  usage: '<commandName>',
  execute(client, channel, tags, args) {
    if (args.length > 1) throw 'Syntax error';
    DeleteCommand();
    async function DeleteCommand() {
      try {
        await fs.unlinkSync(`./commands/text/${args}.js`);
        client.reloadCommands();
        client.action(channel, ': La commande a été supprimée !');
      } catch (e) {
        throw 'Command doesn\'t exist.'
      }
    }
  }
}