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

    let tile = [];
    let tileDiv = "";
    let currentTile = "";


    function Tile(row, col) { // Construit un constructeur de la map qui prend en parametre la row et la col 
        this.value = map[row][col];
        this.row = row;
        this.col = col;

        this.dessine = function () { //Dessine les pions svg
            if (this.value == 1) { 
                $("#tile" + this.row + this.col).html("");
            } else if (this.value == WHITE_PAWN) { //On ajoute au sein de la div le svg du pion blanc si la div en contient un
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"white\" /></svg>");
            } else if (this.value == RED_PAWN) { //On ajoute au sein de la div le svg du pion rouge si la div en contient un
                $("#tile" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"red\" /></svg>");
            }
        }
    }


    function createMap() { //Crée la map du jeu 
        for (let row = 0; row < 8; row++) {
            tile[row] = [];
            for (let col = 0; col < 8; col++) {
                tile[row][col] = new Tile(row, col); // on fait appel au constructeur champ
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
                tile[row][col].dessine();
                $('#tile' + row + col).click(function () { //ajoute un effet de clignotement quand on clique sur une case
                    
                    if (currentTile != this.id) {
                        if (currentTile != "") { //Permet d'enlever l'animation sur la case précédente
                            $('#' + currentTile).css('animation-name', '');
                        }
                        currentTile = this.id; //Défini la nouvelle case courante
                        $('#' + currentTile).css('animation-duration', '.8s');
                        $('#' + currentTile).css('animation-name', 'clignoter');
                        $('#' + currentTile).css('animation-iteration-count', 'infinite');
                        $('#' + currentTile).css('transition', 'none');
                        console.log(currentTile);
                    }
                });
            }
        }
    }

    createMap();
});