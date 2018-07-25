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
        Description: "Laptop",
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
        session.endConversation("Have a good day!")
    }
]).set('storage', inMemoryStorage);

var low = {
    "Work": {
        laptops: "Lenovo"
    },
    "Gaming": {
        laptops: "OptionCategory2"
    },
    "Art": {
        laptops: "OptionCategory3"
    }
}

var mid = {
    "Work": {
        laptops: "Lenovo"
    },
    "Gaming": {
        laptops: "OptionCategory2"
    },
    "Art": {
        laptops: "OptionCategory3"
    }
}

var high = {
    "Work": {
        laptops: "Lenovo"
    },
    "Gaming": {
        laptops: "OptionCategory2"
    },
    "Art": {
        laptops: "OptionCategory3"
    }
}

bot.dialog('Hardware', [
    function(session, results){
        session.send("Awesome - let me ask you a few questions so that we can find the perfect Microsoft Product for you!")
        builder.Prompts.number(session, "What is your ideal price?");
    },
    function(session, results, next){
        session.dialogData.price = results.response;
        session.send("Your ideal price is " + session.dialogData.price)
        if (results.response){
            builder.Prompts.choice(session, "Will you primarily use this device for gaming, work, or art?", "Work|Gaming|Art", { listStyle: 3 });
        }
    },
    function(session, results) {
        session.send("We recommend one of the following")
        session.dialogData.choice = results.response.entity;

        if(session.dialogData.price < 1000){
            session.send(low[session.dialogData.choice].laptops);
        } else if (session.dialogData.price >= 1000 && session.dialogData.price < 2000){
            session.send(mid[session.dialogData.choice].laptops);
        } else {
           session.send(high[session.dialogData.choice].laptops)
        }
        session.endConversation("Thank you!")
    }
])
.triggerAction({
    matches: /^hardware$/i,
    confirmPrompt: "This will cancel our chat. Are you sure?"
});

