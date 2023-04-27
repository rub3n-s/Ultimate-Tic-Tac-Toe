import "./App.css";
import Navbar from "./components/Navbar";
import GameMode from "./components/GameMode";
import GamePanel from "./components/GamePanel";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import { useState } from "react";

function App() {
  let player1NameTmp;
  let player2NameTmp;
  let gameModeTmp;
  let firstPlayTmp;
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
    console.log("Selected Game Mode: ", mode);
    gameModeTmp = mode;
    switch (mode) {
      case "pvc":
        player2NameTmp = "computer";
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
                onChange={(e) => (player1NameTmp = e.target.value)}
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
                onChange={(e) => (player1NameTmp = e.target.value)}
              />
            </div>
            <div className="info">
              Player's 2 Nick Name:
              <input
                type="text"
                id="inputNick2"
                size="16"
                placeholder="Insert Player's 2 NickName"
                onChange={(e) => (player2NameTmp = e.target.value)}
              />
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
    console.log(`Player 1: ${player1NameTmp} vs Player 2: ${player2NameTmp}`);

    switch (gameModeTmp) {
      case "pvc":
        if (player1NameTmp == "") {
          // Change input background-color
          return;
        }
        break;
      case "pvp":
        if (player1NameTmp == "") {
          // Change input background-color
          return;
        } else if (player2NameTmp == "") {
          // Change input background-color
          return;
        }
        break;
    }

    // Change states to replace the components visibility
    handleClose();
    setShowGameMode(false);
    setShowGrid(true);

    // Set the states
    setPlayer1Name(player1NameTmp);
    setPlayer2Name(player2NameTmp);
    setGameMode(gameModeTmp);
  };

  const handleClose = () => setOpen(false);

  const handleCloseGrid = () => {
    setShowGrid(false);
    setShowGameMode(true);
  };

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
        onHide={handleClose}
        title={"What's your name"}
        info={info}
        nickNameValidation={nickNameValidation}
      />

      <Footer />
    </>
  );
}

export default App;
