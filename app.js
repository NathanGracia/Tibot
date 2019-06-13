var tmi = require('tmi.js');

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "thetibot",
        password: "oauth:gyp1flkylad2vf21stre6buv2zbs73"
    },
    channels: ["tiboy590"]
};
var client = new tmi.client(options);
client.connect();
client.on('chat', function(channel, user, message, self){
var words = message.split(' ');
    switch(words[0]){
            case "!salut" :
            if(isBroadcaster(user)){
                client.say(channel, "Vous voilà de retour, maître " + user['display-name']);
            }
            
            else{
                if(isSubscriber(user)){
                    client.say(channel, "Bonjour, messir  " + user['display-name']);
                    }
                else{
                    client.say(channel, "Bonjour à toi " + user['display-name']);}
            }
            break;
            case "!fb" || "!facebook" :
            client.say(channel, "Lien de ma page facebook : https://www.facebook.com/Tiboy59-1471643269754828/ '");
            break;
            case "!discord" :
            client.say(channel, "Rejoignez la team Tiboy sur discord ! Giveway gratuis toute les semaines, concour et un max de conneries LUL https://discord.gg/w2yKvkn ");
            break;
            case "!facebook" :
            client.say(channel, "Lien de ma page facebook : https://www.facebook.com/Tiboy59-1471643269754828/ '");
            break;
            case "!musique" :
            client.say(channel, "Vous pouvez proposez des musiques avec !sr <NomDeLaMusique> WAW C EST INSANE");
            break;
            case "!loto" :
            if(isModerator(user) || isBroadcaster(user) ){
                if(words[1] != null){
                    client.say(channel, "On lance un loto ! Le nombre à trouver est entre 0 et " + words[1] + " !" );
                    startLoto(words[1]);
                }
                else{
                    client.say(channel, "Veuillez indiquer le nombre maximum avec !loto <max>" );
                }
            }
            else{
                client.say(channel, user['display-name'] + " demande un Loto !" );
            }
                
            break;


    }
   


});
client.on('connected', function(adress, port) {
    //console.log("Adress: " + adress + " Port: " + port);
    client.action("tiboy590", "Me voilà connecté au chat PogChamp !");
 
});
function isSubscriber(user){
    return user.subscriber;
}
function isModerator(user){
    return user.mod;
}
function isBroadcaster(user){
    return user.badges.broadcaster == '1';
}
function startLoto(max){
    win_number = getRandomInt(max);
    client.say("tiboy590", win_number + " win number" );
    client.on('chat', function(channel, user, message, self){
        if(parseInt(message) == win_number){
            client.say(channel, "Jebaited " + user['display-name'] + " viens de gagner le Loto ! PogChamp " );
        }
    })
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }