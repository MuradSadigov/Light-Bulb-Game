////////////////////////////////////////////
//              DOM
const START_BUTTON = document.querySelector("#start_btn");
const INPUTS = document.getElementsByTagName("input");
const PAGE_1 = document.querySelector(".page_1");
const PAGE_2 = document.querySelector(".page_2");
const GAME_SCREEN = document.querySelector(".game_screen");
const ERROR_PAGE = document.querySelector(".error_page");
let SQUARES;

////////////////////////////////////////////
ERROR_PAGE.style.display = "none";

//#########################################

////////////////////////////////////////////
//              Variables
let Name;
let Level;
let isGameOver = false;
let DATAS = [];
let obstacles = ["-1", "0", "1", "2", "3"];
const easy = [
  ["", "", "", "1", "", "", ""],
  ["", "0", "", "", "", "2", ""],
  ["", "", "", "", "", "", ""],
  ["-1", "", "", "-1", "", "", "-1"],
  ["", "", "", "", "", "", ""],
  ["", "-1", "", "", "", "2", ""],
  ["", "", "", "3", "", "", ""],
];

const medium = [
  ["", "", "0", "", "-1", "", ""],
  ["", "", "", "", "", "", ""],
  ["-1", "", "-1", "", "3", "", "-1"],
  ["", "", "", "1", "", "", ""],
  ["2", "", "-1", "", "-1", "", "-1"],
  ["", "", "", "", "", "", ""],
  ["", "", "-1", "", "2", "", ""],
];

const hard = [
  ["", "-1", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "3", "", "2", "", "-1"],
  ["", "0", "-1", "", "", "", "", "-1", "", ""],
  ["", "", "", "", "-1", "", "", "", "", ""],
  ["", "1", "", "", "-1", "1", "-1", "", "", ""],
  ["", "", "", "-1", "-1", "-1", "", "", "3", ""],
  ["", "", "", "", "", "-1", "", "", "", ""],
  ["", "", "1", "", "", "", "", "0", "-1", ""],
  ["3", "", "-1", "", "0", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "0", ""],
];

////////////////////////////////////////////

//#########################################

////////////////////////////////////////////
//              EVENTS
START_BUTTON.addEventListener("click", startButton);

////////////////////////////////////////////

//#########################################

///////////////////////////////////////////
//              EVENT FUNCTIONS
function startButton(e) {
  e.preventDefault();
  let row;
  let levelArr;
  PAGE_2.style.display = "flex";
  PAGE_1.style.display = "none";

  handlingInputs();

  if (Level === "easy") {
    row = 7;
    levelArr = easy;
  } else if (Level === "medium") {
    row = 7;
    levelArr = medium;
  } else if (Level === "hard") {
    row = 10;
    levelArr = hard;
  }
  if(Level === "" || Name === "")
  {
    ERROR_PAGE.style.display = "flex";
    PAGE_1.style.display = "none";
    PAGE_2.style.display = "none";
  }
  createGameBoard(row);
  displayingBlocks(levelArr);
  letKnowThemOneAnother(row);
}
///////////////////////////////////////////

//#########################################

////////////////////////////////////////////
//              FUNCTIONS
function handlingInputs() {
  for (let i = 0; i < INPUTS.length; i++) {
    if (INPUTS[i].type == "radio" && INPUTS[i].checked) {
      Level = INPUTS[i].value;
    }
    if (INPUTS[i].type == "text") {
      Name = INPUTS[i].value;
    }
  }
}

function createGameBoard(row) {
  //SQUARES EVENTS
  GAME_SCREEN.style.gridTemplateColumns = `repeat(${row}, 1fr)`;
  GAME_SCREEN.style.gridTemplateRows = `repeat(${row}, 1fr)`;
  let countOfSquares = row * row;
  for (let i = 0; i < countOfSquares; i++) {
    const square = document.createElement("div");
    square.className = "square";
    square.id = `${i}`;
    GAME_SCREEN.appendChild(square);
  }
  SQUARES = document.querySelectorAll(".square");

  for (let i = 0; i < SQUARES.length; i++) {
    SQUARES[i].addEventListener("click", () => {
      let id = parseInt(SQUARES[i].id);
      coloringSquares(id, row);
      renderAgain(row);
    });
  }
}

function renderAgain(row) {
  for (let i = 0; i < row * row; i++) {
    if (DATAS[i].isBulb === true) {
      console.log("Mruaad", DATAS[i]);
      console.log("ASDJAKSJlkdjlas", DATAS);
      DATAS[i].isBulb = true;
      SQUARES[i].innerHTML = `<img class="image" src="./assets/idea.png" />`;
      for (let j = 0; j < DATAS[i].X_LEFT.length; j++) {
        if (
          !obstacles.includes(SQUARES[DATAS[i].X_LEFT[j]].getAttribute("value"))
        ) {
          SQUARES[DATAS[i].X_LEFT[j]].style.backgroundColor = "yellow";
        } else {
          break;
        }
      }

      for (let j = 0; j < DATAS[i].X_RIGHT.length; j++) {
        if (
          !obstacles.includes(
            SQUARES[DATAS[i].X_RIGHT[j]].getAttribute("value")
          )
        ) {
          SQUARES[DATAS[i].X_RIGHT[j]].style.backgroundColor = "yellow";
        } else {
          break;
        }
      }

      for (let j = 0; j < DATAS[i].Y_DOWN.length; j++) {
        if (
          !obstacles.includes(SQUARES[DATAS[i].Y_DOWN[j]].getAttribute("value"))
        ) {
          SQUARES[DATAS[i].Y_DOWN[j]].style.backgroundColor = "yellow";
        } else {
          break;
        }
      }

      for (let j = 0; j < DATAS[i].Y_UP.length; j++) {
        if (
          !obstacles.includes(SQUARES[DATAS[i].Y_UP[j]].getAttribute("value"))
        ) {
          SQUARES[DATAS[i].Y_UP[j]].style.backgroundColor = "yellow";
        } else {
          break;
        }
      }
    }
  }
}

function checkBlocks(id) {
  if (DATAS[id].isObstacle) return false;

  let blocks = [
    DATAS[DATAS[id].X_LEFT[1]],
    DATAS[DATAS[id].X_RIGHT[1]],
    DATAS[DATAS[id].Y_UP[1]],
    DATAS[DATAS[id].Y_DOWN[1]],
  ];

  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];

    if (block === undefined) {
      continue;
    }
    if (parseInt(SQUARES[block.order].getAttribute("value")) !== -1) {
      if (
        block.isObstacle &&
        block.countBulbs >= parseInt(SQUARES[block.order].getAttribute("value"))
      ) {
        console.log("-1 sohbeti: ", block);

        return false;
      } else if (
        block.isObstacle &&
        block.countBulbs < parseInt(SQUARES[block.order].getAttribute("value"))
      ) {
        block.countBulbs++;
      }
    }
  }

  return true;
}

function reverseCheckBox(id)
{
    let blocks = [
        DATAS[DATAS[id].X_LEFT[1]],
        DATAS[DATAS[id].X_RIGHT[1]],
        DATAS[DATAS[id].Y_UP[1]],
        DATAS[DATAS[id].Y_DOWN[1]],
      ];

      for (let i = 0; i < blocks.length; i++)
      {
          let block = blocks[i];
        if (block === undefined) {
          continue;
        }
        if(block.isObstacle && parseInt(SQUARES[block.order].getAttribute("value")) !== -1) block.countBulbs--;   
    }
}

function coloringSquares(id, row) {
  for (let i = 0; i < row * row; i++) {
    if (id === parseInt(DATAS[i].order)) {
      if (!DATAS[id].isBulb)
      {

        if (checkBlocks(id))
        {
          DATAS[id].isBulb = true;
          SQUARES[id].innerHTML = `<img class="image" src="./assets/idea.png" />`;

          for (let j = 0; j < DATAS[id].X_LEFT.length; j++) {
            if (
              !obstacles.includes(
                SQUARES[DATAS[id].X_LEFT[j]].getAttribute("value")
              )
            ) {
              SQUARES[DATAS[id].X_LEFT[j]].style.backgroundColor = "yellow";
            } else {
              break;
            }
          }

          for (let j = 0; j < DATAS[id].X_RIGHT.length; j++) {
            if (
              !obstacles.includes(
                SQUARES[DATAS[id].X_RIGHT[j]].getAttribute("value")
              )
            ) {
              SQUARES[DATAS[id].X_RIGHT[j]].style.backgroundColor = "yellow";
            } else {
              break;
            }
          }

          for (let j = 0; j < DATAS[id].Y_DOWN.length; j++) {
            if (
              !obstacles.includes(
                SQUARES[DATAS[id].Y_DOWN[j]].getAttribute("value")
              )
            ) {
              SQUARES[DATAS[id].Y_DOWN[j]].style.backgroundColor = "yellow";
            } else {
              break;
            }
          }

          for (let j = 0; j < DATAS[id].Y_UP.length; j++) {
            if (
              !obstacles.includes(
                SQUARES[DATAS[id].Y_UP[j]].getAttribute("value")
              )
            ) {
              SQUARES[DATAS[id].Y_UP[j]].style.backgroundColor = "yellow";
            } else {
              break;
            }
          }
        }
      } else {
        reverseCheckBox(id);
        DATAS[id].isBulb = false;
        SQUARES[id].innerHTML = ``;
        for (let j = 0; j < DATAS[id].X_LEFT.length; j++) {
          if (
            !obstacles.includes(
              SQUARES[DATAS[id].X_LEFT[j]].getAttribute("value")
            )
          ) {
            SQUARES[DATAS[id].X_LEFT[j]].style.backgroundColor = "white";
          } else {
            break;
          }
        }

        for (let j = 0; j < DATAS[id].X_RIGHT.length; j++) {
          if (
            !obstacles.includes(
              SQUARES[DATAS[id].X_RIGHT[j]].getAttribute("value")
            )
          ) {
            SQUARES[DATAS[id].X_RIGHT[j]].style.backgroundColor = "white";
          } else {
            break;
          }
        }

        for (let j = 0; j < DATAS[id].Y_DOWN.length; j++) {
          if (
            !obstacles.includes(
              SQUARES[DATAS[id].Y_DOWN[j]].getAttribute("value")
            )
          ) {
            SQUARES[DATAS[id].Y_DOWN[j]].style.backgroundColor = "white";
          } else {
            break;
          }
        }

        for (let j = 0; j < DATAS[id].Y_UP.length; j++) {
          if (
            !obstacles.includes(
              SQUARES[DATAS[id].Y_UP[j]].getAttribute("value")
            )
          ) {
            SQUARES[DATAS[id].Y_UP[j]].style.backgroundColor = "white";
          } else {
            break;
          }
        }
      }
    }
  }
}

function redColor(id)
{
    for (let i = 0; i < DATAS.length; i++)
    {
        if()
    }
}

function displayingBlocks(array) {
  let oneDMArray = array.flat(1);
  console.log(SQUARES);
  for (let i = 0; i < oneDMArray.length; i++) {
    if (oneDMArray[i] !== "") {
      SQUARES[i].style.backgroundColor = "black";
      SQUARES[i].style.color = "white";
      if (oneDMArray[i] !== "-1") SQUARES[i].textContent = oneDMArray[i];
    } else {
      SQUARES[i].style.cursor = "pointer";
    }
    SQUARES[i].setAttribute("value", oneDMArray[i]); //seeting values from data to html nodes
  }
}
function letKnowThemOneAnother(row) {
  let countOfSquares = row * row;
  for (
    let i = 0;
    i < countOfSquares;
    i++ //Going though the squares
  ) {
    let data = {
      order: null,
      isBulb: false,
      isObstacle: false,
      X_RIGHT: [],
      X_LEFT: [],
      Y_UP: [],
      Y_DOWN: [],
      countBulbs: 0,
    };
    data.order = i;

    if (obstacles.includes(SQUARES[i].getAttribute("value"))) {
      data.isObstacle = true;
      data.countBulbs = 0;
    }

    //RIGHT
    for (
      let xR = i;
      xR === i || xR % row !== 0;
      xR++ //Ready
    ) {
      if (obstacles.includes(SQUARES[xR].getAttribute("value"))) {
        data.X_RIGHT.push(xR);
      } else {
        data.X_RIGHT.push(xR);
      }
    }
    //LEFT
    for (let xL = i; xL % row >= 0; xL--) {
      if (obstacles.includes(SQUARES[xL].getAttribute("value"))) {
        data.X_LEFT.push(xL);
      } else {
        data.X_LEFT.push(xL);
      }
      if (xL % row === 0) break;
    }
    //UP
    for (let yUP = i; yUP >= 0; yUP -= row) {
      if (obstacles.includes(SQUARES[yUP].getAttribute("value"))) {
        data.Y_UP.push(yUP);
      } else {
        data.Y_UP.push(yUP);
      }
    }

    //DOWN
    for (let yDOWN = i; yDOWN < countOfSquares; yDOWN += row) {
      if (obstacles.includes(SQUARES[yDOWN].getAttribute("value"))) {
        data.Y_DOWN.push(yDOWN);
      } else {
        data.Y_DOWN.push(yDOWN);
      }
    }

    DATAS.push(data);
    console.log("letThemOneAnother", data);
  }
}
/////////////////////////////////////////////////////////////////