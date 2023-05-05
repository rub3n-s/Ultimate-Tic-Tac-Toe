import { useState, useRef, useEffect } from "react";
import "./GamePanel.css";
import Modal from "./Modal.js";
import PlayersInfo from "./PlayersInfo";

const GamePanel = ({ showGame, gameMode, handleCloseGrid, player1Name, player2Name, levelTimeOut }) => {
  // Player states
  const [player1Info, setPlayer1Info] = useState(null);
  const [player2Info, setPlayer2Info] = useState(null);
  const [playerTurnState, setPlayerTurnState] = useState(null);
  const [turnInfo, setTurnInfo] = useState(null);

  // Tables states
  const mainTable = useRef(null);
  const [mainTableNavigation, setMainTableNavigation] = useState(true);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);

  // Next play states
  const [gameEnded, setGameEnded] = useState(false);
  const [nextTable, setNextTable] = useState(null);

  // Timer states
  let timer;
  const [timerId, setTimerId] = useState(null);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  /*  =======================================================
                        Build Tables
      =======================================================
      -> Build tables when game starts
  */
  const buildTables = () => {
    let content = [];
    let outerGrid = 3 * 3; // 3x3 grid
    for (let i = 0; i < outerGrid; i++) content.push(createTable(i));
    return content;
  };

  const createTable = (i) => {
    // This function receives the table index
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

  /*  =======================================================
                Set Players Info useEffect Hook
      =======================================================
      -> Create an action on the update of 'showGame'
      -> Used to decide which player goes first and whats his symbol
  */
  useEffect(() => {
    if (!showGame) return;

    console.log("Displaying table");

    // Set the first player name and symbol
    let playerTurn, player1Struct, player2Struct;

    // Build first player structure
    player1Struct = {
      name: player1Name,
      symbol: Math.random() < 0.5 ? "X" : "O", // Get the random symbol ('X' or 'O')
      symbolPath: null,
      points: 0,
      roundsWon: 0,
    };

    // Build second player structure
    player2Struct = {
      name: player2Name,
      symbol: player1Struct.symbol === "X" ? "O" : "X", // Get the symbol comparing to first player
      symbolPath: null,
      points: 0,
      roundsWon: 0,
    };

    // Define the symbol paths
    player1Struct.symbolPath = player1Struct.symbol === "X" ? "x.png" : "o.png";
    player2Struct.symbolPath = player2Struct.symbol === "X" ? "x.png" : "o.png";

    // Set the structures in different states
    setPlayer1Info(player1Struct);
    setPlayer2Info(player2Struct);

    // Get a random player for the first play
    const firstPlay = Math.random() < 0.5 ? player1Name : player2Name;

    // Check who plays first and whats symbol is assigned to him
    switch (firstPlay) {
      case player1Name:
        playerTurn = player1Struct;
        break;
      case player2Name:
        playerTurn = player2Struct;

        // Disable main table navigation when computer plays first
        if (gameMode === "pvc") setMainTableNavigation(false);
        break;
      default:
        console.log("Error setting first player");
        return;
    }

    // When game mode is PvP, first play enables navigation throught all the cells in the table
    if (gameMode === "pvp" || (gameMode === "pvc" && firstPlay === player1Name)) tableMap(null);

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

    // Set the player who gets the first turn to play
    setPlayerTurnState(playerTurn);

    // Set the timer
    setTimer();

    return () => {
      // cleaning up the listeners here
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGame]);

  /*  =======================================================
                    Computer Play useEffect Hook
      =======================================================
      -> Create an action on the update of 'playerTurnState'
      -> Used to verify if is the computer turn to play
  */
  useEffect(() => {
    // Check if is the computer turn to play
    if (!isComputerTurn()) return;

    // If the nextTable hasn't been set, computer is the first to play
    if (nextTable == null) {
      // Add a timeout to slow the computer reaction
      setTimeout(function () {
        // Get a random table for the next play
        let randomTable = mainTable.current.children[Math.floor(Math.random() * 9)];
        let randomCell = randomTable.children[Math.floor(Math.random() * 9)];

        // Set the css class with the image to the clicked cell
        randomCell.className = `cell ${player2Info.symbol}`;

        const currentPlay = {
          tableIndex: Array.from(mainTable.current.children).indexOf(randomTable),
          cellIndex: Array.from(randomTable.children).indexOf(randomCell),
        };

        console.log("Computer made a move on cell \n", currentPlay, "\n", randomCell);

        // Set the next table to be played
        setNextPlay(Array.from(randomTable.children).indexOf(randomCell), "Computer Play");

        // Update player turn
        setPlayerTurnState(setPlayerTurn());
      }, 1200);
    } else {
      // Add a timeout to slow the computer reaction
      setTimeout(function () {
        // Generate computer's next play
        const [playedTable, playedCell] = nextPlay();

        // Set the computer play in the empty cell
        playedTable.children[playedCell].classList.add(player2Info.symbol);

        // After the computer make his play, check if he won the table he played
        if (checkWin(playedTable, player2Info)) {
          // Update Player 2 points
          setPlayer2Info({
            name: player2Info.name,
            symbol: player2Info.symbol,
            symbolPath: player2Info.symbolPath,
            points: ++player2Info.points,
            roundsWon: player2Info.roundsWon,
          });

          // Computer wins this table
          playedTable.classList.add(`win${player2Info.symbol}`);
          playedTable.classList.remove("disabled-grid");

          // add a class to disable the click event on the cells
          for (let child of playedTable.children) child.classList.add("disabled-cell");

          console.log(`'${player2Info.name}' won table ${playedCell}\n`, playedTable);
        }

        // Verify if all the grids are disabled
        if (checkGameEnded()) {
          console.log("[Game Ended] Displaying modal window");
          setTimerRunning(false);
        } else {
          // Set the next table to be played
          setNextPlay(playedCell, "Computer Play");
        }

        // Update the next player to play
        setPlayerTurnState(setPlayerTurn());
      }, 1200);
    }

    return () => {
      // cleaning up the listeners here
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerTurnState]);

  /* =======================================================
                Play Handles (Click and Keyboard)
     =======================================================
     -> Events called on mouse click or keyboard enter
  */
  const clickHandle = (event, tableIndex, cellIndex) => {
    // Verifies if it's the computer turn to play
    if (isComputerTurn()) {
      console.log("It's the computer turn to play");
      return;
    }

    // Verifies if the element (cell) already has been clicked
    if (containsClass(event.target)) {
      console.log("Click event disabled on this cell");
      return;
    }

    // Set the css class with the image to the clicked cell
    event.target.className = `cell ${playerTurnState.symbol}`;

    // Evaluate the play
    evaluatePlay("[Click Handle]", tableIndex, cellIndex);

    // Disable full table navigation after the first play
    if (mainTableNavigation) setMainTableNavigation(false);
  };

  // This function receives the html element normally
  const keyboardHandle = (cell, tableIndex, cellIndex) => {
    // Verifies if it's the computer turn to play
    if (isComputerTurn()) {
      console.log("It's the computer turn to play");
      return;
    }

    // Verifies if the element (cell) already has been clicked
    if (containsClass(cell)) {
      console.log("Keyboard event disabled on this cell");
      return;
    }

    // Set the css class with the image to the clicked cell
    cell.className = `cell ${playerTurnState.symbol}`;

    // Evaluate the play
    evaluatePlay("[Keyboard Handle]", tableIndex, cellIndex);

    // Disable full table navigation after the first play
    if (mainTableNavigation) setMainTableNavigation(false);
  };

  /* =======================================================
              Play Validations (Click and Keyboard)
     =======================================================
     -> Check if the cell is available
     -> Check if is the computer turn to play
     -> Evaluate the play to check if the player won the table
  */
  const containsClass = (element) => {
    return (
      element.classList.contains("X") || element.classList.contains("O") || element.classList.contains("disabled-cell")
    );
  };

  const isComputerTurn = () => {
    return gameMode === "pvc" && playerTurnState.name === "computer";
  };

  const evaluatePlay = (handle, tableIndex, cellIndex) => {
    // Get the played table
    const playedTable = mainTable.current.children[tableIndex];

    // Store the current play
    const currentPlay = {
      tableIndex: tableIndex,
      cellIndex: cellIndex,
    };

    console.log(handle, "\n", playerTurnState, "\n", currentPlay, "\n", playedTable.children[cellIndex]);

    // After every click/keyboard event check if someone wins
    if (checkWin(playedTable, playerTurnState)) {
      // Check who's current turn to play was and add points to him
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
        default:
          console.log("Error getting player turn state");
      }

      // Player wins this table
      playedTable.classList.add(`win${playerTurnState.symbol}`);
      playedTable.classList.remove("disabled-grid");

      // add a class to disable the click event on the cells
      for (let child of playedTable.children) child.classList.add("disabled-cell");

      console.log(`Player '${playerTurnState.name}' won table ${tableIndex}`, playedTable);
    }

    // Verify if all the tables are disabled
    if (checkGameEnded()) {
      console.log("[Game Ended] Displaying modal window");
      setTimerRunning(false);
      return;
    }

    // Set the next table to be played
    setNextPlay(cellIndex, "Click Event");

    // Update the next player to play
    setPlayerTurnState(setPlayerTurn());
  };

  /*  =======================================================
                  Verify Plays / Game End
      =======================================================
      -> After every play check if the current play has completed
        a row and set the win
      -> Map the current played table
        -> Get the lines, column and cells from the 3x3 array
  */
  const mapTable = (table) => {
    let mappedTable = [];
    let cellIndex = 0;
    for (let line = 0; line < 3; line++) {
      // Push an empty array for columns in line x
      mappedTable.push([]);
      for (let column = 0; column < 3; column++) {
        mappedTable[line].push(table.children[cellIndex]);
        cellIndex++;
      }
    }
    return mappedTable;
  };

  const checkWin = (table, player) => {
    // Map table for easier data access
    const mappedTable = mapTable(table);
    console.log("[Check Win] Mapped Table", mappedTable);

    /* ================================
                      LINES 
      ================================
    */
    for (let i = 0; i < mappedTable.length; i++) {
      // Get the an array of cells on line i
      const line = mappedTable[i];

      // Check if the player won line i
      const win = line.filter((x) => x.classList.contains(player.symbol)).length === 3;
      if (win) return true;
    }

    /* ================================
                      COLUMNS 
      ================================
    */
    for (let i = 0; i < mappedTable.length; i++) {
      let column = [];
      for (let j = 0; j < mappedTable.length; j++)
        // Get the an array of cells on column i and line j
        column.push(mappedTable[j][i]);

      // Check if the player won line i
      const win = column.filter((x) => x.classList.contains(player.symbol)).length === 3;
      if (win) return true;
    }

    /* ================================
                      DIAGONALS 
      ================================
    */
    // Up left to Down right / Up right to Down left
    const diagonals = [
      [mappedTable[0][0], mappedTable[1][1], mappedTable[2][2]],
      [mappedTable[0][2], mappedTable[1][1], mappedTable[2][0]],
    ];

    for (let i = 0; i < diagonals.length; i++) {
      const diagonal = diagonals[i];

      const win = diagonal.filter((x) => x.classList.contains(player.symbol)).length === 3;
      if (win) return true;
    }

    return false;
  };

  // Check if all the tables have a winner
  const checkGameEnded = () => {
    // Get all tables with a winner
    const allTablesWon =
      Array.from(mainTable.current.children).filter((x) => x.classList.contains("winX") || x.classList.contains("winO"))
        .length === 9;

    // All tables have a winner
    if (allTablesWon) return true;

    // Check if all the cells are filled
    for (let table of mainTable.current.children) {
      if (!table.classList.contains("winX") && !table.classList.contains("winO")) {
        const tableIsFull =
          Array.from(table.children).filter(
            (x) => x.classList.contains(player1Info.symbol) || x.classList.contains(player2Info.symbol)
          ).length < 9;
        if (tableIsFull) return false;
      }
    }

    return true;
  };

  /* =======================================================
                    Update Players Info
     =======================================================
     -> Updates the Info Panel and Modal content
     -> Displayed after the game ends
  */
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
      buildModalInfo(message);
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
      buildModalInfo(message);
      console.log(message);
    } else {
      // Update info to show on modal window
      const message = `There was a tie!`;
      buildModalInfo(message);
      console.log(message);
    }

    // Open Modal Window
    setOpenModal(true);

    // Set the end of the game
    setGameEnded(true);
    return;
  };

  const buildModalInfo = (message) => {
    setModalInfo(
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
     -> Get the current played cell, if AVAILABLE, returns the table with that index
  */
  const setNextPlay = (cellIndex, event) => {
    // Check if the next table is available
    if (!isTableAvailable(mainTable.current.children[cellIndex])) {
      console.log(
        `[Invalid Table] Table ${cellIndex} is won already, computer is picking other table\n`,
        mainTable.current.children[cellIndex]
      );
      // Get a random table that is available to play
      cellIndex = getRandomTable(event);
    }

    // Set the table map for arrow keys navigation
    // If game mode is player vs computer, the mapping only needs to be made when is the player turn
    if (gameMode === "pvp" || (gameMode === "pvc" && playerTurnState.name !== player1Info.name))
      tableMap(mainTable.current.children[cellIndex]);

    // Clear disabled tables/cells and update them according to the last play
    clearDisabled();
    disableTables(cellIndex);

    // Set the next table index based on the previous cell index
    setNextTable(cellIndex);
  };

  // Function to evaluate if a table is disabled
  const isTableAvailable = (table) => {
    // Check if all the cells are filled
    const cellsFilled = Array.from(table.children).filter(
      (x) => x.classList.contains(player1Info.symbol) || x.classList.contains(player2Info.symbol)
    );
    let tableIsFull = false;
    if (cellsFilled.length === 9) tableIsFull = true;

    // Check if the table is won already
    const tableIsWon = table.classList.contains("winX") || table.classList.contains("winO");

    // For a table to be available, gridIsWon==false && tableIsFull==false
    return !tableIsFull && !tableIsWon;
  };

  const getRandomTable = (message) => {
    // Get an array of available tables
    const availableTables = Array.from(mainTable.current.children).filter((x) => isTableAvailable(x));
    console.log("Available Tables\n", availableTables);

    // Get a random element from the array
    if (availableTables.length > 0) {
      const randomTable = availableTables[Math.floor(Math.random() * availableTables.length)];
      const randomTableIndex = Array.from(mainTable.current.children).indexOf(randomTable);
      console.log(`[${message}] New table randomly generated`, randomTable);
      return randomTableIndex;
    }

    console.log("[getRandomTable] Error getting new random table");
    return null;
  };

  /* =======================================================
                    Set Next Player Turn
     =======================================================
     -> After every cell click the next player to play is set
  */
  const setPlayerTurn = () => {
    switch (playerTurnState.name) {
      case player1Name:
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
      case player2Name:
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
      default:
        console.log("Error setting player turn info");
    }
  };

  /*  =======================================================
                  Reset Component States
      =======================================================
      -> Reset states to restart the game
      -> Clear disabled cells and tables
      -> Quit handle resets all the states
  */
  const reset = () => {
    console.log("Reseting game...");
    setOpenModal(false);
    setGameEnded(false);

    // Reset the timer
    setTimer();

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

    // Clear table and cells classes
    for (let table of mainTable.current.children) {
      table.className = "box";

      // remove class to disable the click event on the cells
      for (let cell of table.children) cell.className = "cell";
    }

    //  Get random table to begin the game
    //  If it's the computer starting the game
    if (gameMode === "pvp") setNextPlay(Math.floor(Math.random() * 9), "Reset");

    // Enable main table navigation for the first play
    setMainTableNavigation(true);
  };

  const handleQuitRequest = () => {
    setPlayer1Info(null);
    setPlayer2Info(null);
    setPlayerTurnState(null);
    setTurnInfo(null);
    setOpenModal(false);
    setGameEnded(false);
    setModalInfo(null);
    setNextTable(null);
    setTimeLeft(0);
    setTimerId(null);
    handleCloseGrid();
  };

  /*  =======================================================
                  Clear/Disable Tables
      =======================================================
      - Removes class from all tables that dont have a win
      - If a table already has a winner, the cells keep disabled
  */
  const clearDisabled = () => {
    // Remove disable from every table
    for (let table of mainTable.current.children) {
      table.classList.remove("disabled-grid");

      const wonTable = table.classList.contains("winO") || table.classList.contains("winX");
      // Remove disable from every cell
      for (let cell of table.children) if (!wonTable) cell.classList.remove("disabled-cell");
    }
  };

  const disableTables = (cellIndex) => {
    // Get last play cell and table indexs
    for (let table of mainTable.current.children) {
      // Get this table index
      const tableIndex = Array.from(mainTable.current.children).indexOf(table);

      // Check if the table has been won already
      const winX = table.classList.contains("winX");
      const winO = table.classList.contains("winO");

      // Disable the other grids
      if (tableIndex !== cellIndex && !winX && !winO) {
        table.classList.add("disabled-grid");

        // Remove disable from every cell
        for (let cell of table.children) cell.classList.add("disabled-cell");
      }
    }
  };

  /*  =======================================================
                  [Computer] Decide Next Play
      =======================================================
      -> Decide where is going to be the computers next play
      -> Check the cells to complete a row if he has two symbols
      -> Random play if he doesnt have two symbols in same row
  */
  const nextPlay = () => {
    // Get the table with the same index as the cell
    let table = mainTable.current.children[nextTable];
    let mappedTable = mapTable(table);

    let availablePlays = [];

    /* ================================
                      LINES 
       ================================
    */
    for (let i = 0; i < mappedTable.length; i++) {
      // Get the an array of cells on line i
      const line = mappedTable[i];

      // Every line check the cells
      // If condition is true, return the current played cell and the table
      const availableCell = checkCells(table, line);
      if (availableCell != null) availablePlays.push(availableCell);
    }

    /* ================================
                        COLUMNS 
       ================================
    */
    for (let i = 0; i < mappedTable.length; i++) {
      let column = [];
      for (let j = 0; j < mappedTable.length; j++)
        // Get the an array of cells on column i and line j
        column.push(mappedTable[j][i]);

      // Every diagonal check the cells
      // If condition is true, return the current played cell and the table
      const availableCell = checkCells(table, column);
      if (availableCell != null) availablePlays.push(availableCell);
    }

    /* ================================
                        DIAGONALS 
       ================================
    */
    // Up left to Down right / Up right to Down left
    const diagonals = [
      [mappedTable[0][0], mappedTable[1][1], mappedTable[2][2]],
      [mappedTable[0][2], mappedTable[1][1], mappedTable[2][0]],
    ];

    for (let i = 0; i < diagonals.length; i++) {
      const diagonal = diagonals[i];

      // Every diagonal check the cells
      // If condition is true, return the current played cell and the table
      const availableCell = checkCells(table, diagonal);
      if (availableCell != null) availablePlays.push(availableCell);
    }

    if (availablePlays.length > 0) {
      // Get winning cells
      const winningCells = availablePlays.filter((x) => x.win === true);

      // Check if a winning cell exists
      if (winningCells.length > 0) {
        const randomWinningCell = Math.floor(Math.random() * winningCells.length);
        return [table, winningCells[randomWinningCell].index];
      }

      // If a winning cell doesnt exist and availablePlays > 0, get a blocking cell
      const randomBlockingCell = Math.floor(Math.random() * availablePlays.length);
      return [table, availablePlays[randomBlockingCell].index];
    }

    // If none of the lines/columns have been played by computer he plays randomly
    return [table, randomPlay(table)];
  };

  const checkCells = (table, cells) => {
    // Check if any of the players have 2 symbols to either block the line or complete the line to win
    const oponentSymbols = cells.filter((x) => x.classList.contains(player1Info.symbol) === true).length === 2;
    const computerSymbols = cells.filter((x) => x.classList.contains(player2Info.symbol) === true).length === 2;
    const log = oponentSymbols ? "Blocked" : "Completed";

    // If none of the players have at two symbols in this row
    if (!oponentSymbols && !computerSymbols) return null;

    // Case: Oponent/Computer is about to complete a row
    // Check if there are two symbols on the row, and only one free space
    // Get the cell empty cell
    const emptyCell = cells.filter(
      (x) => x.classList.contains(player1Info.symbol) === false && x.classList.contains(player2Info.symbol) === false
    );
    const cellIndex = Array.from(table.children).indexOf(emptyCell[0]);

    // emptyCell = undefined: means that row cells are all filled
    // this if validation only needs one condition to be true, because its an or
    // (oponent symbol = 2 or computer symbol = 2)
    if (emptyCell.length === 0) return null;

    const currentPlay = {
      tableIndex: Array.from(mainTable.current.children).indexOf(table),
      cellIndex: cellIndex,
    };

    console.log(`[${log} Row] Computer made a move on cell\n`, currentPlay, "\n", table.children[cellIndex]);

    return computerSymbols ? { index: cellIndex, win: true } : { index: cellIndex, win: false };
  };

  const randomPlay = (table) => {
    while (true) {
      const randomCell = Math.floor(Math.random() * 9);

      // Check if the cells doesn't contain any player's symbol
      const cellIsFree =
        !table.children[randomCell].classList.contains(player1Info.symbol) &&
        !table.children[randomCell].classList.contains(player2Info.symbol);

      if (cellIsFree) {
        const currentPlay = {
          tableIndex: Array.from(mainTable.current.children).indexOf(table),
          cellIndex: randomCell,
        };

        console.log("[Random Play] Computer made a move on cell\n", currentPlay, "\n", table.children[randomCell]);

        return randomCell;
      }
    }
  };

  /*  =======================================================
                            Game Timer
      =======================================================
      -> Decrement timer 
      -> Set timer and update timerRunning state to true
  */
  const updateGameTime = () => {
    setTimeLeft(--timer + "s");
    if (timer === 0 || gameEnded) setTimerRunning(false);
  };

  const setTimer = () => {
    // Set the initial interval
    // setInterval() - calls udpdateGameTime() every 1000 ms (1 sec)
    let timerId;
    [timer, timerId] = [levelTimeOut, setInterval(updateGameTime, 1000)];
    setTimeLeft(timer + "s");
    setTimerId(timerId);
    setTimerRunning(true);
  };

  /*  =======================================================
                      Timer useEffect Hook
      =======================================================
      -> Create an action on the update of 'timerRunning'
      -> If the timer reaches zero in updateGameTime() 'timerRunning' 
        state is updated
  */
  useEffect(() => {
    if (!timerRunning) {
      clearInterval(timerId);
      updateInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning]);

  /*  =======================================================
                  Arrow Keys Cells Navigation
      =======================================================
      -> Functions to handle mapping of the available table
      -> Handles for keyboard navigation, supports:
        -> arrow up, arrow down, arrow left, arrow right, enter
  */
  const [currentTableMap, setCurrentTableMap] = useState(null);
  const [position, setPosition] = useState(null);

  // Set a key down event and call checkKey()
  document.onkeydown = checkKey;

  // Receives the div with className 'box'
  // 'box' is the div that contains the rows and cells
  const tableMap = (table) => {
    // When table comes null it means its the first play for a normal player
    // So its needed to map only the first table
    if (table == null) table = mainTable.current.children[0];

    console.log("[Keyboard] Mapping table", table);

    let currentTableMapTmp = [];
    let cellCounter = 0;
    for (let row = 0; row < 3; row++) {
      currentTableMapTmp.push([]);
      for (let cell = 0; cell < 3; cell++) {
        currentTableMapTmp[currentTableMapTmp.length - 1].push(table.children[cellCounter]);
        cellCounter++;
      }
    }

    setCurrentTableMap(currentTableMapTmp);
    setPosition({
      tableIndex: Array.from(mainTable.current.children).indexOf(table),
      x: 0,
      y: 0,
    });
    console.log("Current Table Map", currentTableMapTmp);
  };

  function checkKey(e) {
    e = e || window.event;

    // Verifies if it's the computer turn to play
    if (gameMode === "pvc" && playerTurnState.name === "computer") {
      console.log("It's the computer turn to play");
      return;
    }
    // If the game table isn't open yet, return
    else if (!showGame || gameEnded) return;

    switch (e.keyCode) {
      case 37:
        // left
        moveLeft();
        break;
      case 38:
        // up
        moveUp();
        break;
      case 39:
        // right
        moveRight();
        break;
      case 40:
        // down
        moveDown();
        break;
      case 27:
      case 13:
        // escape
        selectCell();
        break;
      default:
    }
  }

  const moveLeft = () => {
    console.log("[MOVE LEFT]");

    if (position == null) {
      setPosition({ tableIndex: 0, x: 0, y: 0 });
      return;
    }

    let tmpX = position.x;
    let tmpY = position.y;
    let tmpTableIndex = position.tableIndex;

    if (tmpX > 0) tmpX--;
    else if (mainTableNavigation) {
      console.log("Remapping to the left table");

      // Map the table to the right
      if (tmpTableIndex > 0) tmpTableIndex--;
      else tmpTableIndex = 8;

      tmpX = 2;
      tmpY = position.y;

      // Remap the table
      tableMap(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  const moveUp = () => {
    console.log("[MOVE UP]");

    if (position == null) {
      setPosition({ tableIndex: 0, x: 0, y: 0 });
      return;
    }

    let tmpX = position.x;
    let tmpY = position.y;
    let tmpTableIndex = position.tableIndex;

    if (tmpY > 0) tmpY--;
    else if (mainTableNavigation) {
      console.log("Remapping to the table above");

      // Map the table to the right
      switch (tmpTableIndex) {
        case 3: // row 1
        case 4:
        case 5:
        case 6: // row 2
        case 7:
        case 8:
          tmpTableIndex -= 3;
          break;
        default:
          tmpTableIndex += 6;
      }

      tmpX = position.x;
      tmpY = 2;

      // Remap the table
      tableMap(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  const moveRight = () => {
    console.log("[MOVE RIGHT]");

    if (position == null) {
      setPosition({ tableIndex: 0, x: 0, y: 0 });
      return;
    }

    let tmpX = position.x;
    let tmpY = position.y;
    let tmpTableIndex = position.tableIndex;

    if (tmpX < currentTableMap[0].length - 1) tmpX++;
    else if (mainTableNavigation) {
      console.log("Remapping to the right table");

      // Map the table to the right
      if (tmpTableIndex < 8) tmpTableIndex++;
      else tmpTableIndex = 0;

      tmpX = 0;
      tmpY = position.y;

      // Remap the table
      tableMap(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  const moveDown = () => {
    console.log("[MOVE DOWN]");

    if (position == null) {
      setPosition({ tableIndex: 0, x: 0, y: 0 });
      return;
    }

    let tmpX = position.x;
    let tmpY = position.y;
    let tmpTableIndex = position.tableIndex;

    if (tmpY < currentTableMap.length - 1) tmpY++;
    else if (mainTableNavigation) {
      console.log("Remapping to the table below");

      // Map the table to the right
      switch (tmpTableIndex) {
        // row 2
        case 6:
        case 7:
        case 8:
          tmpTableIndex -= 6;
          break;
        // 0, 1, 2, 3, 4, 5, 6
        default:
          tmpTableIndex += 3;
      }

      tmpX = position.x;
      tmpY = 0;

      // Remap the table
      tableMap(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  // Get the last position of the arrow keys event and select the cell
  const selectCell = () => {
    // Get the selected cell from the map
    const cell = currentTableMap[position.y][position.x];

    // Get the cell's parent (div)
    const table = cell.parentElement;

    // Get table's and cell's index
    const tableIndex = Array.from(mainTable.current.children).indexOf(table);
    const cellIndex = Array.from(table.children).indexOf(cell);

    // Get the the table index and cell index
    keyboardHandle(cell, tableIndex, cellIndex);
  };

  /*  =======================================================
              Keyboard Navigation useEffect Hook
      =======================================================
      -> Create an action each time 'position' is changed
      -> This hook gets called every time the user presses the arrow keys
  */
  useEffect(() => {
    if (currentTableMap == null) return;

    // New coords
    console.log(position);

    // Set the anitamon for the selected cell
    currentTableMap[position.y][position.x].classList.add("arrow-selected");

    // After 0.5 seconds remove the class (0.5 seconds is the time of the animation)
    setTimeout(() => {
      currentTableMap[position.y][position.x].classList.remove("arrow-selected");
    }, 500);

    // eslint-disable-next-line
  }, [position]);

  /*  =======================================================
              Full Grid Navigation useEffect Hook
      =======================================================
      -> Create an action each time 'mainTableNavigation' is changed
      -> Allows players to navigate freely throught every cell
  */
  useEffect(() => {
    if (mainTableNavigation === false || !showGame) return;

    // Clears all the disabled cells/tables
    clearDisabled();

    // eslint-disable-next-line
  }, [mainTableNavigation]);

  return (
    <>
      {showGame && (
        <main>
          <div className="filler"></div>
          <div className="grid-wrapper" ref={mainTable}>
            {buildTables()}
          </div>
          <PlayersInfo player1Info={player1Info} player2Info={player2Info} turnInfo={turnInfo} timeLeft={timeLeft} />
          <Modal openModal={openModal} title={"Game Ended"} info={modalInfo} onHide={handleQuitRequest} />
        </main>
      )}
    </>
  );
};

export default GamePanel;
