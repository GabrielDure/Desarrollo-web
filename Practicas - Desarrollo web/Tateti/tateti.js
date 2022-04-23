//  CONSTANTES
const container = document.querySelector('.container'); //contenedor del juego
const casillas = document.querySelectorAll('.celda');  // Todas las celdas
const turn_X = document.getElementById('turn-x'); //  Span para mostrar el turno del player 1
const turn_O = document.getElementById('turn-o');  // Span para mostrar el turno del player 2
const screenWinContainer = document.querySelector('.win-screen'); // Contenedor de la pantalla de triunfo
const playerX_Win = document.querySelector('.player-x-win');  // Contenedor de celebracion del player 1
const playerO_Win = document.querySelector('.player-o-win');   // Contenedor de celebracion del player 2
const buttonReset = document.getElementById('reset-game'); // boton para reiniciar el juego
const buttonPlayAgain = document.getElementById('play-again');

// VARIABLES GLOBALES
let turno = 1;
let grilla = new Array(3);


// FUNCIONES

//  ############################## CARGAR GRILLA ###############################
function cargarGrilla(){
    let index = 0;
    
    for (let i = 0; i < grilla.length; i++) {
        grilla[i] = new Array(3);        
    }
    
    for (let i = 0; i < grilla.length; i++) {
        for (let j = 0; j < grilla[i].length; j++) {
            grilla[i][j] = casillas[index];
            index++;
        }        
    }    
}

//  ############################## MOSTRAR PANTALLA DE VICTORIA ###############################
function showWinScreen(whoWin){
    // Mostrar Pantallas de triunfo    
    screenWinContainer.style.display = 'grid';

    if (whoWin == 1){    //GANA JUGADOR 1
        playerX_Win.removeAttribute('hidden');
    }
    else if (whoWin == 2){  // GANA JUGADOR 2
        playerO_Win.removeAttribute('hidden');
    }

    buttonReset.setAttribute('hidden','');
    playAgain();
}

function hideWinScreen(){
    screenWinContainer.style.display = 'none';
    buttonReset.removeAttribute('hidden');
    playerX_Win.setAttribute('hidden','');
    playerO_Win.setAttribute('hidden','');
}

//  ############################## REINICIAR JUEGO ###############################
function reiniciarJuego(button){
    button.addEventListener('click', ()=> { 
        casillas.forEach(element => {
            element.classList.remove('selected_By_X');
            element.classList.remove('selected_By_O');
            element.style.pointerEvents = 'all';
        });

        hideWinScreen();
        turn_X.style.display = 'flex';
        turn_O.style.display = 'none';
        turno = 1;
     });
}

function playAgain(){
    reiniciarJuego(buttonPlayAgain);
}


//  ############################## BUSCAR GANADOR ###############################

function checkVertical(selected){ // Devuelve true si se encontro ganador al jugador "selected"
    let col_sel = 0;

    for (let col = 0; col < grilla.length; col++) {
        for (let row = 0; row < grilla[col].length; row++){ // Recorro la grilla por columnas
            if (grilla[row][col].classList.contains(selected)){ // Si la celda de esa columna tiene la clase "selected_By_" entonces aumento col_sel
                col_sel++;
            }
        }

        if (col_sel == 3){ // una vez recorrida una columna me fijo si esta totalmente seleccionada por el jugador Selected
            return true
        }
        else{
            col_sel = 0; // si no esta completamente seleccionada entonces reinicio el contador de columnas
        }
    }
    return false; // si nunca se encontro una columna completamen te seleccionada, entonces retorna false
}  

function checkHorizontal(selected){ // Devuelve true si se encontro ganador al jugador "selected"
    let row_sel = 0;

    for (let row = 0; row < grilla.length; row++) {
        for (let col = 0; col < grilla[row].length; col++){ // Recorro la grilla por filas
            if (grilla[row][col].classList.contains(selected)){ // Si la celda de esa fila tiene la clase "selected_By_" entonces aumento col_sel
                row_sel++;
            }
        }

        if (row_sel == 3){ // una vez recorrida una fila me fijo si esta totalmente seleccionada por el jugador Selected
            return true
        }
        else{
            row_sel = 0; // si no esta completamente seleccionada entonces reinicio el contador de filas
        }
    }
    return false; // si nunca se encontro una fila completamen te seleccionada, entonces retorna false
}

function checkMainDiagonal(selected){
    let main = new Array(3); // Array que contiene la diagonal principal

    for (let i = 0; i < main.length; i++) { // Cargo "main" con las celdas de la diagonal principal
        main[i] = grilla[i][i];
    }

    for (let i = 0; i < main.length; i++) { // Recorro "main" buscando si esta seleccionada toda la diagonal principal
        if (!main[i].classList.contains(selected)) {
            return false;
        }
    }
    return true;
}

function checkOpDiagonal(selected){
    let op = new Array(3); // Array que contiene la diagonal principal

    // Cargo "main" con las celdas de la diagonal principal
    op[0] = grilla[0][2];
    op[1] = grilla[1][1];
    op[2] = grilla[2][0];

    for (let i = 0; i < op.length; i++) { // Recorro "op" buscando si esta seleccionada toda la diagonal principal
        if (!op[i].classList.contains(selected)) {
            return false;
        }
    }
    return true;
}

function detectarGanador(){
    if (whoTurn() == 1){
        selected = 'selected_By_X';
    }else{
        selected = 'selected_By_O';
    }

    if (checkVertical(selected) || checkHorizontal(selected) || checkMainDiagonal(selected) || checkOpDiagonal(selected)){
        showWinScreen(whoTurn());
    }
}


//  ############################## MOSTRAR TURNO Y ELEGIDO ###############################

function whoTurn(){ // Si el turno es par, entonces es el turno del player 2
    if (turno % 2 == 0){
        return 2
    }else {
        return 1
    }    
}

function mostrarElegido(element){
    if (whoTurn(turno) == 1){
        element.classList.add('selected_By_X');  //Añado la clase que indica la seleccion de la celda
        turn_X.style.display = 'none';
        turn_O.style.display = 'flex';  // muestro que es el turno del siguiente jugador
    }else{
        element.classList.add('selected_By_O');
        turn_X.style.display = 'flex';
        turn_O.style.display = 'none';
    }

    element.style.pointerEvents = 'none';  // Elimino los eventos del mouse para que no vuelva a ser seleccionado
}

function elegir(){
    casillas.forEach(element => {  // Recorro todas las casillas
        element.addEventListener('click', () => {  // Les añado el evento 'Click'
            mostrarElegido(element);
            detectarGanador();
            turno++; })
    });
}


//  ###############################################################################
//  ############################## PROGRAMA PRINCIPAL ###############################
//  ###############################################################################
cargarGrilla();
elegir();
reiniciarJuego(buttonReset);