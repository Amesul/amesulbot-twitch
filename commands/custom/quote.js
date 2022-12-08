module.exports = {
    name: 'template',
    moderatorsOnly: false,
    cooldown: 0,
    execute(client, channel, tags, args) {
        async function GetQuote() {
            const document = await client.dbFind('quotes', null);
            client.action(channel, `: ${document.quote}`);
        }
        async function AddQuote() {
            const doc = {
                quote: `${args.join(' ')}`,
                validate: false
            };
            client.dbAdd("quotes", doc);
            client.action(channel, `: La citation a bien été ajoutée ${args.username} ! Elle sera étudiée par la modération rapidement.`);
        }
        if (args[0]) AddQuote();
        else GetQuote();
    }
}