import React from "react";
import { useState, useRef, useEffect } from "react";
import "./game-panel.css";
import { Modal, PlayersInfo, PopupMessage } from "../index";
import { mapTable, checkWin, checkGameEnded, containsClass, randomFirstPlayer } from "../../helpers";
import { X_PATH, O_PATH } from "../../constants/index";

const GamePanel = ({ showGame, gameMode, handleCloseGrid, player1Name, player2Name, timeOut }) => {
  // Player states
  const [player1Info, setPlayer1Info] = useState(null);
  const [player2Info, setPlayer2Info] = useState(null);
  const [playerTurnState, setPlayerTurnState] = useState(null);

  // Tables states
  const mainTable = useRef(null);
  const [mainTableNavigation, setMainTableNavigation] = useState(true);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);

  // Next play states
  const [nextTable, setNextTable] = useState(null);

  // Timer states
  let timer;
  const [timerId, setTimerId] = useState(null);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // playersInfo time span useRef hook
  const playerTimer = useRef(null);

  // Popup message
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  /*  =======================================================
                        Build Tables
      =======================================================
      -> Build tables when game starts
  */
  const buildTables = () => {
    let content = [];
    let outerGrid = 3 * 3; // 3x3 grid
    for (let i = 0; i < outerGrid; i++)
      content.push(
        <div key={i} className="box">
          <div className="cell" onClick={() => playHandle("Click", i, 0)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 1)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 2)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 3)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 4)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 5)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 6)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 7)}></div>
          <div className="cell" onClick={() => playHandle("Click", i, 8)}></div>
        </div>
      );
    return content;
  };

  /*  =======================================================
                Set Players Info useEffect Hook
      =======================================================
      -> Create an action on the update of 'showGame'
      -> Used to decide which player goes first and whats his symbol
  */
  useEffect(() => {
    if (!showGame) return;

    // Initialize players structures
    const [player1Struct, player2Struct] = buildPlayersStruct();

    // Set the structures in different states
    setPlayer1Info(player1Struct);
    setPlayer2Info(player2Struct);

    // Set who plays first and keyboard navigation
    setFirstPlay(player1Struct, player2Struct);

    // eslint-disable-next-line
  }, [showGame]);

  const buildPlayersStruct = () => {
    // Build first player structure
    let player1Struct = {
      name: player1Name,
      symbol: Math.random() < 0.5 ? "X" : "O", // Get the random symbol ('X' or 'O')
      symbolPath: null,
      points: 0,
      roundsWon: 0,
      timeLeft: timeOut,
    };

    // Build second player structure
    let player2Struct = {
      name: player2Name,
      symbol: player1Struct.symbol === "X" ? "O" : "X", // Get the symbol comparing to first player
      symbolPath: null,
      points: 0,
      roundsWon: 0,
      timeLeft: timeOut,
    };

    // Define the symbol paths
    player1Struct.symbolPath = player1Struct.symbol === "X" ? X_PATH : O_PATH;
    player2Struct.symbolPath = player2Struct.symbol === "X" ? X_PATH : O_PATH;

    return [player1Struct, player2Struct];
  };

  const setFirstPlay = (player1, player2) => {
    // Get a random player for the first play
    const firstPlayer = randomFirstPlayer(player1, player2);

    // Disable main table navigation when computer plays first
    if (firstPlayer === player2 && gameMode === "pvc") setMainTableNavigation(false);
    // Enable main table navigation for the first play (if its not the computer playing first)
    else {
      setMainTableNavigation(true);

      // For the first play, map the first table in the array
      keyboardMapTable(mainTable.current.children[0]);
    }

    // Set the player who gets the first turn to play
    setPlayerTurnState(firstPlayer);
  };

  /*  =======================================================
                    Computer Play useEffect Hook
      =======================================================
      -> Create an action on the update of 'playerTurnState'
      -> Used to verify if is the computer turn to play
  */
  useEffect(() => {
    if (playerTurnState === null) return;

    // Stop the timer
    clearInterval(timerId);

    // Check if is the computer turn to play
    if (isComputerTurn()) {
      // Computer doesn't have a timer (clear warning/set infinite symbol)
      playerTimer.current.style.color = "black";
      setTimeLeft("∞");

      // Handle computer play
      computerPlayHandle();
    } else {
      // Each time the player turn state is changed, set the timer with the player's time left
      setTimer(playerTurnState.timeLeft);

      playerTurnState.timeLeft <= 10
        ? (playerTimer.current.style.color = "red")
        : (playerTimer.current.style.color = "black");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerTurnState]);

  /* =======================================================
                Plays Handle (Click and Keyboard)
     =======================================================
     -> Events called on mouse click or keyboard enter
  */
  const computerPlayHandle = () => {
    // Add a timeout to slow the computer reaction
    setTimeout(function () {
      // If the nextTable hasn't been set, computer is the first to play
      if (nextTable == null) {
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
      } else {
        // Generate computer's next play
        const [playedTable, playedCell] = nextPlay();

        // Set the computer play in the empty cell
        playedTable.children[playedCell].classList.add(player2Info.symbol);

        // After the computer make his play, check if he won the table he played
        if (checkWin(playedTable, player2Info)) {
          // Update computer points
          updatePlayersInfo({
            name: playerTurnState.name,
            symbol: playerTurnState.symbol,
            symbolPath: playerTurnState.symbolPath,
            points: ++playerTurnState.points,
            roundsWon: playerTurnState.roundsWon,
            timeLeft: playerTurnState.timeLeft,
          });

          // Computer wins this table
          playedTable.classList.add(`win${player2Info.symbol}`);
          playedTable.classList.remove("disabled-grid");

          // add a class to disable the click event on the cells
          for (let child of playedTable.children) child.classList.add("disabled-cell");

          console.log(`'${player2Info.name}' won table ${playedCell}\n`, playedTable);
        }

        // Verify if all the grids are disabled
        if (checkGameEnded(mainTable, player1Info, player2Info)) {
          console.log("[Game Ended] Displaying modal window");
          setTimerRunning(false);
          return;
        }

        // Set the next table to be played
        setNextPlay(playedCell, "Computer Play");
      }

      // Update player turn
      setPlayerTurnState(updateTurnInfo());
    }, 1200);
  };

  const playHandle = (typeHandle, tableIndex, cellIndex) => {
    // Verifies if it's the computer turn to play
    if (isComputerTurn()) {
      displayPopup("It's the computer turn to play");
      return;
    }

    // Get the played cell
    const cell = mainTable.current.children[tableIndex].children[cellIndex];

    // Verifies if the element (cell) already has been clicked
    if (containsClass(cell)) {
      displayPopup(`${typeHandle} event disabled on this cell`);
      return;
    }

    // Set the css class with the image to the clicked cell
    cell.className = `cell ${playerTurnState.symbol}`;

    // Evaluate the play
    evaluatePlay(`[${typeHandle} Handle]`, tableIndex, cellIndex);

    // Disable full table navigation after the first play
    if (mainTableNavigation) setMainTableNavigation(false);
  };

  /* =======================================================
              Play Validations (Click and Keyboard)
     =======================================================
     -> Check if is the computer turn to play
     -> Evaluate the play to check if the player won the table
  */
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
      // Increment player's points (completed tables)
      updatePlayersInfo({
        name: playerTurnState.name,
        symbol: playerTurnState.symbol,
        symbolPath: playerTurnState.symbolPath,
        points: ++playerTurnState.points,
        roundsWon: playerTurnState.roundsWon,
        timeLeft: playerTurnState.timeLeft,
      });

      // Player wins this table
      playedTable.classList.add(`win${playerTurnState.symbol}`);
      playedTable.classList.remove("disabled-grid");

      // add a class to disable the click event on the cells
      for (let child of playedTable.children) child.classList.add("disabled-cell");

      console.log(`Player '${playerTurnState.name}' won table ${tableIndex}`, playedTable);
    }

    // Verify if all the tables are disabled
    if (checkGameEnded(mainTable, player1Info, player2Info)) {
      console.log("[Game Ended] Displaying modal window");
      setTimerRunning(false);
      return;
    }

    // Set the next table to be played
    setNextPlay(cellIndex, "Click Event");

    // Update the next player to play
    setPlayerTurnState(updateTurnInfo());
  };

  const updatePlayersInfo = (player) => {
    // Check who's current turn to play was and add points to him
    switch (player.name) {
      case player1Info.name:
        // Update Player 1 points
        setPlayer1Info({
          name: player.name,
          symbol: player.symbol,
          symbolPath: player.symbolPath,
          points: player.points,
          roundsWon: player.roundsWon,
          timeLeft: player.timeLeft,
        });
        break;
      case player2Info.name:
        // Update Player 2 points
        setPlayer2Info({
          name: player.name,
          symbol: player.symbol,
          symbolPath: player.symbolPath,
          points: player.points,
          roundsWon: player.roundsWon,
          timeLeft: player.timeLeft,
        });
        break;
      default:
        console.log("Error getting player turn state");
    }
  };

  /* =======================================================
                    Update Players Info
     =======================================================
     -> Updates the Info Panel and Modal content
     -> Displayed after the game ends
  */
  const handleGameEnd = () => {
    let roundWinner = null;

    if (timeLeft === 0) {
      // Set the round winner
      roundWinner = playerTurnState.name === player1Info.name ? player2Info : player1Info;

      // Build the modal text information
      buildModalInfo(`${playerTurnState.name}'s timer reached zero, ${roundWinner.name} is the winner!`);
    } else {
      // Check if there was a tie
      if (player1Info.points === player2Info.points) {
        buildModalInfo(`There was a tie!`);
        return;
      }

      // If there wasn't a tie, get the winner
      roundWinner = player1Info.points > player2Info.points ? player1Info : player2Info;

      // Update info to show on modal window
      buildModalInfo(`Player '${roundWinner.name}' wins with ${roundWinner.points} completed tables!`);
    }

    console.log("[Round Winner] ", roundWinner);

    // Increase roundsWon
    updatePlayersInfo({
      name: roundWinner.name,
      symbol: roundWinner.symbol,
      symbolPath: roundWinner.symbolPath,
      points: roundWinner.points,
      roundsWon: ++roundWinner.roundsWon,
      timeLeft: roundWinner.timeLeft,
    });
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
      keyboardMapTable(mainTable.current.children[cellIndex]);

    // Clear disabled tables/cells and update them according to the last play
    clearDisabled();
    disableTables(cellIndex);

    // Set the next table index based on the previous cell index
    setNextTable(cellIndex);
  };

  // Function to evaluate if a table is disabled
  const isTableAvailable = (table) => {
    // Get all the filled cells
    const cellsFilled = Array.from(table.children).filter(
      (x) => x.classList.contains(player1Info.symbol) || x.classList.contains(player2Info.symbol)
    );

    // Check if all the cells are filled
    const tableIsFull = cellsFilled.length === 9;

    // Check if the table is won already
    const tableIsWon = table.classList.contains("winX") || table.classList.contains("winO");

    // Return table availability (tableWon===false && tableIsFull===false)
    return !tableIsFull && !tableIsWon;
  };

  const getRandomTable = (message) => {
    // Get an array of available tables
    const availableTables = Array.from(mainTable.current.children).filter((x) => isTableAvailable(x));
    console.log("[Available Tables]", availableTables);

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
  const updateTurnInfo = () => {
    switch (playerTurnState.name) {
      case player1Info.name:
        return player2Info;
      case player2Info.name:
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

    // Players keep the same symbols
    // Reset players points
    const players = [
      {
        name: player1Info.name,
        symbol: player1Info.symbol,
        symbolPath: player1Info.symbolPath,
        points: 0,
        roundsWon: player1Info.roundsWon,
        timeLeft: timeOut,
      },
      {
        name: player2Info.name,
        symbol: player2Info.symbol,
        symbolPath: player2Info.symbolPath,
        points: 0,
        roundsWon: player2Info.roundsWon,
        timeLeft: timeOut,
      },
    ];

    // Update players info
    updatePlayersInfo(players[0]);
    updatePlayersInfo(players[1]);

    // Set who plays first and keyboard navigation
    setFirstPlay(players[0], players[1]);

    // Clears all the disabled cells/table
    for (let table of mainTable.current.children) {
      table.className = "box";

      // remove class to disable the click event on the cells
      for (let cell of table.children) cell.className = "cell";
    }

    // Clear text timer warnings
    playerTimer.current.style.color = "black";
  };

  const handleQuitRequest = () => {
    setPlayer1Info(null);
    setPlayer2Info(null);
    setPlayerTurnState(null);
    setOpenModal(false);
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
    Array.from(mainTable.current.children).forEach((table) => {
      // Remove disabled from every table
      table.classList.remove("disabled-grid");

      // Remove disable from every cell
      const wonTable = table.classList.contains("winX") || table.classList.contains("winO");
      if (!wonTable) Array.from(table.children).map((x) => x.classList.remove("disabled-cell"));
    });
  };

  const disableTables = (cellIndex) => {
    // Get last play cell and table indexs
    Array.from(mainTable.current.children).forEach((table) => {
      // Get this table index
      const tableIndex = Array.from(mainTable.current.children).indexOf(table);

      // Check if the table has been won already
      const win = table.classList.contains("winX") || table.classList.contains("winO");

      // Disable the other grids, except the only one that's available played
      if (tableIndex !== cellIndex && !win) {
        table.classList.add("disabled-grid");

        // Remove disable from every cell
        Array.from(table.children).forEach((cell) => cell.classList.add("disabled-cell"));
      }
    });
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
  const updatePlayerTime = () => {
    // Decrement time left counter
    setTimeLeft(--timer);

    // Change color to warn the player
    if (timer <= 10) playerTimer.current.style.color = "red";

    // Timer reaches zero
    if (timer === 0) setTimerRunning(false);

    updatePlayersInfo({
      name: playerTurnState.name,
      symbol: playerTurnState.symbol,
      symbolPath: playerTurnState.symbolPath,
      points: playerTurnState.points,
      roundsWon: playerTurnState.roundsWon,
      timeLeft: timer,
    });
  };

  const setTimer = (timeLeft) => {
    // Set the initial interval
    // setInterval() - calls udpdateGameTime() every 1000 ms (1 sec)
    let timerId;
    [timer, timerId] = [timeLeft, setInterval(updatePlayerTime, 1000)];
    setTimeLeft(timer);
    setTimerId(timerId);
    setTimerRunning(true);
  };

  /*  =======================================================
                      Timer useEffect Hook
      =======================================================
      -> Create an action on the update of 'timerRunning'
      -> If the timer reaches zero in updatePlayerTime() 'timerRunning' 
        state is updated
  */
  useEffect(() => {
    // Return if the timer is running
    if (timerRunning) return;

    // Update playersInfo panel (increase points/tables to the winner)
    handleGameEnd();

    // Stop the timer
    clearInterval(timerId);

    // Opens the modal window
    setOpenModal(true);

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
  const [position, setPosition] = useState({ tableIndex: 0, x: 0, y: 0 });

  // Set a key down event and call checkKey()
  document.onkeydown = checkKey;

  // Receives the div with className 'box'
  // 'box' is the div that contains the rows and cells
  const keyboardMapTable = (table) => {
    // Map table and update the current table map state
    const mappedTable = mapTable(table);
    setCurrentTableMap(mappedTable);

    console.log("[Keyboard] Mapping table", table, mappedTable);
  };

  function checkKey(e) {
    e = e || window.event;

    // Verifies if it's the computer turn to play
    if (isComputerTurn()) {
      displayPopup("It's the computer turn to play");
      return;
    }
    // If the game table isn't open yet, return
    else if (!showGame || !timerRunning) return;

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
        // enter
        selectCell();
        break;
      default:
    }
  }

  const moveLeft = () => {
    let [tmpX, tmpY, tmpTableIndex] = [position.x, position.y, position.tableIndex];

    if (tmpX > 0) tmpX--;
    else if (mainTableNavigation) {
      console.log("Remapping to the left table");

      // Map the table to the right
      if (tmpTableIndex > 0) tmpTableIndex--;
      else tmpTableIndex = 8;

      [tmpX, tmpY] = [2, position.y];

      // Remap the table
      keyboardMapTable(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  const moveUp = () => {
    let [tmpX, tmpY, tmpTableIndex] = [position.x, position.y, position.tableIndex];

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

      [tmpX, tmpY] = [position.x, 2];

      // Remap the table
      keyboardMapTable(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  const moveRight = () => {
    let [tmpX, tmpY, tmpTableIndex] = [position.x, position.y, position.tableIndex];

    if (tmpX < currentTableMap[0].length - 1) tmpX++;
    else if (mainTableNavigation) {
      console.log("Remapping to the right table");

      // Map the table to the right
      if (tmpTableIndex < 8) tmpTableIndex++;
      else tmpTableIndex = 0;

      [tmpX, tmpY] = [0, position.y];

      // Remap the table
      keyboardMapTable(mainTable.current.children[tmpTableIndex]);
    }

    setPosition({
      tableIndex: tmpTableIndex,
      x: tmpX,
      y: tmpY,
    });
  };

  const moveDown = () => {
    let [tmpX, tmpY, tmpTableIndex] = [position.x, position.y, position.tableIndex];

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

      [tmpX, tmpY] = [position.x, 0];

      // Remap the table
      keyboardMapTable(mainTable.current.children[tmpTableIndex]);
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
    playHandle("Keyboard", tableIndex, cellIndex);
  };

  /*  =======================================================
              Keyboard Navigation useEffect Hook
      =======================================================
      -> Create an action each time 'position' is changed
      -> This hook gets called every time the user presses the arrow keys
  */
  useEffect(() => {
    if (currentTableMap == null) return;

    // Set the anitamon for the selected cell
    currentTableMap[position.y][position.x].classList.add("arrow-selected");

    // After 0.5 seconds remove the class (0.5 seconds is the time of the animation)
    setTimeout(() => {
      currentTableMap[position.y][position.x].classList.remove("arrow-selected");
    }, 500);

    // eslint-disable-next-line
  }, [position]);

  /* =======================================================
                        Popup Message
     =======================================================
     -> Changes popup message and visibility
  */
  const displayPopup = (message) => {
    setPopupMessage(message);
    setPopupVisibility(true);
    setTimeout(() => {
      setPopupVisibility(false);
      setPopupMessage("");
    }, 1200);
  };

  return (
    <>
      {showGame && (
        <main>
          <PopupMessage message={popupMessage} isVisible={isPopupVisible} />

          <div className="grid-wrapper" ref={mainTable}>
            {buildTables()}
          </div>

          <PlayersInfo
            player1Info={player1Info}
            player2Info={player2Info}
            turnInfo={playerTurnState}
            playerTimer={playerTimer}
            timeLeft={timeLeft}
          />

          <Modal openModal={openModal} title={"Game Ended"} info={modalInfo} onHide={handleQuitRequest} />
        </main>
      )}
    </>
  );
};

export default GamePanel;
