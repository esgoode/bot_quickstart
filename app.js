var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();

var inMemoryStorage = new builder.MemoryBotStorage();

// could do something here to connect to UI
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url); 
});

// setup bot credentials
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var savedAddress;
server.post('/api/messages', connector.listen());

//Could probably put pictures more details here etc
var hardwareSelection = {
    "Surfacebook": {
        Description: "Laptop",
        Price: 1000
    },
    "Surface": {
        Description: "Laptop",
        Price: 1000
    },
    "Surface Go":{
        Description: "Clam Chowder",
        Price: 1000
    }
};

var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response
        var msg = "Hello " + session.userData.name + ". What product are you interested in? Hardware, Software, or Services"
        session.send(msg)
    },
    function (session, results) {
        session.userData.choice = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                     " you're looking for " + session.userData.choice + ".");
    }
]).set('storage', inMemoryStorage);

bot.dialog('Hardware', [
    function(session){
        session.send("Lets checkout Hardware");
        builder.Prompts.choice(session, "Hardware", hardwareSelection);
    }
])
.triggerAction({
    matches: /^hardware$/i,
    confirmPrompt: "This will cancel our chat. Are you sure?"
});