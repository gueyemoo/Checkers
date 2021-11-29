const http = require('http');
const server = http.createServer();
server.listen(9898);

//Création du websocket qui utilise le serveur qui a été créé
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});
console.log('Serveur ouvert') // Message de validation de l'ouverture du serveur

// Mise en place des événements WebSockets
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);

    // Action à la réception d'un message
    connection.on('message', function (message) {

        // console.log('Message reçu');
        /*
        * Message de test
        * pour voir si le serveur a bien reçu le message qui lui a été envoyé
        */

        // On récupère la partie utf8Data du message reçu
        let messageParsed = JSON.parse(message.utf8Data);

        /*
        * Pour faire la comparaison, on définit des variables locales
        * sLoging sera associé au login fourni dans le message reçu
        * sMdp sera associé au mot de passe fourni dans le message reçu
        */
        let sLogin = messageParsed.login;
        let sMdp = messageParsed.mdp;

        // On définit un booléen auth, initié à false pour gérer l'authentification
        let auth = false;

        /*
        * On définit une boucle for
        * pour vérifier si le login et le mot de passe fourni
        * existent dans la base de données
        */
        for (var i = 0; i < validUsers.length; i++) {
            if ((validUsers[i].login == sLogin) && (validUsers[i].mdp == sMdp)) {
                /*
                * Si les valeurs fournies existent dans la base de données
                * auth= true : on est connecté
                * On informe le client que l'authentification est réussie avec connection.send()
                */
                auth = true;
                connection.send('Authentification réussie');
                // console.log('Message envoyé');
                /*
                * Message de test
                * pour voir si le serveur a bien envoyé le message
                */
            }
        }
        /*
        * Si on n'est pas bon au niveau des valeurs fournies
        * on doit notifier le client que l'authentification n'a pas abouti
        * Nous gérons cette authentification avec la valeur de auth, inchangée
        * vu qu'on n'est pas rentré dans la boucle précédente, qui modifie la valeur de auth.
        */
        if (auth == false) {
            connection.send('Authentification impossible');
        }
    });

    // Action à la fermeture du browser
    connection.on('close', function (reasonCode, description) {
        console.log('Connection perdue');
    });
});


//Base de données
// JSON Schema des données communiquées avec la base de données
