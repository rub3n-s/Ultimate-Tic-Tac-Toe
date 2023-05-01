import { useState, useRef, useEffect } from "react";
import "./GamePanel.css";
import Modal from "./Modal.js";

const GamePanel = ({ showGrid, gameMode, handleCloseGrid, player1Name, player2Name }) => {
  const player1 = player1Name;
  const player2 = player2Name;
  const grids = useRef(null);
  const [playerTurnState, setPlayerTurnState] = useState(null);
  const [player1Info, setPlayer1Info] = useState(null);
  const [player2Info, setPlayer2Info] = useState(null);
  const [turnInfo, setTurnInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalState] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [nextTable, setNextTable] = useState(null);

  const clickHandle = (event, gridIndex, cellIndex) => {
    // Verifies if it's the computer turn to play
    if (gameMode === "pvc" && playerTurnState.name === "computer") {
      console.log("It's the computer turn to play");
      return;
    }

    // Verifies if the element (cell) already has been clicked
    if (containsClass(event.target)) {
      console.log("Click event disabled on this cell");
      return;
    }

    // Store the current play
    const currentPlay = {
      gridIndex: gridIndex,
      cellIndex: cellIndex,
    };

    console.log(
      "[Click Event]",
      "\n",
      playerTurnState,
      "\n",
      currentPlay,
      "\n",
      grids.current.children[gridIndex].children[cellIndex]
    );

    // Set the css class with the image to the clicked cell
    event.target.className = `cell ${playerTurnState.symbol}`;

    // After every click check if someone wins
    if (checkWin(grids.current.children[gridIndex], playerTurnState)) {
      // Check player 1 and player 2 because of PvP mode
      switch (playerTurnState) {
        case player1Info:
          // Update Player 1 points
          setPlayer1Info({
            name: playerTurnState.name,
            symbol: playerTurnState.symbol,
            symbolPath: playerTurnState.symbolPath,
            points: ++playerTurnState.points,
            roundsWon: playerTurnState.roundsWon,
          });
          break;
        case player2Info:
          // Update Player 2 points
          setPlayer2Info({
            name: playerTurnState.name,
            symbol: playerTurnState.symbol,
            symbolPath: playerTurnState.symbolPath,
            points: ++playerTurnState.points,
            roundsWon: playerTurnState.roundsWon,
          });
          break;
      }

      console.log(`Player '${playerTurnState.name}' won table ${gridIndex}`, grids.current.children[gridIndex]);
    }

    // Verify if all the grids are disabled
    if (checkGameEnded()) {
      console.log("[Game Ended] Displaying modal window");
      updateInfo();
    } else {
      // Set the next table to be played
      setNextPlay(cellIndex, "Click Event");
    }

    // Update the next player to play
    setPlayerTurnState(setPlayerTurn());
  };

  const containsClass = (element) => {
    return (
      element.classList.contains("X") || element.classList.contains("O") || element.classList.contains("disabled-cell")
    );
  };

  // Updates the Info Panel and Modal content
  const updateInfo = () => {
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
      const message = `Player '${player1Info.name}' wins with ${player1Info.points} completed tables!`;
      setModalInfo(message);
      console.log(message);
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
      const message = `Player '${player2Info.name}' wins with ${player2Info.points} completed tables!`;
      setModalInfo(message);
      console.log(message);
    } else {
      // Update info to show on modal window
      const message = `There was a tie!`;
      setModalInfo(message);
      console.log(message);
    }

    // Open Modal Window
    setOpen(true);

    // Set the end of the game
    setGameEnded(true);
    return;
  };

  const setModalInfo = (message) => {
    setModalState(
      <>
        <div className="info">{message}</div>
        <div className="info-button">
          <button onClick={reset}>Play Again</button>
          <button onClick={handleQuitRequest}>Quit</button>
        </div>
      </>
    );
  };

  /* =======================================================
                    Handle Next Play
     =======================================================
  */
  // Get the current played cell, if AVAILABLE, returns the grid with that index
  const setNextPlay = (cellIndex, event) => {
    // Check if the next grid is available
    if (!isGridAvailable(grids.current.children[cellIndex])) {
      console.log(`[Invalid Table] Table ${cellIndex} is won already, computer is picking other table\n`,grids.current.children[cellIndex]);
      // Clear disabled grids/cells and update them according to the last play
      cellIndex = getRandomGrid(event);
    }

    // Clear disabled grids/cells and update them according to the last play
    clearDisabled();
    disableTables(cellIndex);

    // Set the next table index based on the previous cell index
    setNextTable(cellIndex);
  };

  // Function to evaluate if a grid is disabled
  const isGridAvailable = (grid) => {
    // Check if all the cells are filled
    const cellsFilled = Array.from(grid.children).filter(
      (x) => x.classList.contains(player1Info.symbol) || x.classList.contains(player2Info.symbol)
    );
    let gridIsFull = false;
    if (cellsFilled.length == 9) gridIsFull = true;

    // Check if the grid is won already
    const gridIsWon = grid.classList.contains("winX") || grid.classList.contains("winO");

    // For a grid to be available, gridIsWon==false && gridIsFull==false
    return !gridIsFull && !gridIsWon;
  };

  const getRandomGrid = (message) => {
    // Get an array of available grids
    const availableGrids = Array.from(grids.current.children).filter((x) => isGridAvailable(x));
    console.log("Available Grids\n", availableGrids);

    // Get a random element from the array
    if (availableGrids.length > 0) {
      const randomGrid = availableGrids[Math.floor(Math.random() * availableGrids.length)];
      const randomGridIndex = Array.from(grids.current.children).indexOf(randomGrid);
      console.log(`[${message}] New table randomly generated`, randomGrid);
      return randomGridIndex;
    }

    console.log("[getRandomGrid] Error getting new random grid");
    return null;
  };

  /* =======================================================
                    Set Next Player Turn
     =======================================================
     After every cell click the next player to play is set
  */
  const setPlayerTurn = () => {
    switch (playerTurnState.name) {
      case player1:
        setTurnInfo(
          <>
            <p>Player: {player2Info.name}</p>
            <div className="div-symbol ">
              <p>Symbol: </p>
              <img src={player2Info.symbolPath} className={player2Info.symbol + "-mini"} alt={player2Info.symbol}></img>
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
              <img src={player1Info.symbolPath} className={player1Info.symbol + "-mini"} alt={player1Info.symbol}></img>
            </div>
          </>
        );
        return player1Info;
    }
  };

  // =======================================================
  //                Verify Plays / Game End
  // =======================================================
  const checkWin = (grid, player) => {
    let cells = [];
    let cellIndex = 0;
    let symbols = 0;

    /* ================================
                  LINES 
       ================================
    */
    for (let line = 0; line < 3; line++) {
      cells = [];
      symbols = 0;
      for (let column = 0; column < 3; column++) {
        cells.push({
          index: cellIndex,
          hasClass: grid.children[cellIndex].classList.contains(player.symbol),
        });
        cellIndex++;
      }

      // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
      symbols = cells.filter((x) => x.hasClass === true).length;
      if (symbols === 3) {
        // Player wins this grid
        grid.classList.add(`win${player.symbol}`);
        grid.classList.remove("disabled-grid");

        // add a class to disable the click event on the cells
        for (let child of grid.children) child.classList.add("disabled-cell");

        return true;
      }
    }

    /* ================================
                  COLUMNS 
       ================================    
      Cells Layout
        0  1  2
        3  4  5
        6  7  8     */

    for (let column = 0; column < 3; column++) {
      cells = [];
      symbols = 0;
      switch (column) {
        case 0: // Column 0
          cells.push(
            {
              index: 0,
              hasClass: grid.children[0].classList.contains(player.symbol),
            },
            {
              index: 3,
              hasClass: grid.children[3].classList.contains(player.symbol),
            },
            {
              index: 6,
              hasClass: grid.children[6].classList.contains(player.symbol),
            }
          );

          // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
          symbols = cells.filter((x) => x.hasClass === true).length;
          if (symbols === 3) {
            // Player wins this grid
            grid.classList.add(`win${player.symbol}`);
            grid.classList.remove("disabled-grid");

            // add a class to disable the click event on the cells
            for (let child of grid.children) child.classList.add("disabled-cell");

            return true;
          }
          break;
        case 1: // Column 1
          cells.push(
            {
              index: 1,
              hasClass: grid.children[1].classList.contains(player.symbol),
            },
            {
              index: 4,
              hasClass: grid.children[4].classList.contains(player.symbol),
            },
            {
              index: 7,
              hasClass: grid.children[7].classList.contains(player.symbol),
            }
          );

          // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
          symbols = cells.filter((x) => x.hasClass === true).length;
          if (symbols === 3) {
            // Player wins this grid
            grid.classList.add(`win${player.symbol}`);
            grid.classList.remove("disabled-grid");

            // add a class to disable the click event on the cells
            for (let child of grid.children) child.classList.add("disabled-cell");

            return true;
          }
          break;
        case 2: // Column 2
          cells.push(
            {
              index: 2,
              hasClass: grid.children[2].classList.contains(player.symbol),
            },
            {
              index: 5,
              hasClass: grid.children[5].classList.contains(player.symbol),
            },
            {
              index: 8,
              hasClass: grid.children[8].classList.contains(player.symbol),
            }
          );

          // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
          symbols = cells.filter((x) => x.hasClass === true).length;
          if (symbols === 3) {
            // Player wins this grid
            grid.classList.add(`win${player.symbol}`);
            grid.classList.remove("disabled-grid");

            // add a class to disable the click event on the cells
            for (let child of grid.children) child.classList.add("disabled-cell");

            return true;
          }
          break;
      }
    }

    /* ================================
                  DIAGONALS 
       ================================    
      Cells Layout
        0  1  2
        3  4  5
        6  7  8     */

    // Check 2 diagonals
    for (let diagonal = 0; diagonal < 2; diagonal++) {
      cells = [];
      symbols = 0;
      switch (diagonal) {
        case 0:
          cells.push(
            {
              index: 0,
              hasClass: grid.children[0].classList.contains(player.symbol),
            },
            {
              index: 4,
              hasClass: grid.children[4].classList.contains(player.symbol),
            },
            {
              index: 8,
              hasClass: grid.children[8].classList.contains(player.symbol),
            }
          );

          // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
          symbols = cells.filter((x) => x.hasClass === true).length;
          if (symbols === 3) {
            // Player wins this grid
            grid.classList.add(`win${player.symbol}`);
            grid.classList.remove("disabled-grid");

            // add a class to disable the click event on the cells
            for (let child of grid.children) child.classList.add("disabled-cell");

            return true;
          }
          break;
        case 1:
          cells.push(
            {
              index: 2,
              hasClass: grid.children[2].classList.contains(player.symbol),
            },
            {
              index: 4,
              hasClass: grid.children[4].classList.contains(player.symbol),
            },
            {
              index: 6,
              hasClass: grid.children[6].classList.contains(player.symbol),
            }
          );

          // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
          symbols = cells.filter((x) => x.hasClass === true).length;
          if (symbols === 3) {
            // Player wins this grid
            grid.classList.add(`win${player.symbol}`);
            grid.classList.remove("disabled-grid");

            // add a class to disable the click event on the cells
            for (let child of grid.children) child.classList.add("disabled-cell");
            return true;
          }
          break;
      }
    }

    return false;
  };

  //    Verifies if all the grids have a winner
  const checkGameEnded = () => {
    // Check if all the tables have a winner
    const allTablesWon = Array.from(grids.current.children).filter(
      (x) => x.classList.contains("winX") || x.classList.contains("winO")
    );
    // All tables have a winner
    if (allTablesWon.length == 9) return true;

    // Check if all the cells are filled
    for (let grid of grids.current.children) {
      if (!grid.classList.contains("winX") && !grid.classList.contains("winO")) {
        const gridIsFull = Array.from(grid.children).filter(
          (x) => x.classList.contains(player1Info.symbol) || x.classList.contains(player2Info.symbol)
        );
        if (gridIsFull.length < 9) return false;
      }
    }

    return true;
  };

  // =======================================================
  //                    Build Grids
  // =======================================================
  const buildGrids = () => {
    let content = [];
    let outerGrid = 3 * 3; // 3x3 grid
    for (let i = 0; i < outerGrid; i++) content.push(gameGrid(i));
    return content;
  };

  const gameGrid = (i) => {
    // This function receives the grid index
    // Each cell has a click event, where the cell index is sent
    // to a separate function to handle click events
    let element = (
      <div key={i} className="box">
        <div className="cell" onClick={(event) => clickHandle(event, i, 0)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 1)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 2)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 3)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 4)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 5)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 6)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 7)}></div>
        <div className="cell" onClick={(event) => clickHandle(event, i, 8)}></div>
      </div>
    );

    return element;
  };

  // =======================================================
  //               Reset Component Data
  // =======================================================
  const reset = () => {
    console.log("Reseting game...");
    setOpen(false);
    setGameEnded(false);

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
      grid.className = "box";

      // remove class to disable the click event on the cells
      for (let cell of grid.children) cell.className = "cell";
    }

    //  Get random grid to begin the game
    setNextPlay(Math.floor(Math.random() * 9), "Reset");
  };

  const handleQuitRequest = () => {
    setPlayerTurnState(null);
    setPlayer1Info(null);
    setPlayer2Info(null);
    setTurnInfo(null);
    setOpen(false);
    setGameEnded(false);
    setModalState(null);
    setNextTable(null);
    handleCloseGrid();
  };

  // =======================================================
  //               Build Information Panel
  // =======================================================
  const buildPlayersInfo = () => {
    return (
      <div className="playersInfo">
        <div className="container">
          <p className="title">Tables Completed</p>
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

  const clearDisabled = () => {
    // Remove disable from every grid
    for (let grid of grids.current.children) {
      grid.classList.remove("disabled-grid");

      const wonTable = grid.classList.contains("winO") || grid.classList.contains("winX");
      // Remove disable from every cell
      for (let cell of grid.children) if (!wonTable) cell.classList.remove("disabled-cell");
    }
  };

  const disableTables = (cellIndex) => {
    // Get last play cell and grid indexs
    for (let grid of grids.current.children) {
      // Get this grid index
      const gridIndex = Array.from(grids.current.children).indexOf(grid);

      // Check if the table has been won already
      const winX = grid.classList.contains("winX");
      const winO = grid.classList.contains("winO");

      // Disable the other grids
      if (gridIndex !== cellIndex && !winX && !winO) {
        grid.classList.add("disabled-grid");

        // Remove disable from every cell
        for (let cell of grid.children) cell.classList.add("disabled-cell");
      }
    }
  };

  // =======================================================
  //            [Computer] Decide Next Play
  // =======================================================
  const nextPlay = () => {
    // Get the grid with the same index as the cell
    let grid = grids.current.children[nextTable];

    // On the enabled grid
    // Play randomly or block a player row
    let cells = [];
    let cellIndex = 0;
    let playedCell = null;

    /* ================================
                  LINES 
       ================================
    */
    for (let line = 0; line < 3; line++) {
      cells = [];
      for (let column = 0; column < 3; column++) {
        cells.push({
          index: cellIndex,
          oponentSymbol: grid.children[cellIndex].classList.contains(player1Info.symbol),
          computerSymbol: grid.children[cellIndex].classList.contains(player2Info.symbol),
        });
        cellIndex++;
      }

      // Every line check the cells
      // If condition is true, return the current played cell and the grid
      playedCell = checkCells(grid, cells);
      if (playedCell != null) return [grid, playedCell];
    }

    /* ================================
                  COLUMNS 
       ================================    
      Cells Layout
        0  1  2
        3  4  5
        6  7  8     */
    for (let column = 0; column < 3; column++) {
      cells = [];
      switch (column) {
        case 0: // Column 0
          cells.push(
            {
              index: 0,
              oponentSymbol: grid.children[0].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[0].classList.contains(player2Info.symbol),
            },
            {
              index: 3,
              oponentSymbol: grid.children[3].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[3].classList.contains(player2Info.symbol),
            },
            {
              index: 6,
              oponentSymbol: grid.children[6].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[6].classList.contains(player2Info.symbol),
            }
          );

          // Check cells from column 0
          // If condition is true, return the current played cell and the grid
          playedCell = checkCells(grid, cells);
          if (playedCell != null) return [grid, playedCell];
          break;
        case 1: // Column 1
          cells.push(
            {
              index: 1,
              oponentSymbol: grid.children[1].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[1].classList.contains(player2Info.symbol),
            },
            {
              index: 4,
              oponentSymbol: grid.children[4].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[4].classList.contains(player2Info.symbol),
            },
            {
              index: 7,
              oponentSymbol: grid.children[7].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[7].classList.contains(player2Info.symbol),
            }
          );

          // Check cells from column 1
          // If condition is true, return the current played cell and the grid
          playedCell = checkCells(grid, cells);
          if (playedCell != null) return [grid, playedCell];
          break;
        case 2: // Column 2
          cells.push(
            {
              index: 2,
              oponentSymbol: grid.children[2].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[2].classList.contains(player2Info.symbol),
            },
            {
              index: 5,
              oponentSymbol: grid.children[5].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[5].classList.contains(player2Info.symbol),
            },
            {
              index: 8,
              oponentSymbol: grid.children[8].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[8].classList.contains(player2Info.symbol),
            }
          );

          // Check cells from column 2
          // If condition is true, return the current played cell and the grid
          playedCell = checkCells(grid, cells);
          if (playedCell != null) return [grid, playedCell];
          break;
      }
    }

    /* ================================
                  DIAGONALS 
       ================================    
      Cells Layout
        0  1  2
        3  4  5
        6  7  8     */
    for (let diagonal = 0; diagonal < 3; diagonal++) {
      cells = [];
      switch (diagonal) {
        case 0: // Diagonal 0
          cells.push(
            {
              index: 0,
              oponentSymbol: grid.children[0].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[0].classList.contains(player2Info.symbol),
            },
            {
              index: 4,
              oponentSymbol: grid.children[4].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[4].classList.contains(player2Info.symbol),
            },
            {
              index: 8,
              oponentSymbol: grid.children[8].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[8].classList.contains(player2Info.symbol),
            }
          );

          // Check cells from diagonal top-left to bottom-right
          // If condition is true, return the current played cell and the grid
          playedCell = checkCells(grid, cells);
          if (playedCell != null) return [grid, playedCell];
          break;
        case 1: // Diagonal 1
          cells.push(
            {
              index: 2,
              oponentSymbol: grid.children[2].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[2].classList.contains(player2Info.symbol),
            },
            {
              index: 4,
              oponentSymbol: grid.children[4].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[4].classList.contains(player2Info.symbol),
            },
            {
              index: 6,
              oponentSymbol: grid.children[6].classList.contains(player1Info.symbol),
              computerSymbol: grid.children[6].classList.contains(player2Info.symbol),
            }
          );

          // Check cells from diagonal top-right to bottom-left
          // If condition is true, return the current played cell and the grid
          playedCell = checkCells(grid, cells);
          if (playedCell != null) return [grid, playedCell];
          break;
      }
    }

    // If none of the lines/columns have been played by computer he plays randomly
    return [grid, randomPlay(grid)];
  };

  const checkCells = (grid, cells) => {
    // If 3 equal symbols (to the players receveide by param) exist in this row, the player wins
    const oponentSymbols = cells.filter((x) => x.oponentSymbol === true).length === 2;
    const computerSymbols = cells.filter((x) => x.computerSymbol === true).length === 2;
    const log = oponentSymbols ? "Blocked" : "Completed";

    // Case: Oponent is about to complete a row
    // Check if there are two symbols on the row, and only one free space
    if (oponentSymbols || computerSymbols) {
      // Get the cell empty cell
      const emptyCell = cells.filter((x) => x.oponentSymbol === false && x.computerSymbol === false);

      // emptyCell = undefined: means that row cells are all filled
      // this if validation only needs one condition to be true, because its an or
      // (oponent symbol = 2 or computer symbol = 2)
      if (emptyCell.length == 0) return null;

      // Set the computer play in the empty cell
      grid.children[emptyCell[0].index].classList.add(player2Info.symbol);

      const currentPlay = {
        gridIndex: Array.from(grids.current.children).indexOf(grid),
        cellIndex: emptyCell[0].index,
      };

      console.log(`[${log} Row] Computer made a move on cell\n`, currentPlay, "\n", grid.children[emptyCell[0].index]);

      return emptyCell[0].index;
    }

    return null;
  };

  const randomPlay = (grid) => {
    while (true) {
      const randomCell = Math.floor(Math.random() * 9);
      if (
        !grid.children[randomCell].classList.contains(player1Info.symbol) &&
        !grid.children[randomCell].classList.contains(player2Info.symbol)
      ) {
        grid.children[randomCell].classList.add(player2Info.symbol);

        const currentPlay = {
          gridIndex: Array.from(grids.current.children).indexOf(grid),
          cellIndex: randomCell,
        };

        console.log("[Random Play] Computer made a move on cell\n", currentPlay, "\n", grid.children[randomCell]);

        return randomCell;
      }
    }
  };

  // =======================================================
  //             Function Executed on Reload
  // =======================================================
  // After every render of the component useEffect updates who makes the first play
  // The firstPlay parameter comes from App.js
  useEffect(() => {
    // Return if the grid is not showing, prevents data loss when the component is loaded
    // Also checks if the game has ended
    if (!showGrid || gameEnded) return;

    let symbolTmp, firstPlay, playerTurn, player1TmpStruct, player2TmpStruct;

    // Set the first player name and symbol
    if (player1Info == null && player2Info == null) {
      // Get the random symbol between 'O' and 'X'
      Math.random() < 0.5 ? (symbolTmp = "X") : (symbolTmp = "O");
      Math.random() < 0.5 ? (firstPlay = player1) : (firstPlay = player2);

      // Compare symbol of the first player and build second player structure
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
            <img src={playerTurn.symbolPath} className={playerTurn.symbol + "-mini"} alt={playerTurn.symbol}></img>
          </div>
        </>
      );

      setPlayerTurnState(playerTurn);
      return;
    }

    // Every reload of the component, execute the computer play
    if (gameMode === "pvc" && playerTurnState.name === "computer") {
      // 1) Where was the last play of the oponent?
      // 2) Check if he is close to finish a row/column/diagonal
      // 3) If the oponent is not close to finish a row/column/diagonal, computer play on his favor

      // Computer is the first to play
      if (nextTable == null) {
        console.log("[TURN] Computer is playing first");

        // Get what grid will the play be
        let randomGrid = grids.current.children[Math.floor(Math.random() * 9)];
        let randomCell = randomGrid.children[Math.floor(Math.random() * 9)];

        // Set the css class with the image to the clicked cell
        randomCell.className = `cell ${player2Info.symbol}`;

        const currentPlay = {
          gridIndex: Array.from(grids.current.children).indexOf(randomGrid),
          cellIndex: Array.from(randomGrid.children).indexOf(randomCell),
        };

        console.log("Computer made a move on cell \n", currentPlay, "\n", randomCell);

        // Set the next table to be played
        setNextPlay(Array.from(randomGrid.children).indexOf(randomCell), "Computer Play");

        // Update player turn
        setPlayerTurnState(setPlayerTurn());
      } else {
        // Add a timeout to slow the computer reaction
        setTimeout(function () {
          // Generate computer's next play
          const [playedGrid, playedCell] = nextPlay();

          // After the computer make his play, check if he has completed a row
          // Check if the computer won the game
          if (checkWin(playedGrid, player2Info)) {
            // Update Player 2 points
            setPlayer2Info({
              name: player2Info.name,
              symbol: player2Info.symbol,
              symbolPath: player2Info.symbolPath,
              points: ++player2Info.points,
              roundsWon: player2Info.roundsWon,
            });

            console.log(`'${player2Info.name}' won table ${playedCell}\n`, playedGrid);
          }

          // Verify if all the grids are disabled
          if (checkGameEnded()) {
            console.log("[Game Ended]");
            updateInfo();
          } else {
            // Set the next table to be played
            setNextPlay(playedCell, "Computer Play");
          }

          // Update the next player to play
          setPlayerTurnState(setPlayerTurn());
        }, 1200);
      }
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
          <Modal open={open} title={"Game Ended"} info={modalInfo} onHide={reset} />
        </main>
      )}
    </>
  );
};

export default GamePanel;
