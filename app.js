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
    logs("<"+ user["display-name"] + "> " + message, true)
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
                    client.say(channel, "Bonjour, messire  " + user['display-name']);
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
                   var chat ="On lance un loto ! Le nombre à trouver est entre 0 et " + words[1] + " !";
                   var gold = 0;
                    if(words[2]  > 0){
                        gold = words[2];
                        console.log(words[2] + " ===" + gold)
                        
                        chat = chat + " Il y'a "+ words[2] + " golds en jeu !";
                        
                    }
                startLoto(parseInt(words[1]),gold);
                    client.say(channel, chat );
                }
                
                else{
                    client.say(channel, "Veuillez indiquer le nombre maximum et le nombre de gold (facultatif) avec !loto <max> <golds>" );
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

function startLoto(max, gold){
    lotoStarted = true;
    win_number =  getRandomInt(max);
    min = 0;
    logs("Loto démaré avec max ="+max + " et win_number = "+ win_number)
    var reduce = setInterval(function(){
        if(lotoStarted){
        var med = Math.round(((max-min) /2)+min);
        
        if(min <= win_number & win_number < med){
            max = med;
            
        }else{
            min = med;
            
        }
        logs("Nouvelle fourchette : min ="+min + "  max =" + max)
        client.say("tiboy590", "Le chiffre à trouver est entre " + min + " et " + max);}
    }, 60000);
   
    var subOnly = true;
    var ms = 60000;
    var subOnlyOFfTimer = setTimeout(function(){
        if(lotoStarted){
        subOnly = false;
        logs(" Fin du sub only loto apres" + ms/1000 + "secondes")
        client.say(channel, "PogChamp " +" Le loto est reservé aux sub durant les "+ ms/1000 +" premieres secondes!" );}
    }, ms);

    client.on('chat', function(channel, user, message, self){
        if( subOnly != false & isSubscriber(user)== false & self == false & lotoStarted == true){
            
            client.say(channel, "NotLikeThis " + user['display-name'] + " Le loto est reservé aux sub durant les "+ ms/1000 +" premieres secondes!" );
        }else if(lotoStarted == true){
            if(parseInt(message) == win_number){
                var chat = "Jebaited " + user['display-name'] + " viens de gagner le Loto ! PogChamp " ;
                
                if( gold > 0){
                    console.log("golds : "+gold)
                    chat = chat +"Il gagne donc les "+ gold + " pieces d'or !" ;
                    addGold(user,gold);
                }
                client.say(channel, chat);
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
        for(var i= 0; i < 3; i++)
        {
            send_message += " Numero : " + (i+1) + " : " + result[i].name + "(" + result[i].gold + " po )     ";
        }
        client.say(channel, send_message);
    });
  
}

function checkUserExist(user){
    
    var query = "SELECT * FROM test WHERE name = '"+ user['display-name'] +"'";
   
    bdd.query(query, function (mysqlError, result, fields) {
        var exist= "banane";
        if (mysqlError) throw mysqlError;
        
        if(result[0] == null){
            
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
    
    var query = "INSERT INTO test (name) VALUES ('"+ user['display-name']+"')";

    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        logs("Nouvel utilisateur enregistré ! : " + user['display-name'], false );
        logs(result.affectedRows +" requete(s) lancées", false);

    });
}
// GOLD methods --------------------------------------------------------------------------------------------------------------------------------------------------
function addGold(user, gold_amount) {
    //console.log("addGold("+ user["display-name"]+"," + gold_amount +")");
   
    var query = "UPDATE test SET gold = gold +"+gold_amount+" WHERE name = '"+ user["display-name"]+"'";
    logs(query, false);
    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
     
           
    });
  
}

function getMyGold(user){
    var query = "SELECT * FROM test WHERE name = '"+ user['display-name'] +"'";
    logs(query, false);
    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        if(result[0]){
        client.say(channel, "Messir " + user['display-name'] + ", vous avez " + result[0].gold + " pieces d'or ! BloodTrail " );
        }
    });
}

// Write logs ------------------------------------------------------------------------------------------------------------------------------------------------------------------


const fs = require('fs');
var os = require("os");


function logs(string, chat){
    var now = new Date();
    var annee   = now.getFullYear();
    var mois    = now.getMonth() + 1;
    if (mois < 10){
        mois = "0" + mois;
    }
    var jour    = now.getDate();
    var heure   = now.getHours();
    if (heure < 10){
        heure = "0" + heure;
    }
    var minute  = now.getMinutes();

    if (minute < 10){
        minute = "0" + minute;
    }
    var seconde = now.getSeconds();
    if (seconde < 10){
        seconde = "0" + seconde;
    }
    if(chat == false){
        string ="###"+ string;
    }
    var text = "[" + +jour+"/"+mois+"/"+annee+"] [" + heure +":" + minute +"] "+string ;
    fs.appendFile("logs.txt", text +os.EOL, function (err) {
        if (err) throw err;
        
    })
}