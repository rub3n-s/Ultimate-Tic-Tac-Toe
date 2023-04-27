import { useState, useRef, useEffect } from "react";
import "./GamePanel.css";
import Modal from "./Modal.js";

const GamePanel = ({
  showGrid,
  gameMode,
  firstPlay,
  player1Name,
  player2Name,
}) => {
  const [playerTurn, setPlayerTurn] = useState(null);
  const grids = useRef(null);
  const [player1PointsState, setPlayer1PointsState] = useState(0);
  const [player2PointsState, setPlayer2PointsState] = useState(0);

  let player1Points = 0;
  let player2Points = 0;

  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const clickHandle = (event, gridIndex, line, column) => {
    // Verifies if the element (cell) already has been clicked
    if (containsClass(event.target)) {
      console.log("Click event disabled on this cell");
      return;
    }

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

    // After every click check if someone wins
    checkWin();

    // Verify if all the grids are disabled
    if (checkGameEnded()) {
      // Check who has more points
      if (player1Points > player2Points) {
        setInfo(
          <div className="info">
            Player '{player1Name}' wins with {player2Points} points
          </div>
        );
        console.log(
          `Player '${player1Name}' wins with ${player1Points} points!`
        );
      } else if (player2Points > player1Points) {
        setInfo(
          <div className="info">
            Player '{player2Name}' wins with {player2Points} points
          </div>
        );
        console.log(
          `Player '${player2Name}' wins with ${player2Points} points!`
        );
      } else {
        setInfo(`There was a draw!`);
        console.log(`There was a draw!`);
      }

      // Open Modal Window
      setOpen(true);
    }
  };

  const buildGrids = () => {
    let content = [];
    let outerGrid = 3 * 3; // 3x3 grid
    for (let i = 0; i < outerGrid; i++) content.push(gameGrid(i));
    return content;
  };

  const containsClass = (element) => {
    return (
      element.classList.contains("playX") ||
      element.classList.contains("playO") ||
      element.classList.contains("disabled")
    );
  };

  const checkWin = () => {
    for (let grid of grids.current.children) {
      // Start by verifying if someone already won on this panel
      if (
        !grid.classList.contains("winX") &&
        !grid.classList.contains("winO")
      ) {
        // 'box' elements > div's that contain the cells
        // For each grid object ('box' > div) verify cells (grid object children)
        const children = grid.children;

        // Cells Layout
        // (0,0)=0 (0,1)=1 (0,2)=2
        // (1,0)=3 (1,1)=4 (1,2)=5
        // (2,0)=6 (2,1)=7 (2,2)=8

        //============================================================
        //                    Verify 'X' Win  (Player 1)
        //============================================================
        // Vertically, Horizontally and Diagonal validation
        if (
          checkColumn(children, "playX") ||
          checkLine(children, "playX") ||
          checkDiagonal(children, "playX")
        ) {
          // 'X' wins this grid
          grid.classList.add("winX");

          // add a class to disable the click event on the cells
          for (let child of children) child.classList.add("disabled");

          // Update Player 2 points
          player1Points++;
          setPlayer1PointsState(player1Points);
          return;
        }

        //============================================================
        //                    Verify 'O' Win  (Player2 or Computer)
        //============================================================
        // Vertically, Horizontally and Diagonal validation
        if (
          checkColumn(children, "playO") ||
          checkLine(children, "playO") ||
          checkDiagonal(children, "playO")
        ) {
          // 'X' wins this grid
          grid.classList.add("winO");

          // add a class to disable the click event on the cells
          for (let child of children) child.classList.add("disabled");

          // Update Player 2 points
          player2Points++;
          setPlayer2PointsState(player2Points);
          return;
        }
      }
    }
  };

  const checkColumn = (children, className) => {
    for (let i = 0; i < 3; i++) {
      switch (i) {
        case 0: // coords: (0,0) (1,0) (2,0)
          if (
            children[0].classList.contains(className) &&
            children[3].classList.contains(className) &&
            children[6].classList.contains(className)
          )
            return true;
          break;
        case 1: // coords: (0,1) (1,1) (2,1)
          if (
            children[1].classList.contains(className) &&
            children[4].classList.contains(className) &&
            children[7].classList.contains(className)
          )
            return true;
          break;
        case 2: // coords: (0,2) (1,2) (2,2)
          if (
            children[2].classList.contains(className) &&
            children[5].classList.contains(className) &&
            children[8].classList.contains(className)
          )
            return true;
          break;
      }
    }
    return false;
  };

  const checkLine = (children, className) => {
    for (let i = 0; i < 3; i++) {
      switch (i) {
        case 0: // coords: (0,0) (0,1) (0,2)
          if (
            children[0].classList.contains(className) &&
            children[1].classList.contains(className) &&
            children[2].classList.contains(className)
          )
            return true;
          break;
        case 1: // coords: (1,0) (1,1) (1,2)
          if (
            children[3].classList.contains(className) &&
            children[4].classList.contains(className) &&
            children[5].classList.contains(className)
          )
            return true;
          break;
        case 2: // coords: (2,0) (2,1) (2,2)
          if (
            children[6].classList.contains(className) &&
            children[7].classList.contains(className) &&
            children[8].classList.contains(className)
          )
            return true;
          break;
      }
    }
    return false;
  };

  const checkDiagonal = (children, className) => {
    // coords: (0,0) (1,1) (2,2)
    if (
      children[0].classList.contains(className) &&
      children[4].classList.contains(className) &&
      children[8].classList.contains(className)
    )
      return true;
    // coords: (0,2) (1,1) (2,0)
    else if (
      children[2].classList.contains(className) &&
      children[4].classList.contains(className) &&
      children[6].classList.contains(className)
    )
      return true;
    else return false;
  };

  const checkGameEnded = () => {
    //if (!grid.classList.contains("disabled")) return false;
    for (let grid of grids.current.children)
      if (grid.classList.contains("winO") || grid.classList.contains("winX"))
        return true;
    return false;
  };

  const gameGrid = (i) => {
    // This function receives the grid index
    // Each cell has a click event, where the cell index is sent
    // to a separate function to handle click events
    let element = (
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

    return element;
  };

  const reset = () => {
    console.log("Reseting game...");
  };

  const buildPlayersInfo = () => {
    return (
      <div className="playersInfo">
        <p>Points</p>
        <p>
          [Player 1] {player1Name}: {player1PointsState}
        </p>
        {gameMode == "pvc" && <p>Computer: {player2PointsState}</p>}
        {gameMode == "pvp" && (
          <p>
            [Player 2] {player1Name}: {player2PointsState}
          </p>
        )}
      </div>
    );
  };

  const handleClose = () => setOpen(false);

  // After every render of the component useEffect updates who makes the first play
  // The firstPlay parameter comes from App.js
  useEffect(() => {
    if (playerTurn == null) setPlayerTurn(firstPlay);
  });

  return (
    <>
      {showGrid && (
        <main>
          <div className="filler"></div>
          <div className="grid-wrapper" ref={grids}>
            {buildGrids()}
          </div>
          {buildPlayersInfo()}
          <Modal
            open={open}
            title={"Game Ended"}
            info={info}
            onHide={handleClose}
          />
        </main>
      )}
    </>
  );
};

export default GamePanel;
