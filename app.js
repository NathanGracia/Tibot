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
var lotoStarted = false;
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
            case "!fb" :
            client.say(channel, "Lien de ma page facebook : https://www.facebook.com/Tiboy59-1471643269754828/ '");
            break;
            case "!discord" :
            client.say(channel, "Rejoignez la team Tiboy sur discord ! Giveway gratuis toute les semaines, concour et un max de conneries LUL https://discord.gg/w2yKvkn ");
            break;
            case "!facebook" :
            client.say(channel, "Lien de ma page facebook : https://www.facebook.com/Tiboy59-1471643269754828/ '");
            break;
            case "!twitter" :
            client.say(channel, "Lien de mon twitter : https://twitter.com/Tiboy590 ");
            break;
            case "!musique" :
            client.say(channel, "Vous pouvez proposez des musiques avec !sr <NomDeLaMusique> WAW C EST INSANE");
            break;
            case "!loto" :
            if(isModerator(user) || isBroadcaster(user) ){
                if(words[1] != null){
                    client.say(channel, "On lance un loto ! Le nombre à trouver est entre 0 et " + words[1] + " !" );
                    startLoto(parseInt(words[1]));
                }
                else{
                    client.say(channel, "Veuillez indiquer le nombre maximum avec !loto <max>" );
                }
            }
            else{
                client.say(channel, user['display-name'] + " demande un Loto !" );
            }
            break;
            case "!lul" :
            var i = 0;
            var lul = setInterval(function(){
                i++
                if(i >2){
                    clearInterval(lul);
                }
                client.say(channel, "LUL" );
            }, 500);
            break;
            case "!oula" :
            var i = 0;
            var oula = setInterval(function(){
                i++
                if(i >2){
                    clearInterval(oula);
                }
                client.say(channel, "tiboy5Oula " );
            }, 500);
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
    if(user != null){
    return user.badges.broadcaster == '1';}
    else {
        return false;
    }
}
function startLoto(max){
    lotoStarted = true;
    win_number =  getRandomInt(max);
    min = 0;
    var reduce = setInterval(function(){
        var med = ((max-min) /2)+min;
        console.log("min : "+min)
        console.log("med : "+med)
        console.log("max : "+max)
        console.log("nb : "+ win_number)
        if(min <= win_number & win_number < med){
            max = med;
            console.log("min  ")
        }else{
            min = med;
            console.log("max  ")
        }
        client.say("tiboy590", "Le chiffre à trouver est entre " + min + " et " + max);
    }, 5000);
   
    var subOnly = true;
    console.log(subOnly)
    var subOnlyOFfTimer = setTimeout(function(){
        subOnly = false;
        console.log(subOnly)
    }, 10000);

    client.on('chat', function(channel, user, message, self){
        if( subOnly != false & isSubscriber(user)== false & self == false & lotoStarted == true){
            console.log(subOnly)
            client.say(channel, "NotLikeThis " + user['display-name'] + " Le loto est reservé aux sub durant les 10 premieres secondes!" );
        }else if(lotoStarted == true){
            if(parseInt(message) == win_number){
                client.say(channel, "Jebaited " + user['display-name'] + " viens de gagner le Loto ! PogChamp " );
                clearInterval(reduce);
                lotoStarted = false;
                return;
            }
            if(message == "!c'estquoilareponse"){
                client.say(channel, "Le chiffre gagnant du loto est : " + win_number);
            }
            return;

        }else{
            return;
        }return;
    })


}



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }