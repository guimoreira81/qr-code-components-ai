const board = document.getElementById("board");

const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");

const whiteScoreEl = document.getElementById("whiteScore");
const blackScoreEl = document.getElementById("blackScore");

const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");

let whiteScore = 0;
let blackScore = 0;

const pieces = {
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  p: "♟",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
  P: "♙"
};

let selected = null;
let possibleMoves = [];
let turn = "white";

let game = [];

function initialBoard() {
  return [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]
  ];
}

function resetGame(){

  game = initialBoard();

  turn = "white";

  selected = null;

  possibleMoves = [];

  renderBoard();

  if(modeSelect.value === "bvb"){
    botLoop();
  }
}

restartBtn.onclick = resetGame;

function renderBoard(){

  board.innerHTML = "";

  for(let row=0; row<8; row++){

    for(let col=0; col<8; col++){

      const square = document.createElement("div");

      square.classList.add("square");

      if((row + col) % 2 === 0){
        square.classList.add("white");
      }else{
        square.classList.add("black");
      }

      const piece = game[row][col];

      square.textContent = pieces[piece] || "";

      /* COR DAS PEÇAS */

      if(piece){

        if(piece === piece.toUpperCase()){
          square.classList.add("white-piece");
        }else{
          square.classList.add("black-piece");
        }
      }

      /* CASA SELECIONADA */

      if(
        selected &&
        selected.row === row &&
        selected.col === col
      ){
        square.classList.add("selected");
      }

      /* MOVIMENTOS POSSÍVEIS */

      const isPossible = possibleMoves.some(m =>
        m.row === row && m.col === col
      );

      if(isPossible){
        square.classList.add("possible");
      }

      square.dataset.row = row;
      square.dataset.col = col;

      square.onclick = () => clickSquare(row,col);

      board.appendChild(square);
    }
  }
}

function clickSquare(row,col){

  const piece = game[row][col];

  /* MOVER PEÇA */

  if(selected){

    const validMove = possibleMoves.some(m =>
      m.row === row &&
      m.col === col
    );

    if(validMove){

      movePiece(
        selected.row,
        selected.col,
        row,
        col
      );

      selected = null;
      possibleMoves = [];

      renderBoard();

      checkBot();

      return;
    }

    selected = null;
    possibleMoves = [];

    renderBoard();

    return;
  }

  /* SELECIONAR PEÇA */

  if(piece){

    if(
      turn === "white" &&
      piece === piece.toUpperCase()
    ){

      selected = {row,col};

      possibleMoves = getPossibleMoves(row,col);
    }

    if(
      turn === "black" &&
      piece === piece.toLowerCase()
    ){

      selected = {row,col};

      possibleMoves = getPossibleMoves(row,col);
    }
  }

  renderBoard();
}

function getPossibleMoves(row,col){

  const moves = [];

  const piece = game[row][col];

  const isWhite = piece === piece.toUpperCase();

  const lower = piece.toLowerCase();

  /* =========================
     PEÃO
  ========================= */

  if(lower === "p"){

    const direction = isWhite ? -1 : 1;

    const nextRow = row + direction;

    /* ANDAR PARA FRENTE */

    if(
      nextRow >= 0 &&
      nextRow < 8 &&
      game[nextRow][col] === ""
    ){
      moves.push({
        row: nextRow,
        col: col
      });
    }

    /* CAPTURA DIAGONAL ESQUERDA */

    const leftCol = col - 1;

    if(
      leftCol >= 0 &&
      nextRow >= 0 &&
      nextRow < 8
    ){

      const target = game[nextRow][leftCol];

      if(
        target &&
        (
          (isWhite && target === target.toLowerCase()) ||
          (!isWhite && target === target.toUpperCase())
        )
      ){
        moves.push({
          row: nextRow,
          col: leftCol
        });
      }
    }

    /* CAPTURA DIAGONAL DIREITA */

    const rightCol = col + 1;

    if(
      rightCol < 8 &&
      nextRow >= 0 &&
      nextRow < 8
    ){

      const target = game[nextRow][rightCol];

      if(
        target &&
        (
          (isWhite && target === target.toLowerCase()) ||
          (!isWhite && target === target.toUpperCase())
        )
      ){
        moves.push({
          row: nextRow,
          col: rightCol
        });
      }
    }

    return moves;
  }

  /* =========================
     OUTRAS PEÇAS
  ========================= */

  const dirs = [
    [1,0],[-1,0],[0,1],[0,-1],
    [1,1],[-1,-1],[1,-1],[-1,1]
  ];

  dirs.forEach(d => {

    const nr = row + d[0];
    const nc = col + d[1];

    if(
      nr >= 0 &&
      nr < 8 &&
      nc >= 0 &&
      nc < 8
    ){

      const target = game[nr][nc];

      if(
        !target ||
        (
          isWhite &&
          target === target.toLowerCase()
        ) ||
        (
          !isWhite &&
          target === target.toUpperCase()
        )
      ){
        moves.push({
          row:nr,
          col:nc
        });
      }
    }
  });

  return moves;
}

function movePiece(sr,sc,dr,dc){

  const piece = game[sr][sc];

  const target = game[dr][dc];

  /* VITÓRIA */

  if(target === "k"){

    whiteScore++;

    whiteScoreEl.textContent = whiteScore;

    alert("Brancas venceram!");

    resetGame();

    return;
  }

  if(target === "K"){

    blackScore++;

    blackScoreEl.textContent = blackScore;

    alert("Pretas venceram!");

    resetGame();

    return;
  }

  game[dr][dc] = piece;

  game[sr][sc] = "";

  turn =
    turn === "white"
      ? "black"
      : "white";
}

function getAllMoves(color){

  let moves = [];

  for(let r=0; r<8; r++){

    for(let c=0; c<8; c++){

      const piece = game[r][c];

      if(!piece) continue;

      if(
        color === "white" &&
        piece !== piece.toUpperCase()
      ) continue;

      if(
        color === "black" &&
        piece !== piece.toLowerCase()
      ) continue;

      const pieceMoves =
        getPossibleMoves(r,c);

      pieceMoves.forEach(m => {

        moves.push({
          sr:r,
          sc:c,
          dr:m.row,
          dc:m.col
        });

      });
    }
  }

  return moves;
}

function botMove(){

  const color = turn;

  const moves = getAllMoves(color);

  if(moves.length === 0) return;

  let move;

  const difficulty =
    Number(difficultySelect.value);

  /* FÁCIL */

  if(difficulty === 1){

    move =
      moves[
        Math.floor(
          Math.random() * moves.length
        )
      ];

  }

  /* MÉDIO */

  else if(difficulty === 2){

    const captures =
      moves.filter(m =>
        game[m.dr][m.dc] !== ""
      );

    move =
      captures.length
        ? captures[
            Math.floor(
              Math.random() * captures.length
            )
          ]
        : moves[
            Math.floor(
              Math.random() * moves.length
            )
          ];
  }

  /* DIFÍCIL */

  else{

    const captures =
      moves.filter(m =>
        game[m.dr][m.dc] !== ""
      );

    move =
      captures[0] || moves[0];
  }

  movePiece(
    move.sr,
    move.sc,
    move.dr,
    move.dc
  );

  renderBoard();
}

function checkBot(){

  const mode = modeSelect.value;

  if(
    mode === "pvb" &&
    turn === "black"
  ){
    setTimeout(botMove,500);
  }
}

function botLoop(){

  if(modeSelect.value !== "bvb") return;

  setTimeout(() => {

    botMove();

    botLoop();

  },500);
}

themeBtn.onclick = () => {

  if(
    document.body.classList.contains("dark")
  ){

    document.body.classList.remove("dark");

    document.body.classList.add("light");

  }else{

    document.body.classList.remove("light");

    document.body.classList.add("dark");
  }
};

resetGame();