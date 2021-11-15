$(document).ready(function () {
    let map = [
        [0, 3, 0, 3, 0, 3, 0, 3], // 0 : tile blanche vide
        [3, 0, 3, 0, 3, 0, 3, 0], // 1 : tile noir vide
        [0, 3, 0, 3, 0, 3, 0, 3], // 2 : pion blanc
        [1, 0, 1, 0, 1, 0, 1, 0], // 3 : pion rouge
        [0, 1, 0, 1, 0, 1, 0, 1],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
    ];

    const EMPTY_WHITE_TILE = 0;
    const EMPTY_BLACK_TILE = 1;

    const WHITE_PAWN = 2;
    const RED_PAWN = 3;

    let currentPlayer = 1
    const PLAYER_ONE = 1;
    const PLAYER_TWO = 2;

    let tile = [];
    let tileDiv = "";
    let currentTile = "";

    let isNextJumpPossible = false;


    //GAME LOGIQUE 
    function Tile(row, col) { // Construit un constructeur de la map qui prend en parametre la row et la col 
        this.value = map[row][col];
        this.row = row;
        this.col = col;

        this.draw = function () { //Dessine les pions svg
            this.value = map[row][col]; //permet de redessiner la map avec les nouvelles modifcations (si il y en a)
            if (this.value == 1) {
                $("#tile" + this.row + this.col).html("");
            } else if (this.value == WHITE_PAWN) { //On ajoute au sein de la div le svg du pion blanc si la div en contient un
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"white\" /></svg>");
            } else if (this.value == RED_PAWN) { //On ajoute au sein de la div le svg du pion rouge si la div en contient un
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"red\" /></svg>");
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
            }
            currentTile = tile; //Défini la nouvelle case courante 
            startAnimation(tile);
            console.log(currentTile);
        }

    }

    function switchPlayer() { //Permet de changer de joueur courant
        if (currentPlayer == PLAYER_ONE) { // Si le joueur courant est le joueur 1 on passe au joueur 2
            currentPlayer = PLAYER_TWO;
        } else {
            currentPlayer = PLAYER_ONE;
        }

        showCurrentPlayer(); //Permet d'afficher à l'utilisateur le joueur qui doit actuellement jouer
    }

    function showCurrentPlayer() { //Permet d'afficher à l'utilisateur le joueur qui doit actuellement jouer 
        if (currentPlayer == PLAYER_ONE) {
            $('#currentPlayer').html("<b>Joueur ROUGE</b>")
        } else {
            $('#currentPlayer').html("<b>Joueur BLANC</b>")
        }
    }


    function makeMove(tile) { //Permet le "deplacement" d'un pion (on change la valeur de la case sur la map)
        map[getRow(tile)][getCol(tile)] = map[getRow(currentTile)][getCol(currentTile)]; // Place le pion à sa nouvelle position
        map[getRow(currentTile)][getCol(currentTile)] = 1; // Enleve le pion de son ancienne position
        stopAnimation(currentTile);//Enleve l'animation sur la case cliqué après le changement de position
        currentTile = "";
        switchPlayer();
        draw();
    }

    function draw() { //Dessine chaque case de la map
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map.length; col++) {
                tile[row][col].draw();
            }
        }
    }

    function checkPawnANDPlayer(tile) { //Permet de resteindre le joueur courant à ses pions seulement
        if (currentPlayer == PLAYER_ONE && (map[getRow(tile)][getCol(tile)] == RED_PAWN)) {
            return true;
        } else if (currentPlayer == PLAYER_TWO && (map[getRow(tile)][getCol(tile)] == WHITE_PAWN)) {
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
                && map[currentRow][currentCol] == RED_PAWN //check qu'on selectionne un pion rouge 
                && (clickedRow - currentRow == 1) //Check la différence entre clickedRow(la ligne ou on va) et currentRow(la ligne ou on est) n'est que de 1 car on ne peut pas se déplacer en sautant plusieurs ligne
                && Math.abs(clickedCol - currentCol) == 1) { //Check similiaire à la ligne MAIS on mets la valeur absolu car dépendamment de notre position le resultat sera de -1 ou 1 en cas de déplcament mais ce qui nous interesse c'est juste la différence de 1 ici

                return true;
            } else if (map[clickedRow][clickedCol] == EMPTY_BLACK_TILE
                && currentPlayer == PLAYER_TWO
                && map[currentRow][currentCol] == WHITE_PAWN
                && (clickedRow - currentRow == -1) //-1 car le pion remonte
                && Math.abs(clickedCol - currentCol) == 1) {
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

        // console.log("Normalement la case existe: " + doesTileExist(row - 2, col + 2))
        // console.log("Normalement case vide (1) : " + (map[row - 2][col + 2]))
        // console.log("Normalement pion blanc (2) : " + (map[row - 1][col + 1]))

        if (currentPlayer == PLAYER_ONE && map[row][col] == RED_PAWN) { //Si c'est le joueur 1 et qu'il s'agit d'un pion rouge
            if (doesTileExist(row + 2, col + 2) //En bas à droite
                && map[row + 2][col + 2] == EMPTY_BLACK_TILE //Verifie que la case d'arrive est bien une case noir vide
                && map[row + 1][col + 1] == WHITE_PAWN) { //Verifie que la case sur le chemin contient bien un pion blanc
                eatPossible = true;
            } else if (doesTileExist(row - 2, col + 2) //En bas à gauche
                && map[row - 2][col + 2] == EMPTY_BLACK_TILE
                && map[row - 1][col + 1] == WHITE_PAWN) {
                eatPossible = true;
            } else if (doesTileExist(row + 2, col - 2) //En haut à droite
                && map[row + 2][col - 2] == EMPTY_BLACK_TILE
                && map[row + 1][col - 1] == WHITE_PAWN) {
                eatPossible = true;
            } else if (doesTileExist(row - 2, col - 2) //En haut à gauche
                && map[row - 2][col - 2] == EMPTY_BLACK_TILE
                && map[row - 1][col - 1] == WHITE_PAWN) {
                eatPossible = true;
            }
        }
        if (currentPlayer == PLAYER_TWO && map[row][col] == WHITE_PAWN) { // Si il s'agit du joueur 2 et d'un pion blanc
            if (doesTileExist(row + 2, col + 2)
                && map[row + 2][col + 2] == EMPTY_BLACK_TILE
                && map[row + 1][col + 1] == RED_PAWN) { //Verifie que la case sur le chemin contient un pion rouge
                eatPossible = true;
            } else if (doesTileExist(row - 2, col + 2)
                && map[row - 2][col + 2] == EMPTY_BLACK_TILE
                && map[row - 1][col + 1] == RED_PAWN) {

                eatPossible = true;
            } else if (doesTileExist(row + 2, col - 2)
                && map[row + 2][col - 2] == EMPTY_BLACK_TILE
                && map[row + 1][col - 1] == RED_PAWN) {

                eatPossible = true;
            } else if (doesTileExist(row - 2, col - 2)
                && map[row - 2][col - 2] == EMPTY_BLACK_TILE
                && map[row - 1][col - 1] == RED_PAWN) {
                eatPossible = true;
            }
        }
        // console.log("EAT POSSIBLE ?????" + eatPossible);
        return eatPossible;
    }

    function eatPawn(tile) { //Permet de manger un pion
        if (currentTile != "") {//Si une case est selectionné

            // console.log("test future tile row + current tile row : " + (getRow(tile) + getRow(currentTile) / 2));
            // console.log("test future tile col + current tile col : " + (getCol(tile) + getCol(currentTile) / 2));
            // console.log("future tile : " + getRow(tile));
            // console.log("current tile : " +getRow(currentTile));

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
                draw();
            } else {
                isNextJumpPossible = true;
                currentTile = tile;
                startAnimation(currentTile);
                caseToEatRow = "";
                caseToEatCol = "";
                draw();
            }
            // stopAnimation(currentTile);
            // currentTile = "";
            // caseToEatRow = "";
            // caseToEatCol = "";
            // switchPlayer();
            // draw();
            // console.log("changement de joueur effectuer")
        }
    }

    function doesTileExist(row, col) { //Verifie l'existence d'une case sur le plateau
        return ((row <= 7 && col <= 7 && row >= 0 && col >= 0) ? true : false);
    }

    function eatPossible(tileClicked, tileDestination) { //Verifie la configuration du pion sur le plateau afin de savoir si il peut se déplacer manger un pion ou non
        let eatPossible = false;

        let clickedRow = getRow(tileClicked);
        let clickedCol = getCol(tileClicked);

        let destinationRow = getRow(tileDestination);
        let destinationCol = getCol(tileDestination);

        if (currentTile != "") {

            if (map[clickedRow][clickedCol] == RED_PAWN && currentPlayer == PLAYER_ONE) { //si il s'agit d'un pion rouge et du joueur 1
                if (doesTileExist(clickedRow + 2, clickedCol + 2) //On verifie que la case en bas à droite existe
                    && map[clickedRow + 2][clickedCol + 2] == EMPTY_BLACK_TILE //Check si la case d'arrivé est bien vide 
                    && clickedRow + 2 == destinationRow && clickedCol + 2 == destinationCol // Check si le mouvement est un mouvement possible au dame (empeche le joueur de se "teleporter" et de faire des mouvements interdit)
                    && map[clickedRow + 1][clickedCol + 1] == WHITE_PAWN) //Check si le pion entre le départ et l'arrivé est bien un pion blanc
                {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol + 2)
                    && map[clickedRow - 2][clickedCol + 2] == EMPTY_BLACK_TILE //En bas à gauche
                    && clickedRow - 2 == destinationRow && clickedCol + 2 == destinationCol
                    && map[clickedRow - 1][clickedCol + 1] == WHITE_PAWN) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow + 2, clickedCol - 2)  //En haut à droite
                    && map[clickedRow + 2][clickedCol - 2] == EMPTY_BLACK_TILE
                    && clickedRow + 2 == destinationRow && clickedCol - 2 == destinationCol
                    && map[clickedRow + 1][clickedCol - 1] == WHITE_PAWN) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol - 2) //En haut à gauche
                    && map[clickedRow - 2][clickedCol - 2] == 1
                    && clickedRow - 2 == destinationRow && clickedCol - 2 == destinationCol
                    && map[clickedRow - 1][clickedCol - 1] == WHITE_PAWN) {
                    eatPossible = true;
                }
            }
            if (map[clickedRow][clickedCol] == WHITE_PAWN && currentPlayer == PLAYER_TWO) { //si il s'agit d'un pion blanc et du joueur 2
                if (doesTileExist(clickedRow + 2, clickedCol + 2) //En bas à droite
                    && map[clickedRow + 2][clickedCol + 2] == EMPTY_BLACK_TILE
                    && clickedRow + 2 == destinationRow && clickedCol + 2 == destinationCol
                    && map[clickedRow + 1][clickedCol + 1] == RED_PAWN) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol + 2)
                    && map[clickedRow - 2][clickedCol + 2] == EMPTY_BLACK_TILE //En bas à gauche
                    && clickedRow - 2 == destinationRow && clickedCol + 2 == destinationCol
                    && map[clickedRow - 1][clickedCol + 1] == RED_PAWN) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow + 2, clickedCol - 2)  //En haut à droite
                    && map[clickedRow + 2][clickedCol - 2] == EMPTY_BLACK_TILE
                    && clickedRow + 2 == destinationRow && clickedCol - 2 == destinationCol
                    && map[clickedRow + 1][clickedCol - 1] == RED_PAWN) {
                    eatPossible = true;
                } else if (doesTileExist(clickedRow - 2, clickedCol - 2) //En haut à gauche
                    && map[clickedRow - 2][clickedCol - 2] == 1
                    && clickedRow - 2 == destinationRow && clickedCol - 2 == destinationCol
                    && map[clickedRow - 1][clickedCol - 1] == RED_PAWN) {
                    eatPossible = true;
                }
            }
            return eatPossible;
        }
    }

    function canHeEat() {
        var eatPossible = false;
        for (var row = 0; row < map.length; row++) {
            for (var col = 0; col < map.length; col++) {
                if (currentPlayer == PLAYER_ONE && map[row][col] == RED_PAWN) {
                    if (doesTileExist(row + 2, col + 2) &&
                        map[row + 2][col + 2] == EMPTY_BLACK_TILE &&
                        map[row + 1][col + 1] == WHITE_PAWN) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col + 2) &&
                        map[row - 2][col + 2] == EMPTY_BLACK_TILE &&
                        map[row - 1][col + 1] == WHITE_PAWN) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row + 2, col - 2) &&
                        map[row + 2][col - 2] == EMPTY_BLACK_TILE &&
                        map[row + 1][col - 1] == WHITE_PAWN) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col - 2) &&
                        map[row - 2][col - 2] == EMPTY_BLACK_TILE &&
                        map[row - 1][col - 1] == WHITE_PAWN) {
                        eatPossible = true;
                    }
                }
                if (currentPlayer == PLAYER_TWO && map[row][col] == WHITE_PAWN) {
                    if (doesTileExist(row + 2, col + 2) &&
                        map[row + 2][col + 2] == EMPTY_BLACK_TILE &&
                        map[row + 1][col + 1] == RED_PAWN) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col + 2) &&
                        map[row - 2][col + 2] == EMPTY_BLACK_TILE &&
                        map[row - 1][col + 1] == RED_PAWN) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row + 2, col - 2) &&
                        map[row + 2][col - 2] == EMPTY_BLACK_TILE &&
                        map[row + 1][col - 1] == RED_PAWN) {
                        eatPossible = true;
                    }
                    if (doesTileExist(row - 2, col - 2) &&
                        map[row - 2][col - 2] == EMPTY_BLACK_TILE &&
                        map[row - 1][col - 1] == RED_PAWN) {
                        eatPossible = true;
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

                    if (checkPawnANDPlayer(this.id)) {
                        clickedTile(this.id);
                    } else if (isMovePossible(this.id) && canHeEat() == false) {
                        // console.log("IL PEUT BOUGER");
                        makeMove(this.id);
                    }
                    else if (eatPossible(currentTile, this.id) && canHeEat()) {
                        // console.log("IL PEUT MANGER");
                        eatPawn(this.id);
                    }

                });
            }
        }
    }

    createMap();
});