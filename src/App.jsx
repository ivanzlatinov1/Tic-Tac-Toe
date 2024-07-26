import { useState } from "react";

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	const moves = history.map((_, move) => {
		let description;
		if (move > 0) {
			description = 'Go to move #' + move;
		} else {
			description = 'Go to game start';
		}
		return (
			<li key={move}>
				<button className="desc-button" onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	return (
		<div className="container">
			<div className="sidebar left-sidebar">
				<img src="/fireX.png" alt="Fire X" className="sidebar-image" />
				<img src="/versus1.png" alt="VS" className="sidebar-image" />
				<img src="/fireO.png" alt="Fire O" className="sidebar-image" />
			</div>
			<div className="main-content">
				<div className="game">
					<h1>WELCOME TO MY FIRST GAME!</h1>
					<h2 className="game-heading" style={{ fontWeight: "bold" }}>Tic-Tac-Toe</h2>
					<div className="game-board">
						<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
					</div>
				</div>
			</div>
			<div className="sidebar right-sidebar">
				<div className="game-info">
					<ol>{moves}</ol>
				</div>
			</div>
		</div>
	);
}

function Board({ xIsNext, squares, onPlay }) {

	function handleClick(i) {
		if (squares[i] || calculateWinner(squares)) {
			return;
		}

		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = 'X';
		}
		else {
			nextSquares[i] = 'O';
		}
		onPlay(nextSquares);
	}

	const result = calculateWinner(squares);
	const winner = result ? result.winner : null;
	const winningLine = result ? result.winningLine : null;

	let status;
	if (winner) {
		status = "Winner: " + winner;
	}
	else if (squares.every(square => square != null)) {
		status = "Draw!";
	}
	else {
		status = "Player turn: " + (xIsNext ? "X" : "O");
	}

	function renderSquare(i) {
		return (
			<Square
				value={squares[i]}
				onSquareClick={() => handleClick(i)}
				isWinningSquare={winningLine && winningLine.includes(i)}
			/>
		);
	}

	return (
		<>
			<div className="status">{status}</div>
			<div className="board-main">
				<div className="board-row">
					{renderSquare(0)}
					{renderSquare(1)}
					{renderSquare(2)}
				</div>
				<div className="board-row">
					{renderSquare(3)}
					{renderSquare(4)}
					{renderSquare(5)}
				</div>
				<div className="board-row">
					{renderSquare(6)}
					{renderSquare(7)}
					{renderSquare(8)}
				</div>
			</div>
		</>
	);
}

function Square({ value, onSquareClick, isWinningSquare }) {
	return (
		<button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>{value}</button>
	);
}

function calculateWinner(squares) {
	const winningLines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	]

	for (let i = 0; i < winningLines.length; i++) {
		const [a, b, c] = winningLines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], winningLine: winningLines[i] };
		}
	}
	return null;
}