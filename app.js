var tmi = require('tmi.js');
const notifier = require('node-notifier');
const path = require('path');


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
//var x = setInterval(function(){
//    client.say(channel, "Vous ");
//}, 10000);
bdd.connect(function(mysqlError) {
    if (mysqlError) throw mysqlError;
    console.log("Connecté à la BDD !")
    

});
client.connect();
client.on('chat', function(channel, user, message, self){
    logs("<"+ user["display-name"] + "> " + message, true)
    let kiwi = message.indexOf('kiwi');
  
    if(kiwi >= 0){
            logsKiwi("<"+ user["display-name"] + "> " +message, true)
    }
//Ajoute des golds
if(self == false){

    //verifie si l'utilisateur existe, si non en créé un
    if(checkUserExist(user) == false){
        
    }else{
        if(user.badges == null){
            user.badges = { viewer: '1' }
        }
    //ajoute des golds à l'utilisateur en bdd
    addGold(user['display-name'],1);


    var words = message.split(' ');
    switch(words[0]){

            case "!salut" :
            if(isBroadcaster(user)){
                client.say(channel, "Vous voilà de retour, maître " + user['display-name']);
            }
            
            else{
                if(isSubscriber(user)){
                    client.say(channel, "Bonjour, messire  " + user['display-name'] +" HSCheers ");
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
            case "!give" :
            if(isBroadcaster(user) || isModerator(user)){
              if(words[1] &&  words[2]){
                words[1] = words[1].replace('@','')
                  addGold(words[1], words[2])
                  client.say(channel, words[1]+" obtiens "+words[2]+ " golds PogChamp");
              }
              else{
                client.say(channel, user['display-name']+" essaie plutot avec !give DeusKiwi 200 HSCheers");
              }
            }
            
            else{
               
                    client.say(channel, "Hop hop hop, seul les modos tout puissants peuvent donner des golds");
            }
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
            case "!defi" :
            showDefi();
            break;
            case "!donner" :
            if(words[1] != null){
                giveDefi(user,words[1])
             }
             
             else{
                 client.say(channel, "Veuillez indiquer le nombre de golds que vous voulez donner avec !donner <golds>" );
             }
         
            break;
            case "!loto" :
            if(isModerator(user) || isBroadcaster(user) ){
                if(words[1] != null){
                   
                   var chat ="On lance un loto ! Le nombre à trouver est entre 0 et " + words[1] + " !";
                   var gold = 0;
                    if(words[2]  > 0){
                        gold = words[2];
                        
                        
                        chat = chat + " Il y'a "+ gold + " golds en jeu !";
                        
                    }
                startLoto(parseInt(words[1]),parseInt(gold));
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
    client.action("tiboy590", "Plop Plip");
 
});
// NOTIFICATION ======================================================================================





// DEFI ===========================================================================================================
function showDefi(){
    var query = "SELECT * FROM defi_m WHERE current = 1"
    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        console.log(result.id_defi_m > 0 )
        if(typeof result[0] !== 'undefined' ){
        send_message = "Defi en cour : " + result[0].name+ ". Objectif : " + result[0].amount + "/" + result[0].price +" golds . Donnez avec !donner <gold>";
        client.say(channel, send_message);
        }
        else{
            send_message = "Pas de defi pour l'instant BibleThump . Vous pouvez en proposer sur le discord ! PogChamp";
        client.say(channel, send_message);
        }
    });

}
function giveDefi(user, amount){
    
    var query = "SELECT * FROM defi_m WHERE current = 1";
     
        bdd.query(query, function (mysqlError, result, fields) {
            if (mysqlError) throw mysqlError;
           
            if(typeof result[0] !== 'undefined' ){
                var id_defi = result[0].id_defi_m;
                
                //check si l'user a assez de golds
                var query = "SELECT * FROM test WHERE name = '"+ user['display-name'] +"'";
             
                bdd.query(query, function (mysqlError, result, fields) {
                    if (mysqlError) throw mysqlError;
                        var current_gold = result[0].gold
                    if(current_gold > amount){
                        // enleve les golds de l'utilisateur
                        var new_gold = current_gold - amount;
                        query = "UPDATE test SET gold = "+ new_gold + " WHERE name = '"+ user['display-name'] + "'";
                  
                        bdd.query(query, function (mysqlError, result, fields) {
                            if (mysqlError) throw mysqlError;
                            //ajoute les golds au defi
                            query = "UPDATE defi_m SET amount ="+ amount + "+ amount WHERE  current = TRUE";
                  
                            bdd.query(query, function (mysqlError, result, fields) {
                                if (mysqlError) throw mysqlError; 
                                
                                //ajoute le don dans la liste des donations
                                query = "INSERT INTO donation_defi (name_membre, id_defi_m, amount) VALUES ('"+user["display-name"]+"', '"+id_defi +"',  '"+amount +"')";
                               console.log(query);
                                bdd.query(query, function (mysqlError, result, fields) {
                                    if (mysqlError) throw mysqlError; 
                                    client.say(channel,"HSCheers " +  user["display-name"] + " donne "+ amount + " pieces d'or au defi ! (!defi)" );
                                    checkDefiDone();
                                })
                            })
                        })
                    }
                    else{
                        send_message = "Eh oh "+ user["display-name"] +"! T'as pas assez de thune ! (!gold)";
                        client.say(channel, send_message);
                    }
                });
        }else{
                send_message = "Pas de defi pour l'instant BibleThump . Vous pouvez en proposer sur le discord ! PogChamp";
                client.say(channel, send_message);
            }
        });
}
function checkDefiDone(){
    //select le defi
    query = "SELECT * FROM defi_m WHERE current = 1"
    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        var name_defi = result[0].name;
        console.log(result[0].price);
        console.log(result[0].amount);
            if(result[0].amount >= result[0].price){
                // le passe en off
                query = "UPDATE defi_m SET current = 0 WHERE current = 1"
                bdd.query(query, function (mysqlError, result, fields) {
                    if (mysqlError) throw mysqlError; 
                    var i = 0;
                    var oula = setInterval(function(){
                        i++
                        if(i >2){
                            clearInterval(oula);
                        }
                        client.say(channel, "PogChamp " );
                    }, 500);
                    send_message = "Le defi \""+ name_defi + "\" viens d'être completé !!!";
                    client.say(channel, send_message);
                })
            }
    });
}

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
    console.log('tac')
    var amount_given = gold;
    
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
        client.say(channel, "PogChamp " +" Les "+ms/1000+ " sont passées ! Tout le monde peut participer !" );}
    }, ms);
   
    client.on('chat', function(channel, user, message, self){
        if(lotoStarted == false){
            return;
        }
        if( subOnly != false & isSubscriber(user)== false & self == false & lotoStarted == true){
            
            client.say(channel, "NotLikeThis " + user['display-name'] + " Le loto est reservé aux sub durant les "+ ms/1000 +" premieres secondes!" );
        }else if(lotoStarted == true & self == false){
                     console.log("message : "+message)
                   console.log("gold 1 : "+gold)
         
            if(parseInt(message) == win_number){
                var chat = "Jebaited " + user['display-name'] + " viens de gagner le Loto ! PogChamp " ;
                console.log("gold 2 : "+gold)
                if( amount_given > 0){
                   
                    chat = chat +"Il gagne donc les "+ amount_given + " pieces d'or !" ;
                    addGold(user['display-name'],gold);
                    lotoStarted = false;
                   
                    
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
function loto_2(max, gold){
    lotoStarted = true;
    win_number =  getRandomInt(max);
    min = 0;
    var time_subonly = 60000;
    var subOnly = true;
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

    var subOnlyOFfTimer = setTimeout(function(){
        if(lotoStarted){
        subOnly = false;
        logs(" Fin du sub only loto apres" + time_subonly/1000 + "secondes")
        client.say(channel, "PogChamp " +" Les "+time_subonly/1000+ " sont passées ! Tout le monde peut participer !" );}
    }, time_subonly);

}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

// BDD methods *-----*----------------------------------------------------------------------------------------------------------------------


function getPodium() {
    var query = "SELECT name_membre, SUM(amount) as amount FROM donation_defi WHERE id_defi_m = 4 GROUP BY name_membre ORDER BY SUM(amount) DESC";

    bdd.query(query, function (mysqlError, result, fields) {
        if (mysqlError) throw mysqlError;
        send_message = "Podium des contributions pour le defi :";
     
        
        for(var i= 0; i < 3; i++){
         
          if(typeof result[i] !== 'undefined'){  
              
              send_message += " Numero : " + (i+1) + " : " + result[i].name_membre + " (" + result[i].amount + " po) PogChamp    "
        }
        
        
        
        };
        client.say(channel, send_message);
  
    })
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
function addGold(username, gold_amount) {
    //console.log("addGold("+ user["display-name"]+"," + gold_amount +")");
   
    var query = "UPDATE test SET gold = gold +"+gold_amount+" WHERE name = '"+ username+"'";
    
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

function logs(string, chat){
    if(chat == false){
        string ="###"+ string;
    }
    var name_txt = "./logs/"+jour+"_"+mois+"_"+annee+"_logs.txt";
    var text = "[" + +jour+"/"+mois+"/"+annee+"] [" + heure +":" + minute +"] "+string ;
    fs.appendFile(name_txt, text +os.EOL, function (err) {
        if (err) throw err;
        
    })
}
function logsKiwi(string, chat){
    if(chat == false){
        string ="###"+ string;
    }
    var name_txt = "kiwi_logs.txt";
    var text = "[" + +jour+"/"+mois+"/"+annee+"] [" + heure +":" + minute +"] "+string ;
    fs.appendFile(name_txt, text +os.EOL, function (err) {
        if (err) throw err;
        
    })
}
