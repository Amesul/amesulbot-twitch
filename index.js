const {
  channelNames,
  token,
  mongoUrl
} = require("./config.json");
const {
  MongoClient
} = require('mongodb');
const fs = require('fs');
const tmi = require('tmi.js');
const http = require('http')

const commands = new Map();
const events = new Map();
const cooldowns = new Map();

// Add new method "Reload commands"
tmi.Client.prototype.reloadCommands = function reloadCommands() {
  // Clear map
  commands.clear();
  const commandFolders = fs.readdirSync('./commands').filter(folder => !folder.endsWith('.DS_Store'));
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      delete require.cache[file]
      const commandName = file.split('.')[0];
      const command = require(`./commands/${folder}/${file}`)
      commands.set(commandName, command);
    }
  }
  // Clear file cache
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key]
  });
}

// Add new method "Reload events"
tmi.Client.prototype.reloadEvents = function reloadEvents() {
  events.clear();
  const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    delete require.cache[file]
    const eventName = file.split('.js')[0];
    const event = require(`./events/${file}`)
    events.set(eventName, event);
  }
  // Clear file cache
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key]
  });
}

// Add new method "Find database item"
tmi.Client.prototype.dbFind = async function dbFind(coll, item) {
  const dbClient = new MongoClient(mongoUrl);
  var document;
  try {
    await dbClient.connect();
    const db = dbClient.db('AmesulBot').collection(coll);
    if (item) {
      document = await db.find({
        name: item
      }).toArray();
    } else {
      const count = await db.countDocuments({
        validate: true
      });
      const randInt = Math.floor(Math.random() * count + 1);
      await db.find({
        validate: true
      }).limit(-1).skip(randInt).next().then(e => document = e);
    }
    return document;
  } catch (e) {
    console.error(e);
  }
  dbClient.close();
}

// Add new method "Add document"
tmi.Client.prototype.dbAdd = async function dbAdd(coll, doc) {
  const dbClient = new MongoClient(mongoUrl);
  try {
    await dbClient.connect();
    const db = dbClient.db('AmesulBot').collection(coll);
    await db.insertOne(doc);
  } catch (e) {
    console.error(e);
  }
  dbClient.close();
}

// Add new method "Edit document"
tmi.Client.prototype.dbEdit = async function dbAdd(coll, doc, editedDoc) {
  const dbClient = new MongoClient(mongoUrl);
  try {
    await dbClient.connect();
    const db = dbClient.db('AmesulBot').collection(coll);
    await db.updateOne({
      name: editedDoc
    }, {
      $set: doc
    }, {
      upsert: true
    });
  } catch (e) {
    console.error(e);
  }
  dbClient.close();
}

// Twitch client
const client = new tmi.Client({
  options: {
    debug: true
  },
  identity: {
    username: 'amesulbot',
    password: token
  },
  channels: channelNames
});
client.connect();
// Client join message
client.on("connected", (_address) => {
  const debugMode = client.getOptions().options.debug;
  if (debugMode) return;
  channelNames.forEach(channel => {
    client.action(channel, 'est connecté !');
  });
});

// COMMAND HANDLING
client.reloadCommands();
client.on('message', (channel, tags, message, self) => {
  const isMod = tags.mod || tags.username == 'amesul';
  if (self || !message.startsWith('!')) return;
  const args = message.slice(1).split(' ');
  const command = commands.get(args.shift().toLowerCase());
  if (command === undefined) return;
  if (cooldowns.has(command.name) && !isMod) return;
  if (command.moderatorsOnly && !isMod) return;
  try {
    command.execute(client, channel, tags, args);
  } catch (e) {
    client.action(channel, `: ${e} Use !${command.name} ${command.usage || ''}`);
  }
  cooldowns.set(command.name, '');
  setTimeout(() => {
    cooldowns.delete(command.name);
  }, command.cooldown * 1000);
});

// EVENTSUB
client.reloadEvents();
const server = http.createServer((request, response) => {
  const token = (request.headers.authorization) === 'Bearer gfQqnqLSUgPGH0SJRx532lXmAmj96E';
  if (!token) return;
  const dataType = (request.headers['data-type'])
  let chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", () => {
    const data = Buffer.concat(chunks);
    const querystring = data.toString();
    const parsedData = new URLSearchParams(querystring);
    const dataObj = JSON.parse(parsedData.keys().next().value)
    if (dataType === 'twitch-event') {
      const eventType = dataObj.event.slice(8);
      const eventDetails = dataObj.twitchEvent
      const event = events.get(eventType);
      if (event == undefined) return;
      try {
        event.execute(client, 'amesul', eventDetails)
      } catch (e) {
        console.log(e);
      }
    }
    if (dataType === 'ngrok-url') {
      const data = {
        "ngrokTunnelUrl": dataObj.url
      };
      fs.writeFileSync('./events/url.json', JSON.stringify(data))
    }
    response.end();
  });
});

server.listen(9000, () => {
  console.log("Server is running on Port 9000");
});