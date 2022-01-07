const http = require('http');
const server = http.createServer();
server.listen(9898);

//Création du websocket qui utilise le serveur qui a été créé
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});

const commandDispatcher = require("commanddispatcher/CommandDispatcher").getInstance();

// Message de validation de l'ouverture du serveur
console.log('Serveur ouvert')

// Mise en place des événements WebSockets
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);

    // Reception d'un message
    connection.on('message', function (message) {
        console.log(message);
        // On récupère la partie utf8Data du message reçu
        let messageParsed = JSON.parse(message.utf8Data);

        commandDispatcher.dispatch(messageParsed.command, messageParsed, connection);
    });

    // Déconnexion d'un joueur
    connection.on('close', function (reasonCode, description) {
        console.log('Connection perdue');
    });
});


//Base de données
// JSON Schema des données communiquées avec la base de données
