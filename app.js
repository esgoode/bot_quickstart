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
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Gaming": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Art": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    }
}

var mid = {
    "Work": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Gaming": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Art": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    }
}

var high = {
    "Work": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Gaming": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
    },
    "Art": {
        laptops: "type1 We recommend the Surfacebook 2 | https://imgur.com/a/00MG3Xe | https://www.microsoft.com/en-us/p/surface-book-2/8mcpzjjcc98c"
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
            builder.Prompts.choice(session, "Will you primarily use this device for gaming, work, video editing, or graphic design?", "Work|Gaming|Art", { listStyle: 3 });
        }
    },
    function(session, results) {

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

