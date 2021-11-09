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

    const WHITE_PAWN = 2;
    const RED_PAWN = 3;

    let currentPlayer = 1
    const PLAYER_ONE = 1;
    const PLAYER_TWO = 2;

    let tile = [];
    let tileDiv = "";
    let currentTile = "";


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
        if (currentTile != tile) {
            if (currentTile != "") { //Permet d'enlever l'animation sur la case précédente
                $('#' + currentTile).css('animation-name', '');
            }
            currentTile = tile; //Défini la nouvelle case courante 
            $('#' + currentTile).css('animation-duration', '.8s');
            $('#' + currentTile).css('animation-name', 'clignoter');
            $('#' + currentTile).css('animation-iteration-count', 'infinite');
            $('#' + currentTile).css('transition', 'none');
            console.log(currentTile);
        }
    }

    function switchPlayer() { //Permet de changer de joueur courant
        if (currentPlayer == PLAYER_ONE) { // Si le joueur courant est le joueur 1 on passe au joueur 2
            currentPlayer = PLAYER_TWO;
        } else {
            currentPlayer = PLAYER_TWO;
        }
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
        $('#' + currentTile).css('animation-name', ''); //Enleve l'animation sur la case cliqué après le changement de position
        currentTile = "";
        switchPlayer();
        draw();
        showCurrentPlayer();
    }

    function draw() { //Dessine chaque case de la map
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
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

    function createMap() { //Crée la map du jeu 
        for (let row = 0; row < 8; row++) {
            tile[row] = [];
            for (let col = 0; col < 8; col++) {
                tile[row][col] = new Tile(row, col); // on fait appel au constructeur Tile
                if ((row % 2 == 0 && col % 2 == 1) || (row % 2 == 1 && col % 2 == 0)) { //Verifie si on est sur une tile pair ou impair de la map
                    tileDiv = tileDiv + "<div class=\"noir\" id=tile" + row + col + "></div>";
                } else {
                    tileDiv = tileDiv + "<div class=\"blanc\" id=tile" + row + col + "></div>";
                } //On ajoute pour chaque tile un id qui défini la row et la col ex:(id="tile00", pour la tile à la row 0 et la col 0)
            }
        }
        $("#game").html(tileDiv);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                tile[row][col].draw();

                $('#tile' + row + col).click(function () { //Code qui s'execute à chaque clique sur une case de la map

                    if (checkPawnANDPlayer(this.id)) {
                        clickedTile(this.id);
                    } else if (currentTile != "") {
                        makeMove(this.id);
                    }

                });
            }
        }
    }

    createMap();
});