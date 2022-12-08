const fs = require('fs');
module.exports = {
  name: 'add',
  moderatorsOnly: true,
  cooldown: 0,
  usage: '<commandName> <text>',
  execute(client, channel, tags, args) {
    // Format arguments
    const newCommandName = args.shift().toLowerCase();
    const newCommandText = args.join(' ');

    // Handle errors
    if (newCommandText === '' || newCommandName === '') throw 'Syntax error.';
    if (commands.has(newCommandName)) throw 'Command already exists.'

    // Template
    const newCommandCode = `module.exports = {
          name: '${newCommandName}',
          moderatorsOnly: false,
          cooldown: 30,
          execute(client, channel, tags, args, commands, database) {
            client.action(channel,  \`: ${newCommandText}   |   🚫 30s\`)
            }
          }`;

    AddCommand();
    async function AddCommand() {
      await fs.writeFileSync(`./commands/text/${newCommandName}.js`, newCommandCode);
      client.action(channel, `: La commande !${newCommandName} a été ajoutée !`);
      client.reloadCommands();
    }
  }
}