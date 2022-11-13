////////////////////////////////////////////
//              DOM
const START_BUTTON = document.querySelector("#start_btn");
const INPUTS = document.getElementsByTagName("input");
const PAGE_1 = document.querySelector(".page_1");
const PAGE_2 = document.querySelector(".page_2");
const GAME_SCREEN = document.querySelector(".game_screen");
const ERROR_PAGE = document.querySelector(".error_page");
const CLOSE_BTN = document.querySelector(".close_btn");
const PLAYER_NAME = document.querySelector(".player_name");
const PLAYER_LEVEL = document.querySelector(".player_level");
const TIME = document.querySelector(".time");
const SCORES = document.querySelector(".table_scores");
const TABLE = document.querySelector(".tables_wrapper");
const FORM = document.querySelector("form");
const TABLE_DATAS = document.querySelector(".table-data");

let SQUARES;
////////////////////////////////////////////

//#########################################

////////////////////////////////////////////
//              Variables

let checkBtn = true;
let isTABLE = false;
let timer;
let JSON_value = JSON.parse(localStorage.getItem("PLAYER_DATA")) ?? [];
let ArrayForLocalStorage = [...JSON_value];

//___________sec, min, hour
let timerArr = [0, 0];
let Name;
let Level;
let isGameOver = false;
let DATAS = [];
let obstacles = ["-1", "0", "1", "2", "3"];
let obstaclesSub = ["1", "2", "3"];
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
CLOSE_BTN.addEventListener("click", closeButton);
SCORES.addEventListener("click", scoreHandler);
////////////////////////////////////////////

//#########################################

///////////////////////////////////////////
//              EVENT FUNCTIONS
function scoreHandler(){
	if(!isTABLE)
	{
		TABLE.style.display = "flex";
		FORM.style.display = "none";
		isTABLE = true;
	}else{
		TABLE.style.display = "none";
		FORM.style.display = "flex";
		isTABLE = false
	}
}


function closeButton() {
	ERROR_PAGE.style.display = "none";
	PAGE_1.style.display = "flex";
}
function startButton(e) {
	e.preventDefault();
	let row;
	let levelArr;

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

	if (Level === undefined || Name === "") {
		ERROR_PAGE.style.display = "flex";
		PAGE_1.style.display = "none";
		PAGE_2.style.display = "none";
	}
	else {
		PAGE_2.style.display = "flex";
		PAGE_1.style.display = "none";
		PLAYER_NAME.textContent = Name;
		PLAYER_LEVEL.textContent = Level;
		createGameBoard(row);
		displayingBlocks(levelArr);
		letKnowThemOneAnother(row);
	}

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

			if (checkBtn) {
				timer = setTimeout(timerHandler, 1000);
				checkBtn = false;
			};
			let id = parseInt(SQUARES[i].id);

			if (!DATAS[id].isBulb) {
				//call illimunate function 
				if (checkBlocks(id)) {
					DATAS[id].isBulb = true;
					SQUARES[id].innerHTML = `<img class="image" src="./assets/idea.png" />`;

					illimunate(id, row);
				}
			}
			else {
				//call deillimunate function
				deillimunate(id, row);
				reverseCheckBox(id);
				reIllimunatae(row);
				
			}
			if(winnerChecker(row))
			{
				console.log("WINNER");
				if (!checkBtn) {
					checkBtn = true;
    				clearTimeout(timer);
				};
				toLocalStorage(Name, Level, TIME.innerHTML);
				// Name = "";
				// Level = "";
				
				console.log(ArrayForLocalStorage)
			}
		});
	}
}
function reIllimunatae(row) {
	for (let i = 0; i < row * row; i++) {
		if (DATAS[i].isBulb === true) {
			illimunate(i, row);
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
				return false;
			} else if (
				block.isObstacle &&
				block.countBulbs < parseInt(SQUARES[block.order].getAttribute("value"))
			) {
				block.countBulbs++;

			
			}
			if(block.countBulbs === parseInt(SQUARES[block.order].getAttribute("value")))
			{	
				SQUARES[block.order].style.backgroundColor = "green";
			}
		}
	}

	return true;
}
function reverseCheckBox(id) {
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
		if (block.isObstacle && parseInt(SQUARES[block.order].getAttribute("value")) !== -1)
		{
			block.countBulbs--;
			SQUARES[block.order].style.backgroundColor = "black"
		}
	}
}
function illimunate(id, row) {
	SQUARES[id].style.backgroundColor = "yellow";
	for (let i = 0; i < row * row; i++) {

		if (id === parseInt(DATAS[i].order)) {
			for (let j = 1; j < DATAS[id].X_LEFT.length; j++) {
				if (
					!obstacles.includes(
						SQUARES[DATAS[id].X_LEFT[j]].getAttribute("value")
					)
				) {
					SQUARES[DATAS[id].X_LEFT[j]].style.backgroundColor = "yellow";
				}
				else {
					break;
				}
				if (DATAS[DATAS[id].X_LEFT[j]].isBulb === true) {
					SQUARES[DATAS[id].X_LEFT[j]].style.backgroundColor = "red";//
					SQUARES[DATAS[id].X_LEFT[0]].style.backgroundColor = "red";

				}
			}

			for (let j = 1; j < DATAS[id].X_RIGHT.length; j++) {
				if (
					!obstacles.includes(
						SQUARES[DATAS[id].X_RIGHT[j]].getAttribute("value")
					)
				) {
					SQUARES[DATAS[id].X_RIGHT[j]].style.backgroundColor = "yellow";
				} else {
					break;
				}
				if (DATAS[DATAS[id].X_RIGHT[j]].isBulb === true) {
					SQUARES[DATAS[id].X_RIGHT[j]].style.backgroundColor = "red";
					SQUARES[DATAS[id].X_RIGHT[0]].style.backgroundColor = "red";
				}
			}

			for (let j = 1; j < DATAS[id].Y_DOWN.length; j++) {
				if (
					!obstacles.includes(
						SQUARES[DATAS[id].Y_DOWN[j]].getAttribute("value")
					)
				) {
					SQUARES[DATAS[id].Y_DOWN[j]].style.backgroundColor = "yellow";

				} else {
					break;
				}
				if (DATAS[DATAS[id].Y_DOWN[j]].isBulb === true) {
					SQUARES[DATAS[id].Y_DOWN[j]].style.backgroundColor = "red";
					SQUARES[DATAS[id].Y_DOWN[0]].style.backgroundColor = "red";
				}
			}

			for (let j = 1; j < DATAS[id].Y_UP.length; j++) {
				if (
					!obstacles.includes(
						SQUARES[DATAS[id].Y_UP[j]].getAttribute("value")
					)
				) {
					SQUARES[DATAS[id].Y_UP[j]].style.backgroundColor = "yellow";
				} else {
					break;
				}
				if (DATAS[DATAS[id].Y_UP[j]].isBulb === true) {
					SQUARES[DATAS[id].Y_UP[j]].style.backgroundColor = "red";
					SQUARES[DATAS[id].Y_UP[0]].style.backgroundColor = "red";
				}
			}
		}
	}
}
function deillimunate(id, row) {
	for (let i = 0; i < row * row; i++) {
		if (id === parseInt(DATAS[i].order)) {

			DATAS[id].isBulb = false;
			SQUARES[id].innerHTML = ``;
			for (let j = 0; j < DATAS[id].X_LEFT.length; j++) {
				if (DATAS[DATAS[id].X_LEFT[j]].isBulb === true && j !== 0) {
					SQUARES[DATAS[id].X_LEFT[j]].style.backgroundColor = "yellow";
				}
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
				if (DATAS[DATAS[id].X_RIGHT[j]].isBulb === true && j !== 0) {
					SQUARES[DATAS[id].X_RIGHT[j]].style.backgroundColor = "yellow";
				}
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
				if (DATAS[DATAS[id].Y_DOWN[j]].isBulb === true && j !== 0) {
					SQUARES[DATAS[id].Y_DOWN[j]].style.backgroundColor = "yellow";
				}
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
				if (DATAS[DATAS[id].Y_UP[j]].isBulb === true && j !== 0) {
					SQUARES[DATAS[id].Y_UP[j]].style.backgroundColor = "yellow";
				}


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
function displayingBlocks(array) {
	let oneDMArray = array.flat(1);
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
	}
}
function timerHandler() {
    timerArr[0]++;
    if (timerArr[0] > 59) {
        timerArr[1]++;
        timerArr[0] = 0;
    };
    for (let i = 0; i < timerArr.length; i++){
        if (String(timerArr[i]).length < 2)
        timerArr[i] = '0' + timerArr[i];
        else;
    }
    TIME.innerHTML = `${timerArr[1]} : ${timerArr[0]}`;
    timer = setTimeout(timerHandler, 1000);
};
function winnerChecker(row)
{
	let countOfYellow = 0;
	let countOfGreens = 0;
	let countObstacles = 0;
	let countOfNoneZero = 0;
	for (let i = 0; i < SQUARES.length; i++)
	{
		if(!DATAS[i].isObstacle)
		{
			if(window.getComputedStyle(SQUARES[i] ,null).getPropertyValue('background-color') == "rgb(255, 255, 0)")
			{
				countOfYellow++;
			}
		}else{
			if(window.getComputedStyle(SQUARES[i] ,null).getPropertyValue('background-color') == "rgb(0, 128, 0)")
			{
				countOfGreens++;
			}
			countObstacles++;
		}
		if(obstaclesSub.includes(SQUARES[i].getAttribute("value")))
		{
			countOfNoneZero++;
		}
	}
	if((countOfYellow+countObstacles) === row*row && countOfGreens === countOfNoneZero)
	{
		return true;
	}
	else{
		return false;
	}
}

function toLocalStorage(user_name, user_level, user_time)
{
	let USER_DATA = {
		NAME: "",
		LEVEL: "",
		TIME: ""
	}
	
	USER_DATA.NAME = user_name;
	USER_DATA.LEVEL = user_level;
	USER_DATA.TIME = user_time;
	ArrayForLocalStorage.push(USER_DATA);
	localStorage.setItem("PLAYER_DATA", JSON.stringify(ArrayForLocalStorage));
}

function toTable(user_name, user_level, user_time){
	let row = document.createElement("div");
	row.className = "row";

	let name = document.createElement("div");
	name.className = "name";

	let level = document.createElement("div");
	level.className = "level";

	let time = document.createElement("div");
	time.className = "time";

	name.textContent = user_name;
	level.textContent = user_level;
	time.textContent = user_time;


	row.appendChild(name);
	row.appendChild(level);
	row.appendChild(time);
	TABLE_DATAS.appendChild(row)

}

window.addEventListener("load", () => {
	for (let i = 0; i < ArrayForLocalStorage.length; i++)
	{
		let a = ArrayForLocalStorage[i]
		toTable(a.NAME, a.LEVEL, a.TIME);
	}
})