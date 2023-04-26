import { useState, useEffect } from "react";
import "./GamePanel.css";

const GamePanel = ({
  showGrid,
  gameMode,
  firstPlay,
  player1Name,
  player2Name,
}) => {
  const [playerTurn, setPlayerTurn] = useState(null);

  const clickHandle = (event, gridIndex, line, column) => {
    switch (playerTurn) {
      case player1Name:
        console.log(
          `Player 1 clicked [grid:${gridIndex}, cell(${line},${column})]`
        );
        event.target.className = "cell playX";
        setPlayerTurn(player2Name);
        break;
      case player2Name:
        console.log(
          `Player 2 clicked [grid:${gridIndex}, cell(${line},${column})]`
        );
        event.target.className = "cell playO";
        setPlayerTurn(player1Name);
        break;
      case "computer":
        console.log(
          `Computer played [grid:${gridIndex}, cell(${line},${column})]`
        );
        event.target.className = "cell playO";
        setPlayerTurn(player1Name);
        break;
      default:
        console.log(`Error clickHandle event`);
    }
  };

  const buildGrids = () => {
    let content = [];
    let outerGrid = 9; // 3x3 grid
    for (let i = 0; i < outerGrid; i++) {
      content.push(gameGrid(i));
    }
    return content;
  };

  const gameGrid = (i) => {
    // This function receives the grid index
    // Each cell has a click event, where the cell index is sent
    // to a separate function to handle click events
    return (
      <div key={i} className="box">
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 0, 0)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 0, 1)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 0, 2)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 1, 0)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 1, 1)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 1, 2)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 2, 0)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 2, 1)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 2, 2)}
        ></div>
      </div>
    );
  };

  useEffect(() => {
    if (playerTurn == null) setPlayerTurn(firstPlay);
  });

  return (
    <>
      {showGrid && (
        <main>
          <div className="grid-wrapper">{buildGrids()}</div>
        </main>
      )}
    </>
  );
};

export default GamePanel;
