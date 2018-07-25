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

var bot = new builder.UniversalBot(connector, [
    function (session, results) {
        var msg = "Hello! What product are you interested in? Hardware, Software, or Services"
        session.send(msg)
    },
    function (session, results) {
        session.endConversation("-1")
    }
]).set('storage', inMemoryStorage);

var low = {
    "Work": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Gaming": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Art": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    }
}

var mid = {
    "Work": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Gaming": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Art": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    }
}

var high = {
    "Work": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Gaming": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Art": {
        laptops: "-2We recommend the Surfacebook 2 | https://i.imgur.com/AWSKmjt.jpg | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    }
}

bot.dialog('Hardware', [
    function(session, results){
        session.send("Awesome - let me ask you a few questions so that we can find the perfect Microsoft Product for you!")
        session.delay(2500)
        builder.Prompts.number(session, "What is your ideal price?");
    },
    function(session, results, next){
        session.dialogData.price = results.response;

        if (results.response){
            builder.Prompts.choice(session, "Will you primarily use this device for gaming, work, video editing, or graphic design?", "Work|Gaming|Art", { listStyle: 3 });
        }
    },
    function(session, results) {

        session.dialogData.choice = results.response.entity;

        builder.Prompts.text(session, "Please list some features you would like in your device");

    },
    function(session, results) {

        session.dialogData.features = results.response;
        
        session.delay(2500)

        session.send("Given your preferences we recommend the followng: ")

        session.delay(2500)
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

