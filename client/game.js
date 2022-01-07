
const ONLINE = 1;
const LOCAL = 2;

let currentPlayer = 1;
let player_pos = Infinity;
let id_joueur = "";
let game_statut = 0;


function startGameOnline() {
    game_statut = ONLINE;
    if (
        document.getElementById("username").value == "" ||
        document.getElementById("password").value == ""
    ) {
        $("#NoCredential").css("display", "inherit");
    } else {

        ws = new WebSocket("ws://127.0.0.1:9898/");

        //Recupere les valeurs en input de l'utilisateur
        let login_input = document.getElementById("username").value;
        let password_input = document.getElementById("password").value;

        //Mets les valeurs récupéré dans un format json
        let user_json = {
            command: "form_login",
            username: login_input,
            password: password_input,
            keepConnection: false,
        };

        //Transforme en objet Json
        let msg_json = JSON.stringify(user_json);

        // Envoie au serveur sous format json les valeurs saisie par l'utilisateur
        ws.onmessage = function (e) {
            console.log(JSON.parse(e.data));
            let msg = JSON.parse(e.data);

            if (msg.success === true) {
                $("#menu").css("display", "none");
                $("#gameContainer").css("display", "inherit");
            } else {
                $("#msg_retour").html("<p>  " + msg.message + "</p>");
                $("#msg_retour").css("color", "red");
                $("#NoCredential").css("display", "none");
            }

            if (msg.user_id != null) {
                currentPlayer = msg.user_color;
                player_pos = msg.user_color;
                id_joueur = msg.user_id;

                console.log(msg.user_color);
                console.log(id_joueur)
            }
        };
        ws.onopen = () => ws.send(msg_json);
        // console.log(msg_json);
    }
}

function startGameLocal() {
    game_statut = LOCAL;
    $("#menu").css("display", "none");
    $("#gameContainer").css("display", "inherit");
}


$(document).ready(function () {
    let map = [
        [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // 0 : tile blanche vide
        [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // 1 : tile noir vide
        [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // 2 : pion blanc
        [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // 3 : pion noir
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // 20 : dame blanc
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // 30 : dame noir
        [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0, 2, 0]
    ];

    // let map = [
    //     [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // 0 : tile blanche vide
    //     [1, 0, 2, 0, 1, 0, 1, 0, 1, 0], // 1 : tile noir vide
    //     [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // 2 : pion blanc
    //     [30, 0, 1, 0, 3, 0, 1, 0, 1, 0], // 3 : pion noir
    //     [0, 1, 0, 1, 0, 30, 0, 1, 0, 1], // 20 : dame blanc
    //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // 30 : dame noir
    //     [0, 20, 0, 2, 0, 1, 0, 20, 0, 1],
    //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    //     [0, 1, 0, 0, 0, 1, 0, 3, 0, 1],
    //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    // ];

    const EMPTY_WHITE_TILE = 0;
    const EMPTY_BLACK_TILE = 1;

    const WHITE_PAWN = 2;
    const BLACK_PAWN = 3;

    const WHITE_QUEEN_PAWN = 20;
    const BLACK_QUEEN_PAWN = 30;

    const PLAYER_ONE = 1;
    const PLAYER_TWO = 2;

    let tile = [];
    let tileDiv = "";
    let currentTile = "";

    let isNextJumpPossible = false;
    let endGame = false;

    //GAME LOGIQUE 
    function Tile(row, col) { // Construit un constructeur de la map qui prend en parametre la row et la col 
        this.value = map[row][col];
        this.row = row;
        this.col = col;

        this.draw = function () { //Dessine les pions svg
            this.value = map[row][col]; //permet de redessiner la map avec les nouvelles modifcations (si il y en a)
            if (isNextJumpPossible == false) {
                if (this.row == 0 && this.value == WHITE_PAWN) {
                    this.value = WHITE_QUEEN_PAWN;
                    map[row][col] = WHITE_QUEEN_PAWN;
                }
                if (this.row == 9 && this.value == BLACK_PAWN) {
                    this.value = BLACK_QUEEN_PAWN;
                    map[row][col] = BLACK_QUEEN_PAWN;
                }
            }

            if (this.value == EMPTY_BLACK_TILE) {
                $("#tile" + this.row + this.col).html("");
            } else if (this.value == WHITE_PAWN) { //On ajoute au sein de la div le svg du pion blanc si la div en contient un
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"#F8F8FF\" /></svg>");
            } else if (this.value == BLACK_PAWN) { //On ajoute au sein de la div le svg du pion noir si la div en contient un
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"#1c1c1c\" /></svg>");
            } else if (this.value == WHITE_QUEEN_PAWN) {
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"#F8F8FF\" /></svg><img src=\"queen.svg\" class=\"queen\">");
            } else if (this.value == BLACK_QUEEN_PAWN) {
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"#1c1c1c\" /></svg><img src=\"queen.svg\" class=\"queen\">");
            }
        }
    }

    function getRow(tile) { // retourne la ligne de la case (ex: tile34, récupere la ligne 3)
        return parseInt(tile.charAt(4));
    }

    function getCol(tile) { //retourne la colonne de la case (ex: tile34, récupere la colonne 4)
        return parseInt(tile.charAt(5));
    }

    function clickedTile(tile) { //Permet d'animer la case sur laquel le joueur clique
        if (isNextJumpPossible == false) {

            if (currentTile != "") { //Permet d'enlever l'animation sur la case précédente
                stopAnimation(currentTile);
                resetTile();
            }
            currentTile = tile; //Défini la nouvelle case courante 
            checkPossibilities(tile);
            startAnimation(tile);
            console.log(currentTile);
        }

    }

    function switchPlayer() { //Permet de changer de joueur courant
        if (currentPlayer == PLAYER_ONE) { // Si le joueur courant est le joueur 1 on passe au joueur 2

            currentPlayer = PLAYER_TWO;
            $("#waitList").html("<b> Joueur " + PLAYER_TWO + " en attente..</b>")
        } else {
            currentPlayer = PLAYER_ONE;
            $("#waitList").html("<b> Joueur " + PLAYER_ONE + " en attente..</b>")
        }

        showCurrentPlayer(); //Permet d'afficher à l'utilisateur le joueur qui doit actuellement jouer
    }

    function showCurrentPlayer() { //Permet d'afficher à l'utilisateur le joueur qui doit actuellement jouer 
        if (currentPlayer == PLAYER_ONE) {
            $('#currentPlayer').html("<b>Joueur NOIR</b>")
        } else {
            $('#currentPlayer').html("<b>Joueur BLANC</b>")
        }
    }


    function makeMove(tile) { //Permet le "deplacement" d'un pion (on change la valeur de la case sur la map)
        map[getRow(tile)][getCol(tile)] = map[getRow(currentTile)][getCol(currentTile)]; // Place le pion à sa nouvelle position
        map[getRow(currentTile)][getCol(currentTile)] = 1; // Enleve le pion de son ancienne position
        stopAnimation(currentTile);//Enleve l'animation sur la case cliqué après le changement de position
        // $('#' + tile).css('background-color', 'red');
        currentTile = "";
        draw();
        resetTile();
        checkWinner();

        let map_stry = JSON.stringify(map);

        //Mets les valeurs récupéré dans un format json
        let msg_move_json = {
            command: "move",
            user_id: id_joueur,
            user_color: currentPlayer,
            map: map_stry
        };

        //Transforme en objet Json
        let msg_m_json = JSON.stringify(msg_move_json);

        // Envoie au serveur sous format json la map actuelle
        ws.send(msg_m_json);

        switchPlayer();

    }

    function draw() { //Dessine chaque case de la map
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map.length; col++) {
                tile[row][col].draw();
            }
        }
    }

    function checkPawnANDPlayer(tile) { //Permet de resteindre le joueur courant à ses pions seulement
        if (currentPlayer == PLAYER_ONE && (map[getRow(tile)][getCol(tile)] == BLACK_PAWN || map[getRow(tile)][getCol(tile)] == BLACK_QUEEN_PAWN)) {
            return true;
        } else if (currentPlayer == PLAYER_TWO && (map[getRow(tile)][getCol(tile)] == WHITE_PAWN || map[getRow(tile)][getCol(tile)] == WHITE_QUEEN_PAWN)) {
            return true;
        }
    }

    function isMovePossible(tile) { //Verifie que le déplacement du pion est possible
        let currentRow = getRow(currentTile);
        let currentCol = getCol(currentTile);
        let clickedRow = getRow(tile);
        let clickedCol = getCol(tile);

        if (currentTile != "") {
            if (map[clickedRow][clickedCol] == EMPTY_BLACK_TILE //Verifie qu'on va bien sur une case noir vide
                && currentPlayer == PLAYER_ONE //check que c'est le joueur 1
                && map[currentRow][currentCol] == BLACK_PAWN  //check qu'on selectionne un pion noir ou une dame noir
                && (clickedRow - currentRow == 1) //Check la différence entre clickedRow(la ligne ou on va) et currentRow(la ligne ou on est) n'est que de 1 car on ne peut pas se déplacer en sautant plusieurs ligne
                && Math.abs(clickedCol - currentCol) == 1) { //Check similiaire à la ligne MAIS on mets la valeur absolu car dépendamment de notre position le resultat sera de -1 ou 1 en cas de déplcament mais ce qui nous interesse c'est juste la différence de 1 ici
                return true;
            } else if (map[clickedRow][clickedCol] == EMPTY_BLACK_TILE
                && currentPlayer == PLAYER_TWO
                && map[currentRow][currentCol] == WHITE_PAWN
                && (clickedRow - currentRow == -1) //-1 car le pion remonte
                && Math.abs(clickedCol - currentCol) == 1) {
                return true;
            } else if (map[clickedRow][clickedCol] == EMPTY_BLACK_TILE
                && currentPlayer == PLAYER_TWO
                && map[currentRow][currentCol] == WHITE_QUEEN_PAWN
                && (Math.abs(clickedCol - currentCol) == Math.abs(clickedRow - currentRow))) //Permet tout les mouvements sur la diagonale tant que la case est vide (pour une dame blanche)
            {
                return true;
            } else if (map[clickedRow][clickedCol] == EMPTY_BLACK_TILE
                && currentPlayer == PLAYER_ONE
                && map[currentRow][currentCol] == BLACK_QUEEN_PAWN
                && (Math.abs(clickedCol - currentCol) == Math.abs(clickedRow - currentRow))) //Permet tout les mouvements sur la diagonale tant que la case est vide (pour une dame noir)
            {
                return true;
            }
        }
    }

    function startAnimation(tile) { //Anime une case avec un effet clignotant
        $('#' + tile).css('animation-duration', '.8s');
        $('#' + tile).css('animation-name', 'clignoter');
        $('#' + tile).css('animation-iteration-count', 'infinite');
    }

    function stopAnimation(tile) { //Arrete l'animation d'une case
        $('#' + tile).css('animation-name', '');
    }

    function isEatPossible(tile) { //Verifie la configuration du pion sur le plateau afin de savoir si il peut manger un pion
        let eatPossible = false;
        let row = getRow(tile);
        let col = getCol(tile);

        if (currentPlayer == PLAYER_ONE && (map[row][col] == BLACK_PAWN || map[row][col] == BLACK_QUEEN_PAWN)) { //Si c'est le joueur 1 et qu'il s'agit d'un pion noir ou d'une dame noir
            if (doesTileExist(row + 2, col + 2) //En bas à droite
                && map[row + 2][col + 2] == EMPTY_BLACK_TILE //Verifie que la case d'arrive est bien une case noir vide
                && (map[row + 1][col + 1] == WHITE_PAWN
                    || map[row + 1][col + 1] == WHITE_QUEEN_PAWN)) { //Verifie que la case sur le chemin contient bien un pion blanc
                eatPossible = true;
            } else if (doesTileExist(row - 2, col + 2) //En bas à gauche
                && map[row - 2][col + 2] == EMPTY_BLACK_TILE
                && (map[row - 1][col + 1] == WHITE_PAWN
                    || map[row - 1][col + 1] == WHITE_QUEEN_PAWN)) {
                eatPossible = true;
            } else if (doesTileExist(row + 2, col - 2) //En haut à droite
                && map[row + 2][col - 2] == EMPTY_BLACK_TILE
                && (map[row + 1][col - 1] == WHITE_PAWN
                    || map[row + 1][col - 1] == WHITE_QUEEN_PAWN)) {
                eatPossible = true;
            } else if (doesTileExist(row - 2, col - 2) //En haut à gauche
                && map[row - 2][col - 2] == EMPTY_BLACK_TILE
                && (map[row - 1][col - 1] == WHITE_PAWN
                    || map[row - 1][col - 1] == WHITE_QUEEN_PAWN)) {
                eatPossible = true;
            }
        }
        if (currentPlayer == PLAYER_TWO && (map[row][col] == WHITE_PAWN || map[row][col] == WHITE_QUEEN_PAWN)) { // Si il s'agit du joueur 2 et d'un pion blanc ou d'une dame noir
            if (doesTileExist(row + 2, col + 2)
                && map[row + 2][col + 2] == EMPTY_BLACK_TILE
                && (map[row + 1][col + 1] == BLACK_PAWN
                    || map[row + 1][col + 1] == BLACK_QUEEN_PAWN)) { //Verifie que la case sur le chemin contient un pion noir
                eatPossible = true;
            } else if (doesTileExist(row - 2, col + 2)
                && map[row - 2][col + 2] == EMPTY_BLACK_TILE
                && (map[row - 1][col + 1] == BLACK_PAWN
                    || map[row - 1][col + 1] == BLACK_QUEEN_PAWN)) {

                eatPossible = true;
            } else if (doesTileExist(row + 2, col - 2)
                && map[row + 2][col - 2] == EMPTY_BLACK_TILE
                && (map[row + 1][col - 1] == BLACK_PAWN
                    || map[row + 1][col - 1] == BLACK_QUEEN_PAWN)) {

                eatPossible = true;
            } else if (doesTileExist(row - 2, col - 2)
                && map[row - 2][col - 2] == EMPTY_BLACK_TILE
                && (map[row - 1][col - 1] == BLACK_PAWN
                    || map[row - 1][col - 1] == BLACK_QUEEN_PAWN)) {
                eatPossible = true;
            }
        }
        return eatPossible;
    }

    function eatPawn(tile) { //Permet de manger un pion
        if (currentTile != "") {//Si une case est selectionné
            let caseToEatRow = Math.floor(((getRow(tile)) + getRow(currentTile)) / 2); //Recupere la ligne de la case ou le pion doit être manger
            let caseToEatCol = Math.floor(((getCol(tile)) + getCol(currentTile)) / 2); //Recupere la colonne de la case ou le pion doit être manger

            map[getRow(tile)][getCol(tile)] = map[getRow(currentTile)][getCol(currentTile)]; //change la valeur de la case ou nous allons pour y placer le pion 
            map[getRow(currentTile)][getCol(currentTile)] = EMPTY_BLACK_TILE; //Vide la case ou on était (vu qu'on se deplace vers une nouvelle case)
            map[caseToEatRow][caseToEatCol] = EMPTY_BLACK_TILE; //Vide la case du pion manger

            //Réinitialise les variables après avoir manger un pion et change de joueur

            stopAnimation(currentTile);
            if (isEatPossible(tile) == false) {
                isNextJumpPossible = false;
                currentTile = "";
                caseToEatRow = "";
                caseToEatCol = "";
                switchPlayer();
                resetTile();
                draw();
                checkWinner();
            } else {
                isNextJumpPossible = true;
                currentTile = tile;
                startAnimation(currentTile);
                caseToEatRow = "";
                caseToEatCol = "";
                resetTile();
                draw();
                checkWinner();
            }
        }
    }

    function eatPawnQueen(tile) { //permet à une dame de manger un pion
        if (currentTile != "") {//Si une case est selectionné

            let currentRow = getRow(currentTile);
            let currentCol = getCol(currentTile);

            let clickedRow = getRow(tile);
            let clickedCol = getCol(tile);
            //gestion des mouvements normaux possible pour les dames noir et blanche
            map[clickedRow][clickedCol] = map[currentRow][currentCol];
            if (currentPlayer == PLAYER_ONE) {
                for (let i = 0; i < map.length; i++) { //en bas à droite
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow < clickedRow && currentCol < clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }

                for (let i = 0; i < map.length; i++) { //en bas à gauche
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow < clickedRow && currentCol > clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }

                for (let i = 0; i < map.length; i++) { //en haut à gauche
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow > clickedRow && currentCol > clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }

                for (let i = 0; i < map.length; i++) { //en haut à droite
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow > clickedRow && currentCol < clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }
            } else if (currentPlayer == PLAYER_TWO) {
                for (let i = 0; i < map.length; i++) { //en bas à droite
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow < clickedRow && currentCol < clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }

                for (let i = 0; i < map.length; i++) { //en bas à gauche
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow < clickedRow && currentCol > clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }

                for (let i = 0; i < map.length; i++) { //en haut à gauche
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow > clickedRow && currentCol > clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }

                for (let i = 0; i < map.length; i++) { //en haut à droite
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            if (currentRow > clickedRow && currentCol < clickedCol) {
                                map[currentRow][currentCol] = EMPTY_BLACK_TILE;
                                map[destinationRow][destinationCol] = EMPTY_BLACK_TILE;
                            }
                        }
                    }
                }
            }


            //Réinitialise les variables après avoir manger un pion et change de joueur
            stopAnimation(currentTile);
            if (isEatPossible(tile) == false) {
                isNextJumpPossible = false;
                currentTile = "";
                destinationRow = "";
                destinationCol = "";
                switchPlayer();
                resetTile();
                draw();
                checkWinner();
            } else {
                isNextJumpPossible = true;
                currentTile = tile;
                startAnimation(currentTile);
                destinationRow = "";
                destinationCol = "";
                resetTile();
                draw();
                checkWinner();
            }
        }
    }

    function doesTileExist(row, col) { //Verifie l'existence d'une case sur le plateau
        return ((row <= 9 && col <= 9 && row >= 0 && col >= 0) ? true : false);
    }

    function eatPossible(tileClicked, tileDestination) { //Verifie la configuration du pion sur le plateau afin de savoir si il peut se déplacer manger un pion ou non
        let eatPossible = false;

        let clickedRow = getRow(tileClicked);
        let clickedCol = getCol(tileClicked);

        let destinationRow = getRow(tileDestination);
        let destinationCol = getCol(tileDestination);

        if (currentTile != "") {

            if ((map[clickedRow][clickedCol] == BLACK_PAWN || map[clickedRow][clickedCol] == BLACK_QUEEN_PAWN) && currentPlayer == PLAYER_ONE) { //si il s'agit d'un pion noir ou d'une dame noir et du joueur 1
                if (doesTileExist(clickedRow + 2, clickedCol + 2) //On verifie que la case en bas à droite existe
                    && map[clickedRow + 2][clickedCol + 2] == EMPTY_BLACK_TILE //Check si la case d'arrivé est bien vide 
                    && clickedRow + 2 == destinationRow && clickedCol + 2 == destinationCol // Check si le mouvement est un mouvement possible au dame (empeche le joueur de se "teleporter" et de faire des mouvements interdit)
                    && (map[clickedRow + 1][clickedCol + 1] == WHITE_PAWN || map[clickedRow + 1][clickedCol + 1] == WHITE_QUEEN_PAWN)) //Check si le pion entre le départ et l'arrivé est bien un pion blanc ou une dame blanche
                {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol + 2)
                    && map[clickedRow - 2][clickedCol + 2] == EMPTY_BLACK_TILE //En bas à gauche
                    && clickedRow - 2 == destinationRow && clickedCol + 2 == destinationCol
                    && (map[clickedRow - 1][clickedCol + 1] == WHITE_PAWN || map[clickedRow - 1][clickedCol + 1] == WHITE_QUEEN_PAWN)) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow + 2, clickedCol - 2)  //En haut à droite
                    && map[clickedRow + 2][clickedCol - 2] == EMPTY_BLACK_TILE
                    && clickedRow + 2 == destinationRow && clickedCol - 2 == destinationCol
                    && (map[clickedRow + 1][clickedCol - 1] == WHITE_PAWN || map[clickedRow + 1][clickedCol - 1] == WHITE_QUEEN_PAWN)) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol - 2) //En haut à gauche
                    && map[clickedRow - 2][clickedCol - 2] == 1
                    && clickedRow - 2 == destinationRow && clickedCol - 2 == destinationCol
                    && (map[clickedRow - 1][clickedCol - 1] == WHITE_PAWN || map[clickedRow - 1][clickedCol - 1] == WHITE_QUEEN_PAWN)) {
                    eatPossible = true;
                }
            }
            if ((map[clickedRow][clickedCol] == WHITE_PAWN || map[clickedRow][clickedCol] == WHITE_QUEEN_PAWN) && currentPlayer == PLAYER_TWO) { //si il s'agit d'un pion blanc ou d'une dame blanc et du joueur 2
                if (doesTileExist(clickedRow + 2, clickedCol + 2) //En bas à droite
                    && map[clickedRow + 2][clickedCol + 2] == EMPTY_BLACK_TILE
                    && clickedRow + 2 == destinationRow && clickedCol + 2 == destinationCol
                    && (map[clickedRow + 1][clickedCol + 1] == BLACK_PAWN || map[clickedRow + 1][clickedCol + 1] == BLACK_QUEEN_PAWN)) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol + 2)
                    && map[clickedRow - 2][clickedCol + 2] == EMPTY_BLACK_TILE //En bas à gauche
                    && clickedRow - 2 == destinationRow && clickedCol + 2 == destinationCol
                    && (map[clickedRow - 1][clickedCol + 1] == BLACK_PAWN || map[clickedRow - 1][clickedCol + 1] == BLACK_QUEEN_PAWN)) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow + 2, clickedCol - 2)  //En haut à droite
                    && map[clickedRow + 2][clickedCol - 2] == EMPTY_BLACK_TILE
                    && clickedRow + 2 == destinationRow && clickedCol - 2 == destinationCol
                    && (map[clickedRow + 1][clickedCol - 1] == BLACK_PAWN || map[clickedRow + 1][clickedCol - 1] == BLACK_QUEEN_PAWN)) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol - 2) //En haut à gauche
                    && map[clickedRow - 2][clickedCol - 2] == 1
                    && clickedRow - 2 == destinationRow && clickedCol - 2 == destinationCol
                    && (map[clickedRow - 1][clickedCol - 1] == BLACK_PAWN || map[clickedRow - 1][clickedCol - 1] == BLACK_QUEEN_PAWN)) {
                    eatPossible = true;
                }
            }
            return eatPossible;
        }
    }

    function eatPossibleQueen(tileClicked, tileDestination) { //Verifie la configuration d'une dame sur le plateau afin de savoir si il peut se déplacer manger un pion ou non
        let eatPossible = false;

        let clickedRow = getRow(tileClicked);
        let clickedCol = getCol(tileClicked);

        let destinationRow = getRow(tileDestination);
        let destinationCol = getCol(tileDestination);

        if (currentTile != "") {


            if (map[clickedRow][clickedCol] == BLACK_QUEEN_PAWN && currentPlayer == PLAYER_ONE) { //si il s'agit d'une dame noir et du joueur 1
                if (Math.abs(destinationRow - clickedRow) == Math.abs(destinationCol - clickedCol)) {
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en haut à droite
                        if (doesTileExist(destinationRow + 1, destinationCol - 1) && (map[destinationRow + 1][destinationCol - 1] == WHITE_PAWN || map[destinationRow + 1][destinationCol - 1] == WHITE_QUEEN_PAWN)) { //On verifie que le pion à manger est blanc et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow - i, clickedCol + i)) {
                                    if (map[clickedRow - i][clickedCol + i] == BLACK_PAWN || map[clickedRow - i][clickedCol + i] == BLACK_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow - i][clickedCol + i] == WHITE_PAWN || map[clickedRow - i][clickedCol + i] == WHITE_QUEEN_PAWN) && (destinationRow < clickedRow && destinationCol > clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }

                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en bas à gauche
                        if (doesTileExist(destinationRow - 1, destinationCol + 1) && (map[destinationRow - 1][destinationCol + 1] == WHITE_PAWN || map[destinationRow - 1][destinationCol + 1] == WHITE_QUEEN_PAWN)) { //On verifie que le pion à manger est blanc et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow + i, clickedCol - i)) {
                                    if (map[clickedRow + i][clickedCol - i] == BLACK_PAWN || map[clickedRow + i][clickedCol - i] == BLACK_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow + i][clickedCol - i] == WHITE_PAWN || map[clickedRow + i][clickedCol - i] == WHITE_QUEEN_PAWN) && (destinationRow > clickedRow && destinationCol < clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }

                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en bas à droite
                        if (doesTileExist(destinationRow - 1, destinationCol - 1) && (map[destinationRow - 1][destinationCol - 1] == WHITE_PAWN || map[destinationRow - 1][destinationCol - 1] == WHITE_QUEEN_PAWN)) { //On verifie que le pion à manger est blanc et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow + i, clickedCol + i)) {
                                    if (map[clickedRow + i][clickedCol + i] == BLACK_PAWN || map[clickedRow + i][clickedCol + i] == BLACK_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow + i][clickedCol + i] == WHITE_PAWN || map[clickedRow + i][clickedCol + i] == WHITE_QUEEN_PAWN) && (destinationRow > clickedRow && destinationCol > clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }

                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en haut à gauche
                        if (doesTileExist(destinationRow + 1, destinationCol + 1) && (map[destinationRow + 1][destinationCol + 1] == WHITE_PAWN || map[destinationRow + 1][destinationCol + 1] == WHITE_QUEEN_PAWN)) { //On verifie que le pion à manger est blanc et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow - i, clickedCol - i)) {
                                    if (map[clickedRow - i][clickedCol - i] == BLACK_PAWN || map[clickedRow - i][clickedCol - i] == BLACK_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow - i][clickedCol - i] == WHITE_PAWN || map[clickedRow - i][clickedCol - i] == WHITE_QUEEN_PAWN) && (destinationRow < clickedRow && destinationCol < clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }
                }
            } else if (map[clickedRow][clickedCol] == WHITE_QUEEN_PAWN && currentPlayer == PLAYER_TWO) {//si il s'agit d'une dame blanche et du joueur 2
                if (Math.abs(destinationRow - clickedRow) == Math.abs(destinationCol - clickedCol)) {
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en haut à droite
                        if (doesTileExist(destinationRow + 1, destinationCol - 1) && (map[destinationRow + 1][destinationCol - 1] == BLACK_PAWN || map[destinationRow + 1][destinationCol - 1] == BLACK_QUEEN_PAWN)) { //On verifie que le pion à manger est noir et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow - i, clickedCol + i)) {
                                    if (map[clickedRow - i][clickedCol + i] == WHITE_PAWN || map[clickedRow - i][clickedCol + i] == WHITE_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow - i][clickedCol + i] == BLACK_PAWN || map[clickedRow - i][clickedCol + i] == BLACK_QUEEN_PAWN) && (destinationRow < clickedRow && destinationCol > clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }

                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en bas à gauche
                        if (doesTileExist(destinationRow - 1, destinationCol + 1) && (map[destinationRow - 1][destinationCol + 1] == BLACK_PAWN || map[destinationRow - 1][destinationCol + 1] == BLACK_QUEEN_PAWN)) { //On verifie que le pion à manger est noir et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow + i, clickedCol - i)) {
                                    if (map[clickedRow + i][clickedCol - i] == WHITE_PAWN || map[clickedRow + i][clickedCol - i] == WHITE_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow + i][clickedCol - i] == BLACK_PAWN || map[clickedRow + i][clickedCol - i] == BLACK_QUEEN_PAWN) && (destinationRow > clickedRow && destinationCol < clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }

                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en bas à droite
                        if (doesTileExist(destinationRow - 1, destinationCol - 1) && (map[destinationRow - 1][destinationCol - 1] == BLACK_PAWN || map[destinationRow - 1][destinationCol - 1] == BLACK_QUEEN_PAWN)) { //On verifie que le pion à manger est blanc et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow + i, clickedCol + i)) {
                                    if (map[clickedRow + i][clickedCol + i] == WHITE_PAWN || map[clickedRow + i][clickedCol + i] == WHITE_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow + i][clickedCol + i] == BLACK_PAWN || map[clickedRow + i][clickedCol + i] == BLACK_QUEEN_PAWN) && (destinationRow > clickedRow && destinationCol > clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }

                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) { //en haut à gauche
                        if (doesTileExist(destinationRow + 1, destinationCol + 1) && (map[destinationRow + 1][destinationCol + 1] == BLACK_PAWN || map[destinationRow + 1][destinationCol + 1] == BLACK_QUEEN_PAWN)) { //On verifie que le pion à manger est blanc et que la case de destination est vide
                            for (let i = 1; i < map.length; i++) {
                                if (doesTileExist(clickedRow - i, clickedCol - i)) {
                                    if (map[clickedRow - i][clickedCol - i] == WHITE_PAWN || map[clickedRow - i][clickedCol - i] == WHITE_QUEEN_PAWN) {
                                        break;
                                    }
                                    if ((map[clickedRow - i][clickedCol - i] == BLACK_PAWN || map[clickedRow - i][clickedCol - i] == BLACK_QUEEN_PAWN) && (destinationRow < clickedRow && destinationCol < clickedCol)) {
                                        eatPossible = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return eatPossible;
    }

    function canHeEat() { //Verifie pour chaque pion du plateau si il est en configuration de manger un autre pion
        let eatPossible = false;
        for (var row = 0; row < map.length; row++) {
            for (var col = 0; col < map.length; col++) {
                if (currentPlayer == PLAYER_ONE && (map[row][col] == BLACK_PAWN || map[row][col] == BLACK_QUEEN_PAWN)) {
                    if (doesTileExist(row + 2, col + 2) &&
                        map[row + 2][col + 2] == EMPTY_BLACK_TILE &&
                        (map[row + 1][col + 1] == WHITE_PAWN || map[row + 1][col + 1] == WHITE_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col + 2) &&
                        map[row - 2][col + 2] == EMPTY_BLACK_TILE &&
                        (map[row - 1][col + 1] == WHITE_PAWN || map[row - 1][col + 1] == WHITE_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row + 2, col - 2) &&
                        map[row + 2][col - 2] == EMPTY_BLACK_TILE &&
                        (map[row + 1][col - 1] == WHITE_PAWN || map[row + 1][col - 1] == WHITE_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col - 2) &&
                        map[row - 2][col - 2] == EMPTY_BLACK_TILE &&
                        (map[row - 1][col - 1] == WHITE_PAWN || map[row - 1][col - 1] == WHITE_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                }
                if (currentPlayer == PLAYER_TWO && (map[row][col] == WHITE_PAWN || map[row][col] == WHITE_QUEEN_PAWN)) {
                    if (doesTileExist(row + 2, col + 2) &&
                        map[row + 2][col + 2] == EMPTY_BLACK_TILE &&
                        (map[row + 1][col + 1] == BLACK_PAWN || map[row + 1][col + 1] == BLACK_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col + 2) &&
                        map[row - 2][col + 2] == EMPTY_BLACK_TILE &&
                        (map[row - 1][col + 1] == BLACK_PAWN || map[row - 1][col + 1] == BLACK_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row + 2, col - 2) &&
                        map[row + 2][col - 2] == EMPTY_BLACK_TILE &&
                        (map[row + 1][col - 1] == BLACK_PAWN || map[row + 1][col - 1] == BLACK_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col - 2) &&
                        map[row - 2][col - 2] == EMPTY_BLACK_TILE &&
                        (map[row - 1][col - 1] == BLACK_PAWN || map[row - 1][col - 1] == BLACK_QUEEN_PAWN)) {
                        eatPossible = true;
                    }
                }
            }
        }
        return eatPossible;
    }

    function isPair(value) { if (value % 2 == 0) return true; else return false; } //retourne vrai si la variable est pair sinon false


    function checkPossibilities(tile) { //Affiche au joueur les possibilités de jeu 
        let possibleDestMoveRow = getRow(tile) + 1;
        let possibleDestMoveCol = getCol(tile) + 1;
        let possibleDestMoveRow_1 = getRow(tile) - 1;
        let possibleDestMoveCol_1 = getCol(tile) - 1;

        let possibleDestEatRow = getRow(tile) + 2;
        let possibleDestEatCol = getCol(tile) + 2;
        let possibleDestEatRow_1 = getRow(tile) - 2;
        let possibleDestEatCol_1 = getCol(tile) - 2;

        let currentRow = getRow(currentTile);
        let currentCol = getCol(currentTile);

        if (canHeEat() == false) {
            if (currentPlayer == PLAYER_ONE && (map[currentRow][currentCol] == BLACK_PAWN || map[currentRow][currentCol] == BLACK_QUEEN_PAWN)) {
                if (doesTileExist(possibleDestMoveRow, possibleDestMoveCol) && map[possibleDestMoveRow][possibleDestMoveCol] == EMPTY_BLACK_TILE) {
                    $('#' + "tile" + possibleDestMoveRow + possibleDestMoveCol).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestMoveRow, possibleDestMoveCol_1) && map[possibleDestMoveRow][possibleDestMoveCol_1] == EMPTY_BLACK_TILE) {
                    $('#' + "tile" + possibleDestMoveRow + possibleDestMoveCol_1).css('background-color', 'green');
                }

            }
            //gestion des mouvements normaux possible pour les dames noir et blanche
            if (currentPlayer == PLAYER_ONE && map[currentRow][currentCol] == BLACK_QUEEN_PAWN) { //vers le bas à droite des dames noir
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == BLACK_PAWN) {
                        break;
                    }
                }
            }

            if (currentPlayer == PLAYER_ONE && map[currentRow][currentCol] == BLACK_QUEEN_PAWN) { //vers le haut à droite des dames noir
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == BLACK_PAWN) {
                        break;
                    }
                }
            }
            if (currentPlayer == PLAYER_ONE && map[currentRow][currentCol] == BLACK_QUEEN_PAWN) { //vers le bas à gauche des dames noir
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == BLACK_PAWN) {
                        break;
                    }
                }
            }
            if (currentPlayer == PLAYER_ONE && map[currentRow][currentCol] == BLACK_QUEEN_PAWN) { //vers le haut à gauche des dames noir
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == BLACK_PAWN) {
                        break;
                    }
                }
            }
            if (currentPlayer == PLAYER_TWO && map[currentRow][currentCol] == WHITE_QUEEN_PAWN) { //vers le bas à droite des dames blanche
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == WHITE_PAWN) {
                        break;
                    }
                }
            }

            if (currentPlayer == PLAYER_TWO && map[currentRow][currentCol] == WHITE_QUEEN_PAWN) { //vers le haut à droite des dames blanche
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol + i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == WHITE_PAWN) {
                        break;
                    }
                }
            }
            if (currentPlayer == PLAYER_TWO && map[currentRow][currentCol] == WHITE_QUEEN_PAWN) { //vers le bas à gauche des dames blanche
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow + i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == WHITE_PAWN) {
                        break;
                    }
                }
            }
            if (currentPlayer == PLAYER_TWO && map[currentRow][currentCol] == WHITE_QUEEN_PAWN) { //vers le haut à gauche des dames blanche
                for (let i = 0; i < map.length; i++) {
                    let destinationRow = currentRow - i;
                    let destinationCol = currentCol - i;
                    if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == EMPTY_BLACK_TILE) {
                        if (Math.abs(destinationRow - currentRow) == Math.abs(destinationCol - currentCol)) {
                            $('#' + 'tile' + destinationRow + destinationCol).css('background-color', 'green');
                        }
                    } else if (doesTileExist(destinationRow, destinationCol) && map[destinationRow][destinationCol] == WHITE_PAWN) {
                        break;
                    }
                }
            }

            if (currentPlayer == PLAYER_TWO && (map[currentRow][currentCol] == WHITE_PAWN || map[currentRow][currentCol] == WHITE_QUEEN_PAWN)) {
                if (doesTileExist(possibleDestMoveRow_1, possibleDestMoveCol_1) && map[possibleDestMoveRow_1][possibleDestMoveCol_1] == EMPTY_BLACK_TILE) {
                    $('#' + "tile" + possibleDestMoveRow_1 + possibleDestMoveCol_1).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestMoveRow_1, possibleDestMoveCol) && map[possibleDestMoveRow_1][possibleDestMoveCol] == EMPTY_BLACK_TILE) {
                    $('#' + "tile" + possibleDestMoveRow_1 + possibleDestMoveCol).css('background-color', 'green');
                }
            }
        } else if (canHeEat()) { //concercne les pions normaux et les dames
            if (currentPlayer == PLAYER_ONE) {
                if (doesTileExist(possibleDestEatRow, possibleDestEatCol) && map[possibleDestEatRow][possibleDestEatCol] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow][possibleDestMoveCol] == WHITE_PAWN || map[possibleDestMoveRow][possibleDestMoveCol] == WHITE_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow + possibleDestEatCol).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestEatRow_1, possibleDestEatCol) && map[possibleDestEatRow_1][possibleDestEatCol] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow_1][possibleDestMoveCol] == WHITE_PAWN || map[possibleDestMoveRow_1][possibleDestMoveCol] == WHITE_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow_1 + possibleDestEatCol).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestEatRow, possibleDestEatCol_1) && map[possibleDestEatRow][possibleDestEatCol_1] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow][possibleDestMoveCol_1] == WHITE_PAWN || map[possibleDestMoveRow][possibleDestMoveCol_1] == WHITE_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow + possibleDestEatCol_1).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestEatRow_1, possibleDestEatCol_1) && map[possibleDestEatRow_1][possibleDestEatCol_1] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow_1][possibleDestMoveCol_1] == WHITE_PAWN || map[possibleDestMoveRow_1][possibleDestMoveCol_1] == WHITE_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow_1 + possibleDestEatCol_1).css('background-color', 'green');
                }
            }
            if (currentPlayer == PLAYER_TWO) {
                if (doesTileExist(possibleDestEatRow, possibleDestEatCol) && map[possibleDestEatRow][possibleDestEatCol] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow][possibleDestMoveCol] == BLACK_PAWN || map[possibleDestMoveRow][possibleDestMoveCol] == BLACK_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow + possibleDestEatCol).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestEatRow_1, possibleDestEatCol) && map[possibleDestEatRow_1][possibleDestEatCol] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow_1][possibleDestMoveCol] == BLACK_PAWN || map[possibleDestMoveRow_1][possibleDestMoveCol] == BLACK_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow_1 + possibleDestEatCol).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestEatRow, possibleDestEatCol_1) && map[possibleDestEatRow][possibleDestEatCol_1] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow][possibleDestMoveCol_1] == BLACK_PAWN || map[possibleDestMoveRow][possibleDestMoveCol_1] == BLACK_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow + possibleDestEatCol_1).css('background-color', 'green');
                }
                if (doesTileExist(possibleDestEatRow_1, possibleDestEatCol_1) && map[possibleDestEatRow_1][possibleDestEatCol_1] == EMPTY_BLACK_TILE && (map[possibleDestMoveRow_1][possibleDestMoveCol_1] == BLACK_PAWN || map[possibleDestMoveRow_1][possibleDestMoveCol_1] == BLACK_QUEEN_PAWN)) {
                    $('#' + "tile" + possibleDestEatRow_1 + possibleDestEatCol_1).css('background-color', 'green');
                }
            }
        }
    }

    function resetTile() { //Remets le fond des cases coloré pour indiqué aux joueurs ou il peut jouer à leur couleur initial 
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map.length; col++) {
                if ((row % 2 == 0 && col % 2 == 1) || (row % 2 == 1 && col % 2 == 0)) { //Verifie si on est sur une tile pair ou impair de la map
                    $('#' + "tile" + row + col).css('background-color', '#846839');
                }
            }
        }
    }

    function checkWinner() {
        let player1PAWN = 0;
        let player2PAWN = 0;
        for (var row = 0; row < map.length; row++) {
            for (var col = 0; col < map.length; col++) {
                if (map[row][col] == BLACK_PAWN || map[row][col] == BLACK_QUEEN_PAWN) {
                    player1PAWN += 1;
                } else if (map[row][col] == WHITE_PAWN || map[row][col] == WHITE_QUEEN_PAWN) {
                    player2PAWN += 2;
                }
            }
        }
        if (player1PAWN == 0) {
            console.log("PLAYER 2 is THE WINNER !")
            $("#winnerInfo").css("display", "inherit");
            $('#winnerPlayer').html("<b>Joueur BLANC</b>")
            return endGame = true;
        } else if (player2PAWN == 0) {
            $("#winnerInfo").css("display", "inherit");
            $('#winnerPlayer').html("<b>Joueur NOIR</b>")
            console.log("PLAYER 1 is THE WINNER !")
            return endGame = true;
        }
    }

    function canQueenEat() { //Verifie pour chaque dame du plateau si il est en mesure de manger un pion
        let eatPossible = false;

        for (var row = 0; row < map.length; row++) {
            for (var col = 0; col < map.length; col++) {
                //Joueur 1:
                if (currentPlayer == PLAYER_ONE && map[row][col] == BLACK_QUEEN_PAWN) { //en haut a droite
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row - i;
                        let destinationCol = col + i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow - 1, destinationCol + 1) && map[destinationRow - 1][destinationCol + 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                if (currentPlayer == PLAYER_ONE && map[row][col] == BLACK_QUEEN_PAWN) { //en bas a droite
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row + i;
                        let destinationCol = col + i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow + 1, destinationCol + 1) && map[destinationRow + 1][destinationCol + 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                if (currentPlayer == PLAYER_ONE && map[row][col] == BLACK_QUEEN_PAWN) { //en bas a gauche
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row + i;
                        let destinationCol = col - i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow + 1, destinationCol - 1) && map[destinationRow + 1][destinationCol - 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                if (currentPlayer == PLAYER_ONE && map[row][col] == BLACK_QUEEN_PAWN) { //en haut a gauche
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row - i;
                        let destinationCol = col - i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == WHITE_PAWN || map[destinationRow][destinationCol] == WHITE_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow - 1, destinationCol - 1) && map[destinationRow - 1][destinationCol - 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                //Joueur 2:
                if (currentPlayer == PLAYER_TWO && map[row][col] == WHITE_QUEEN_PAWN) { //en haut a gauche
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row - i;
                        let destinationCol = col - i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow - 1, destinationCol - 1) && map[destinationRow - 1][destinationCol - 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                if (currentPlayer == PLAYER_TWO && map[row][col] == WHITE_QUEEN_PAWN) { //en bas a gauche
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row + i;
                        let destinationCol = col - i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow + 1, destinationCol - 1) && map[destinationRow + 1][destinationCol - 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                if (currentPlayer == PLAYER_TWO && map[row][col] == WHITE_QUEEN_PAWN) { //en bas a droite
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row + i;
                        let destinationCol = col + i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow + 1, destinationCol + 1) && map[destinationRow + 1][destinationCol + 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
                if (currentPlayer == PLAYER_TWO && map[row][col] == WHITE_QUEEN_PAWN) { //en haut a droite
                    for (let i = 0; i < map.length; i++) {
                        let destinationRow = row - i;
                        let destinationCol = col + i;
                        if (Math.abs(destinationRow - row) == Math.abs(destinationCol - col)) {
                            if (doesTileExist(destinationRow, destinationCol) && (map[destinationRow][destinationCol] == BLACK_PAWN || map[destinationRow][destinationCol] == BLACK_QUEEN_PAWN)) {
                                if (doesTileExist(destinationRow - 1, destinationCol + 1) && map[destinationRow - 1][destinationCol + 1] == EMPTY_BLACK_TILE) {
                                    eatPossible = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return eatPossible;
    }

    function createMap() { //Crée la map du jeu 
        for (let row = 0; row < map.length; row++) {
            tile[row] = [];
            for (let col = 0; col < map.length; col++) {
                tile[row][col] = new Tile(row, col); // on fait appel au constructeur Tile
                if ((row % 2 == 0 && col % 2 == 1) || (row % 2 == 1 && col % 2 == 0)) { //Verifie si on est sur une tile pair ou impair de la map
                    tileDiv = tileDiv + "<div class=\"noir\" id=tile" + row + col + "></div>";
                } else {
                    tileDiv = tileDiv + "<div class=\"blanc\" id=tile" + row + col + "></div>";
                } //On ajoute pour chaque tile un id qui défini la row et la col ex:(id="tile00", pour la tile à la row 0 et la col 0)
            }
        }
        $("#game").html(tileDiv);
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map.length; col++) {
                tile[row][col].draw();

                $('#tile' + row + col).click(function () { //Code qui s'execute à chaque clique sur une case de la map
                    if (!endGame) {
                        if (game_statut == ONLINE) {

                            if (player_pos == currentPlayer) {
                                if (checkPawnANDPlayer(this.id)) {
                                    clickedTile(this.id);
                                } else if (isMovePossible(this.id) && canHeEat() == false && canQueenEat() == false) {
                                    makeMove(this.id);
                                }
                                else if (eatPossible(currentTile, this.id) && canHeEat() && canQueenEat() == false) { //CanHeEat() verifie qu'il y a une possibilité quelque part dans le tableau de manger un pion et eatPossible verifie que l'ont clique sur la bonne case pour manger le pion
                                    eatPawn(this.id);
                                }
                                else if (eatPossibleQueen(currentTile, this.id) && (canHeEat() == false && canQueenEat() || canHeEat() && canQueenEat())) {
                                    eatPawnQueen(this.id);
                                }
                            }
                        } else if (game_statut == LOCAL) {
                            if (checkPawnANDPlayer(this.id)) {
                                clickedTile(this.id);
                            } else if (isMovePossible(this.id) && canHeEat() == false && canQueenEat() == false) {
                                makeMove(this.id);
                            }
                            else if (eatPossible(currentTile, this.id) && canHeEat() && canQueenEat() == false) { //CanHeEat() verifie qu'il y a une possibilité quelque part dans le tableau de manger un pion et eatPossible verifie que l'ont clique sur la bonne case pour manger le pion
                                eatPawn(this.id);
                            }
                            else if (eatPossibleQueen(currentTile, this.id) && (canHeEat() == false && canQueenEat() || canHeEat() && canQueenEat())) {
                                eatPawnQueen(this.id);
                            }
                        }
                    }
                });
            }
        }
    }

    createMap();
});
