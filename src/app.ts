interface TetrominoCache {
	[prop: string]: string;
}

document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector("#grid");
	const startBtn = document.querySelector("#startBtn") as HTMLButtonElement;
	const scoreElement = document.querySelector(".score") as HTMLButtonElement;
	let score = 0;

	function generateGrid() {
		for (let i = 0; i < 210; i++) {
			const divElement = document.createElement("div");
			if (i >= 200) {
				divElement.classList.add("taken");
			}
			grid?.appendChild(divElement);
		}
	}

	generateGrid();

	const squareWidth = 10;

	const lTeromino = [
		[1, squareWidth + 1, squareWidth * 2 + 1, 2],
		[squareWidth, squareWidth + 1, squareWidth + 2, squareWidth * 2 + 2],
		[1, squareWidth + 1, squareWidth * 2 + 1, squareWidth * 2],
		[
			squareWidth * 2,
			squareWidth + 2,
			squareWidth * 2 + 1,
			squareWidth * 2 + 2,
		],
	];
	const zTetromino = [
		[0, squareWidth, squareWidth + 1, squareWidth * 2 + 1],
		[
			squareWidth + 1,
			squareWidth + 2,
			squareWidth * 2,
			squareWidth * 2 + 1,
		],
		[0, squareWidth, squareWidth + 1, squareWidth * 2 + 1],
		[
			squareWidth + 1,
			squareWidth + 2,
			squareWidth * 2,
			squareWidth * 2 + 1,
		],
	];

	const tTetromino = [
		[1, squareWidth, squareWidth + 1, squareWidth + 2],
		[1, squareWidth + 1, squareWidth + 2, squareWidth * 2 + 1],
		[squareWidth, squareWidth + 1, squareWidth + 2, squareWidth * 2 + 1],
		[1, squareWidth, squareWidth + 1, squareWidth * 2 + 1],
	];

	const oTetromino = [
		[0, 1, squareWidth, squareWidth + 1],
		[0, 1, squareWidth, squareWidth + 1],
		[0, 1, squareWidth, squareWidth + 1],
		[0, 1, squareWidth, squareWidth + 1],
	];

	const iTetromino = [
		[1, squareWidth + 1, squareWidth * 2 + 1, squareWidth * 3 + 1],
		[squareWidth, squareWidth + 1, squareWidth + 2, squareWidth + 3],
		[1, squareWidth + 1, squareWidth * 2 + 1, squareWidth * 3 + 1],
		[squareWidth, squareWidth + 1, squareWidth + 2, squareWidth + 3],
	];

	const TetrominoShapes = [
		lTeromino,
		zTetromino,
		tTetromino,
		oTetromino,
		iTetromino,
	];

	let randomTetromino = Math.floor(Math.random() * TetrominoShapes.length);

	const colors = ["#6155a6", "#e05297", "#f64b3c", "#30e3ca", "#ff2e63"];
	let currentPosition = 4;
	let rotateTetromino = 0;
	let currentTetromino = TetrominoShapes[randomTetromino][rotateTetromino];
	let timeSet: number | null = null;

	const gridSquares = (document.querySelectorAll(
		"#grid div"
	) as unknown) as HTMLElement[];

	function controls(e: { keyCode: number }) {
		if (e.keyCode === 40) {
			moveDown();
		} else if (e.keyCode === 39) {
			// console.log("right");
			moveRight();
		} else if (e.keyCode === 38) {
			// console.log("up");
			rotate();
		} else if (e.keyCode === 37) {
			// console.log("left");
			moveLeft();
		}
	}

	document.addEventListener("keyup", controls);

	function drawTetromino() {
		currentTetromino.forEach((index) => {
			gridSquares[index + currentPosition].classList.add("tetromino");
			gridSquares[index + currentPosition].style.backgroundColor =
				colors[randomTetromino];
		});
	}

	drawTetromino();
	function undrawTetromino() {
		currentTetromino.forEach((index) => {
			gridSquares[index + currentPosition].classList.remove("tetromino");
			gridSquares[index + currentPosition].style.backgroundColor = "";
		});
	}

	function moveDown() {
		undrawTetromino();
		currentPosition += squareWidth;
		drawTetromino();
		freezeTetromino();
	}

	function moveRight() {
		undrawTetromino();

		const isAtRightEdge = currentTetromino.some((index) => {
			return (index + currentPosition) % squareWidth == squareWidth - 1;
		});

		const isTaken = currentTetromino.some((index) => {
			return gridSquares[
				currentPosition + 1 + index + squareWidth
			].classList.contains("taken");
		});

		if (!isAtRightEdge && !isTaken) currentPosition += 1;

		drawTetromino();
	}

	function moveLeft() {
		undrawTetromino();

		const isAtLeftEdge = currentTetromino.some(
			(index) => (currentPosition + index) % squareWidth === 0
		);

		const isTaken = currentTetromino.some((index) => {
			return gridSquares[
				currentPosition - 1 + index + squareWidth
			].classList.contains("taken");
		});
		if (!isAtLeftEdge && !isTaken) currentPosition -= 1;

		drawTetromino();
	}

	//needs work of rotation of tetromino at edge
	function rotate() {
		rotateTetromino += 1;
		if (rotateTetromino === 4) {
			rotateTetromino = 0;
		}

		const nextRotatePosition =
			TetrominoShapes[randomTetromino][rotateTetromino];

		const isAtLeftEdge = nextRotatePosition.some((index) => {
			return (currentPosition + index) % squareWidth === 0;
		});

		let tetrominoPos = currentPosition;
		const isAtRightEdge = currentTetromino.some((index) => {
			tetrominoPos = (index + currentPosition) % squareWidth;
			return tetrominoPos % squareWidth === squareWidth - 1;
		});

		if (tetrominoPos <= 3) {
			if (!isAtLeftEdge) {
				undrawTetromino();

				currentTetromino =
					TetrominoShapes[randomTetromino][rotateTetromino];

				drawTetromino();
			}
		} else if (tetrominoPos >= 4) {
			if (!isAtRightEdge) {
				undrawTetromino();

				currentTetromino =
					TetrominoShapes[randomTetromino][rotateTetromino];

				drawTetromino();
			}
		}
	}

	function freezeTetromino() {
		currentTetromino.forEach((index) => {
			const nextRow = index + currentPosition + squareWidth;
			const row = index + currentPosition;
			const isNextRowTaken = gridSquares[row].classList.contains("taken");

			if (isNextRowTaken) {
				return GenerateNextTetromino();
			}

			const isNextRowTetrominoAndTaken = ["taken", "tetromino"].every(
				(className) => {
					return gridSquares[nextRow].classList.contains(className);
				}
			);

			if (isNextRowTetrominoAndTaken) {
				return GenerateNextTetromino();
			}

			function GenerateNextTetromino() {
				currentTetromino.forEach((index) => {
					gridSquares[index + currentPosition].classList.add("taken");
				});

				currentPosition = 3;
				randomTetromino = Math.floor(
					Math.random() * TetrominoShapes.length
				);
				currentTetromino = TetrominoShapes[randomTetromino][0];
				findCompleteRow();

				drawTetromino();
			}
		});
	}

	let gridlength = gridSquares.length;
	let numOfTetrominoBlock = 0;
	console.log(gridSquares.length);
	let cacheBlockPosition: TetrominoCache = {};

	function findCompleteRow() {
		for (let index = gridSquares.length - 1; index >= 0; index--) {
			const hasTetromino = gridSquares[index].classList.contains(
				"tetromino"
			);
			if (hasTetromino) {
				numOfTetrominoBlock += 1;
				if (numOfTetrominoBlock === 10) {
					removeBlocks(gridlength - 10, gridlength);
					numOfTetrominoBlock = 0;
				}
			}

			if (gridlength - 10 === index) {
				gridlength = index;
				if (numOfTetrominoBlock == 0) {
					console.log("numoftetromino", numOfTetrominoBlock);

					gridlength = gridSquares.length;

					break;
				}
				numOfTetrominoBlock = 0;
			}
		}
		numOfTetrominoBlock = 0;
		gridlength = gridSquares.length;

		function removeBlocks(min: number, max: number) {
			for (let index = min; index <= max - 1; index++) {
				gridSquares[index].classList.remove("tetromino");
				gridSquares[index].style.backgroundColor = "";
			}
			undrawAllTetromino();
			drawAllTetromino();
			score += 100;
			scoreElement.textContent = `${score}`;
		}

		function drawAllTetromino() {
			let pos: keyof typeof cacheBlockPosition;

			for (pos in cacheBlockPosition) {
				const nextPos = parseInt(pos) + squareWidth;
				gridSquares[nextPos].classList.add("tetromino");
				gridSquares[nextPos].classList.add("taken");
				gridSquares[nextPos].style.backgroundColor =
					cacheBlockPosition[pos];
			}
			cacheBlockPosition = {};
		}

		function undrawAllTetromino() {
			for (let index = gridlength - 1; index >= 0; index--) {
				const hasTetromino = gridSquares[index].classList.contains(
					"tetromino"
				);
				if (index < 200 && hasTetromino) {
					cacheBlockPosition[index] =
						gridSquares[index].style.backgroundColor;
					gridSquares[index].classList.remove("tetromino");
					gridSquares[index].classList.remove("taken");
					gridSquares[index].style.backgroundColor = "";
				}
			}
		}
		console.log(cacheBlockPosition);
	}

	startBtn.addEventListener("click", () => {
		if (timeSet == null) {
			timeSet = setInterval(() => moveDown(), 100);
		} else {
			clearInterval(timeSet);
			timeSet = null;
		}
	});
});
