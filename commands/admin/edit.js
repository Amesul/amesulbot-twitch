const fs = require('fs');
module.exports = {
  name: 'edit',
  moderatorsOnly: true,
  cooldown: 0,
  execute(client, channel, tags, args) {
    // Format arguments
    const commandName = args.shift().toLowerCase();
    const newCommandText = args.join(' ')

    // Handle errors
    if (newCommandText === '' || commandName === '') throw 'Syntax error.';

    // Template
    const newCommandCode = `module.exports = {
          name: '${commandName}',
          moderatorsOnly: false,
          cooldown: 30,
          usage: '',
          execute(client, channel, tags, message, database) {
            client.action(channel,  \`: ${newCommandText}   |   🚫 30s\`)
          }
        }`;

    EditCommand();
    async function EditCommand() {
      await fs.unlinkSync(`./commands/text/${commandName}.js`)
      await fs.writeFileSync(`./commands/text/${commandName}.js`, newCommandCode);
      client.action(channel, `: La commande !${commandName} a été modifiée !`)
      client.reloadCommands();
    }
  }
}