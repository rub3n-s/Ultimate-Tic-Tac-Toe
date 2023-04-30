import "./App.css";
import Navbar from "./components/Navbar";
import GameMode from "./components/GameMode";
import GamePanel from "./components/GamePanel";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import { useEffect, useRef, useState } from "react";
// import {
//   Navbar,
//   GameMode,
//   GamePanel,
//   Modal,
//   Footer
// } from "./components";

function App() {
  const inputNick1 = useRef(null);
  const inputNick2 = useRef(null);
  const [open, setOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showGameMode, setShowGameMode] = useState(true);
  const [gameMode, setGameMode] = useState(null);
  const [player1Name, setPlayer1Name] = useState(null);
  const [player2Name, setPlayer2Name] = useState(null);
  const [info, setInfo] = useState(null);

  // Function that opens a modal based on the game mode selected
  // Players have to insert their names
  const handleGameMode = (mode) => {
    setGameMode(mode);
  };

  const insertNickNames = () => {
    console.log("Selected Game Mode: ", gameMode);
    switch (gameMode) {
      case "pvc":
        setInfo(
          <>
            <div className="info">
              Player's 1 Nick Name:
              <input
                type="text"
                id="inputNick1"
                size="16"
                width="100"
                placeholder="Insert Player's 1 NickName"
                // onChange={(e) => (player1NameTmp = e.target.value)}
                ref={inputNick1}
              />
            </div>
            <div className="info-button">
              <button onClick={nickNameValidation}>Ok</button>
            </div>
          </>
        );
        setOpen(true);
        break;
      case "pvp":
        setInfo(
          <>
            <div className="info">
              Player's 1 Nick Name:
              <input
                type="text"
                id="inputNick1"
                size="16"
                width="100"
                placeholder="Insert Player's 1 NickName"
                ref={inputNick1}
              />
            </div>
            <div className="info">
              Player's 2 Nick Name:
              <input type="text" id="inputNick2" size="16" placeholder="Insert Player's 2 NickName" ref={inputNick2} />
            </div>
            <div className="info-button">
              <button onClick={nickNameValidation}>Ok</button>
            </div>
          </>
        );
        setOpen(true);
        break;
      default:
        console.log("Error receiving game mode...");
    }
  };

  const nickNameValidation = () => {
    console.log(`Game Mode: ${gameMode}`);

    switch (gameMode) {
      case "pvc":
        if (inputNick1.current.value == "") {
          // Change input background-color
          inputNick1.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid player 1 nickname");
          return;
        }
        // Reset the background property
        inputNick1.current.style.backgroundColor = "white";

        // Set the name state
        setPlayer1Name(inputNick1.current.value);
        setPlayer2Name("computer");

        // Display player 1 and player 2 nick names
        console.log(`Player 1: ${inputNick1.current.value} vs Player 2: computer`);
        break;
      case "pvp":
        if (inputNick1.current.value == "") {
          // Change input background-color
          inputNick1.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid player 1 nickname");
          return;
        } else if (inputNick1.current.value == "") {
          // Change input background-color
          inputNick2.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid player 2 nickname");
          return;
        }

        // Reset the background property
        inputNick1.current.style.backgroundColor = "white";
        inputNick2.current.style.backgroundColor = "white";

        // Display player 1 and player 2 nick names
        console.log(`Player 1: ${inputNick1.current.value} vs Player 2: ${inputNick2.current.value}`);

        // Set the names states
        setPlayer1Name(inputNick1.current.value);
        setPlayer2Name(inputNick2.current.value);
        break;
    }

    // Change states to replace the components visibility
    handleCloseModal();
    setShowGameMode(false);
    setShowGrid(true);
  };

  const handleCloseModal = () => setOpen(false);

  const handleCloseGrid = () => {
    setOpen(false);
    setShowGrid(false);
    setShowGameMode(true);
    setGameMode(null);
    setPlayer1Name(null);
    setPlayer2Name(null);
    setInfo(null);
  };

  // Create an action on the update of gameMode
  useEffect(() => {
    if (gameMode == null || showGrid) return;

    // On game mode change, request player's nick name
    insertNickNames();
  }, [gameMode]);

  return (
    <>
      {/*===== Navigation Bar =====*/}
      <Navbar />

      {/*===== GameMode Buttons =====*/}
      <GameMode showGameMode={showGameMode} handleGameMode={handleGameMode} />

      <GamePanel
        showGrid={showGrid}
        handleCloseGrid={handleCloseGrid}
        gameMode={gameMode}
        player1Name={player1Name}
        player2Name={player2Name}
      />

      <Modal
        open={open}
        gameMode={gameMode}
        onHide={handleCloseModal}
        title={"What's your name"}
        info={info}
        nickNameValidation={nickNameValidation}
      />

      <Footer />
    </>
  );
}

export default App;
