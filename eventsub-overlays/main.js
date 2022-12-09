const {
    overlaysToken
} = require('../config.json')
const {
    app,
    BrowserWindow
} = require('electron');
const axios = require('axios')
const http = require('http');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    })
    win.loadFile('main.html')
};

app.whenReady().then(() => {
    createWindow()
});

const ngrok = require('ngrok');
(async function () {
    const url = await ngrok.connect(3000);
    console.log(url);
    await axios.post('https://ed46-79-88-242-127.eu.ngrok.io', {
        url: url
    }, {
        headers: {
            'data-type': 'ngrok-url',
            'Authorization': overlaysToken
        }
    }).catch(function (error) {
        console.log(error);
    });
})();


const server = http.createServer((request, response) => {
    const eventType = request.headers['event-type']
    if (!eventType) return;
    let chunks = [];
    request.on("data", (chunk) => {
        chunks.push(chunk);
    });
    request.on("end", () => {
        const data = Buffer.concat(chunks);
        const querystring = data.toString();
        const parsedData = new URLSearchParams(querystring);
        const dataObj = JSON.parse(parsedData.keys().next().value);
        // POLL
        if (eventType == 'poll.begin') return PollBegin(dataObj, response);
        if (eventType == 'poll.progress') return PollProgress(dataObj, response);
        if (eventType == 'poll.end') return PollEnd(dataObj, response);
        // PREDICTION
        if (eventType == '') return PredictionBegin(dataObj, response);
        if (eventType == '') return PredictionProgress(dataObj, response);
        if (eventType == '') return PredictionEnd(dataObj, response);
        if (eventType == 'lock') return PredictionLock(dataObj, response);
        // GOAL
        if (eventType == '') return GoalBegin(dataObj, response);
        if (eventType == '') return GoalProgress(dataObj, response);
        if (eventType == '') return GoalEnd(dataObj, response);
        // HYPE-TRAIN
        if (eventType == '') return HypeTrainBegin(dataObj, response);
        if (eventType == '') return HypeTrainProgress(dataObj, response);
        if (eventType == '') return HypeTrainEnd(dataObj, response);
    });
});

server.listen(3000, () => {
    console.log("Server is running on Port 3000");
});

function PollProgress(data, res) {
    var itemsList = '';
    for (let i = 0; i < data.choices.length; i++) {
        const element = data.choices[i];
        const percent = parseInt(element.votes * (100 / data.total));
        const widthPx = 450 * percent / 100;
        itemsList += `
            <li>
                <div width="${widthPx}px">
                    <p>${element.title}</p>
                </div>
            </li>`
    }
    var fs = require('fs');
    var htmlContent = `<!DOCTYPE html>
        <html lang="fr">

        <head>
            <meta charset="UTF-8">
            <title>Twitch poll</title>
            <link href="poll.css" rel="stylesheet">
        </head>

        <body>
            <main>
                <h1>Sondage en cours : ${data.title}</h1>
                <ul>
                    ${itemsList}
                </ul>
            </main>
            <script src="poll.js"></script>
        </body>

        </html>`;
    fs.writeFile('./overlays/poll.html', htmlContent, (error) => {
        console.error();
    });
    res.end()
}