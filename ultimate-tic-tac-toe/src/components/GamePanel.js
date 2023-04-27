import { useState, useRef, useEffect } from "react";
import "./GamePanel.css";
import Modal from "./Modal.js";

const GamePanel = ({ showGrid, handleCloseGrid, player1Name, player2Name }) => {
  const player1 = player1Name;
  const player2 = player2Name;
  const grids = useRef(null);

  const [playerTurnState, setPlayerTurnState] = useState(null);
  const [player1Info, setPlayer1Info] = useState(null);
  const [player2Info, setPlayer2Info] = useState(null);
  const [turnInfo, setTurnInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const handleQuitRequest = () => {
    setPlayerTurnState(null);
    setPlayer1Info(null);
    setPlayer2Info(null);
    setTurnInfo(null);
    setOpen(false);
    setInfo(null);
    handleCloseGrid();
  };

  const setPlayerTurn = () => {
    switch (playerTurnState.name) {
      case player1:
        setTurnInfo(
          <>
            <p>Player: {player2Info.name}</p>
            <div className="div-symbol ">
              <p>Symbol: </p>
              <img
                src={player2Info.symbolPath}
                className={player2Info.symbol + "-mini"}
              ></img>
            </div>
          </>
        );
        return player2Info;
      case player2:
        // Get the path for the image of player's 1 symbol
        setTurnInfo(
          <>
            <p>Player: {player1Info.name}</p>
            <div className="div-symbol ">
              <p>Symbol: </p>
              <img
                src={player1Info.symbolPath}
                className={player1Info.symbol + "-mini"}
              ></img>
            </div>
          </>
        );
        return player1Info;
    }
  };

  const clickHandle = (event, gridIndex, line, column) => {
    // Verifies if the element (cell) already has been clicked
    if (containsClass(event.target)) {
      console.log("Click event disabled on this cell");
      return;
    }

    console.log("[Click Event]", playerTurnState);
    console.log(
      `Player '${playerTurnState.name}', Symbol '${playerTurnState.symbol}' clicked Grid:${gridIndex}, Cell(${line},${column})`
    );

    // Set the css class with the image to the clicked cell
    event.target.className = `cell ${playerTurnState.symbol}`;

    // Update the next player to play
    setPlayerTurnState(setPlayerTurn());

    // After every click check if someone wins
    checkWin();

    // Verify if all the grids are disabled
    if (checkGameEnded()) {
      // Check who has more points
      if (player1Info.points > player2Info.points) {
        // Update Player Rounds Won
        setPlayer1Info({
          name: player1Info.name,
          symbol: player1Info.symbol,
          symbolPath: player1Info.symbolPath,
          points: player1Info.points,
          roundsWon: ++player1Info.roundsWon,
        });
        // Update info to show on modal window
        setInfo(
          <>
            <div className="info">
              Player '{player1Info.name}' wins with {player1Info.points} points
            </div>
            <div className="info-button">
              <button onClick={reset}>Play Again</button>
              <button onClick={handleQuitRequest}>Quit</button>
            </div>
          </>
        );
        console.log(
          `Player '${player1Info.name}' wins with ${player1Info.points} points!`
        );
      } else if (player2Info.points > player1Info.points) {
        // Update Player Rounds Won
        setPlayer2Info({
          name: player2Info.name,
          symbol: player2Info.symbol,
          symbolPath: player2Info.symbolPath,
          points: player2Info.points,
          roundsWon: ++player2Info.roundsWon,
        });

        // Update info to show on modal window
        setInfo(
          <>
            <div className="info">
              Player '{player2Info.name}' wins with {player2Info.points} points
            </div>
            <div className="info-button">
              <button onClick={reset}>Play Again</button>
              <button onClick={handleQuitRequest}>Quit</button>
            </div>
          </>
        );
        console.log(
          `Player '${player2Info.name}' wins with ${player2Info.points} points!`
        );
      } else {
        // Update info to show on modal window
        setInfo(
          <>
            <div className="info">There was a draw!</div>
            <div className="info-button">
              <button onClick={reset}>Play Again</button>
              <button onClick={handleQuitRequest}>Quit</button>
            </div>
          </>
        );
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
      element.classList.contains("X") ||
      element.classList.contains("O") ||
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
        //                    Verify Player 1 Win
        //============================================================
        // Vertically, Horizontally and Diagonal validation
        if (
          checkColumn(children, player1Info.symbol) ||
          checkLine(children, player1Info.symbol) ||
          checkDiagonal(children, player1Info.symbol)
        ) {
          // Player 1 wins this grid
          grid.classList.add(`win${player1Info.symbol}`);

          // Add a class to disable the click event on the cells
          for (let child of children) child.classList.add("disabled");

          // Update Player 1 points
          setPlayer1Info({
            name: player1Info.name,
            symbol: player1Info.symbol,
            symbolPath: player1Info.symbolPath,
            points: ++player1Info.points,
            roundsWon: player1Info.roundsWon,
          });
          return;
        }

        //============================================================
        //                  Verify Player 2 Win
        //============================================================
        // Vertically, Horizontally and Diagonal validation
        if (
          checkColumn(children, player2Info.symbol) ||
          checkLine(children, player2Info.symbol) ||
          checkDiagonal(children, player2Info.symbol)
        ) {

          // Player 1 wins this grid
          grid.classList.add(`win${player2Info.symbol}`);

          // add a class to disable the click event on the cells
          for (let child of children) child.classList.add("disabled");

          // Update Player 2 points
          setPlayer2Info({
            name: player2Info.name,
            symbol: player2Info.symbol,
            symbolPath: player2Info.symbolPath,
            points: ++player2Info.points,
            roundsWon: player2Info.roundsWon,
          });
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

  //  TODO
  //    Verifies if all the grids have a winner
  const checkGameEnded = () => {
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
    setOpen(false);

    // Reset Player's 1 Points and Symbol
    setPlayer1Info({
      name: player1Info.name,
      symbol: player1Info.symbol,
      symbolPath: player1Info.symbolPath,
      points: 0,
      roundsWon: player1Info.roundsWon,
    });

    // Reset Player's 2 Points and Symbol
    setPlayer2Info({
      name: player2Info.name,
      symbol: player2Info.symbol,
      symbolPath: player2Info.symbolPath,
      points: 0,
      roundsWon: player2Info.roundsWon,
    });

    // Clear grid and cells classes
    for (let grid of grids.current.children) {
      grid.classList.remove("winO");
      grid.classList.remove("winX");

      // remove class to disable the click event on the cells
      for (let child of grid.children) {
        child.classList.remove("disabled");
        child.classList.remove("O");
        child.classList.remove("X");
      }
    }
  };

  const buildPlayersInfo = () => {
    return (
      <div className="playersInfo">
        <div className="container">
          <p className="title">Points</p>
          {player1Info != null && player2Info != null && (
            <>
              <p>
                [Player 1] {player1}: {player1Info.points}
              </p>
              <p>
                [Player 2] {player2}: {player2Info.points}
              </p>
            </>
          )}
        </div>
        <div className="container">
          <p className="title">Turn</p>
          {turnInfo != null && turnInfo}
        </div>
        <div className="container">
          <p className="title">Rounds Won</p>
          {player1Info != null && player2Info != null && (
            <>
              <p>
                [Player 1] {player1}: {player1Info.roundsWon}
              </p>
              <p>
                [Player 2] {player2}: {player2Info.roundsWon}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  // After every render of the component useEffect updates who makes the first play
  // The firstPlay parameter comes from App.js
  useEffect(() => {
    // Set the first player name and symbol
    if (showGrid && player1Info == null && player2Info == null) {
      // Get the random symbol between 'O' and 'X'
      let symbolTmp, firstPlay, playerTurn;
      Math.random() < 0.5 ? (symbolTmp = "X") : (symbolTmp = "O");
      Math.random() < 0.5 ? (firstPlay = player1) : (firstPlay = player2);

      // Compare symbol of the first player and build second player structure
      let player1TmpStruct, player2TmpStruct;

      switch (symbolTmp) {
        case "O":
          // Build first player structure
          player1TmpStruct = {
            name: player1,
            symbol: "O",
            symbolPath: "o.png",
            points: 0,
            roundsWon: 0,
          };

          // Build second player structure
          player2TmpStruct = {
            name: player2,
            symbol: "X",
            symbolPath: "x.png",
            points: 0,
            roundsWon: 0,
          };

          // player2Symbol = "X";
          // symbolPath = "public/x.png";
          break;
        case "X":
          // Build first player structure
          player1TmpStruct = {
            name: player1,
            symbol: "X",
            symbolPath: "x.png",
            points: 0,
            roundsWon: 0,
          };

          // Build second player structure
          player2TmpStruct = {
            name: player2,
            symbol: "O",
            symbolPath: "o.png",
            points: 0,
            roundsWon: 0,
          };
          break;
      }

      // Set the structures in different states
      setPlayer1Info(player1TmpStruct);
      setPlayer2Info(player2TmpStruct);

      // Check who plays first and whats symbol is assigned to him
      // Based on that info, create a structure for each player
      switch (firstPlay) {
        case player1:
          playerTurn = player1TmpStruct;
          break;
        case player2:
          playerTurn = player2TmpStruct;
          break;
      }

      console.log("[FIRST PLAY]", playerTurn);
      setTurnInfo(
        <>
          <p>Player: {playerTurn.name}</p>
          <div className="div-symbol ">
            <p>Symbol: </p>
            <img
              src={playerTurn.symbolPath}
              className={playerTurn.symbol + "-mini"}
            ></img>
          </div>
        </>
      );

      setPlayerTurnState(playerTurn);
    }
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
          <Modal open={open} title={"Game Ended"} info={info} onHide={reset} />
        </main>
      )}
    </>
  );
};

export default GamePanel;
