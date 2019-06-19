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
var lotoStarted = false;
var client = new tmi.client(options);
var mysql = require('mysql');
var channel = "tiboy590";
var bdd = mysql.createConnection({
    host: "sql7.freesqldatabase.com",
    user: "sql7295933",
    password: "KF8ar4qB3S",
    database: "sql7295933"
});

bdd.connect(function(mysqlError) {
    if (mysqlError) throw mysqlError;
    console.log("Connecté à la BDD !")
    

});
client.connect();
client.on('chat', function(channel, user, message, self){
//Ajoute des golds
if(self == false){
    //verifie si l'utilisateur existe, si non en créé un
    if(checkUserExist(user) == false){
        
    }else{
        
    //ajoute des golds à l'utilisateur en bdd
    addGold(user, 1);


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
            case "!podium" :
            getPodium();
            break;
            case "!gold" :
            getMyGold(user);
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
            case "!commandes" :
            client.say(channel, "Le gdoc des commandes : https://docs.google.com/spreadsheets/d/1TRqgZuwRRTFEg046odDFFmfWT_f4vB3nw9P19-Gv0pw/edit?usp=sharing");
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
    }
   
}

});
client.on('connected', function(adress, port) {
    //console.log("Adress: " + adress + " Port: " + port);
    client.action("tiboy590", "Me voilà connecté au chat PogChamp !");
 
});
// LOTO ---------------------------------------------------------------------------------------------------------
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

// BDD methods *-----*----------------------------------------------------------------------------------------------------------------------


function getPodium() {
    var query = "SELECT * FROM test ORDER BY gold DESC";

    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        send_message = "";
        for(var i= 0; i < result.length; i++)
        {
            send_message += " Numero : " + (i+1) + " : " + result[i].name + "(" + result[i].gold + " po )     ";
        }
        client.say(channel, send_message);
    });
  
}

function checkUserExist(user){
    
    var query = "SELECT * FROM test WHERE name = '"+ user['display-name'] +"'";
    console.log('checkUserExist()')
    bdd.query(query, function (mysqlError, result, fields) {
        var exist= "banane";
        if (mysqlError) throw mysqlError;
        
        if(result[0] == null){
            console.log('Joueur pas trouvé')
            exist = false;
            newUser(user)
        }else{
            exist = true;
        }
        ;
        return exist;
    });
  
}

function newUser(user) {
    console.log('newUser();')
    var query = "INSERT INTO test (name) VALUES ('"+ user['display-name']+"')";

    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        console.log("Nouvel utilisateur enregistré ! : " + user['display-name'] );
        console.log(result.affectedRows +" requete(s) lancées");

    });
}
// GOLD methods --------------------------------------------------------------------------------------------------------------------------------------------------
function addGold(user, gold_amount) {
    console.log("addGold("+ user["display-name"]+"," + gold_amount +")");

    var query = "UPDATE test SET gold = gold +"+gold_amount+" WHERE name = '"+ user["display-name"]+"'";
    
    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
     
            console.log("Ajout de golds : " + user['display-name'] +" obtiens " + gold_amount +" golds");
            console.log(result.affectedRows +" requete(s) lancées");
    });
  
}

function getMyGold(user){
    var query = "SELECT * FROM test WHERE name = '"+ user['display-name'] +"'";
   
    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        if(result[0]){
        client.say(channel, "Messir " + user['display-name'] + ", vous avez " + result[0].gold + " pieces d'or ! BloodTrail " );
        }
    });
}
// Write logs ------------------------------------------------------------------------------------------------------------------------------------------------------------------
