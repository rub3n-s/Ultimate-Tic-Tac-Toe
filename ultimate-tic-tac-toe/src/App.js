import "./App.css";
import Navbar from "./components/Navbar";
import GameMode from "./components/GameMode";
import GamePanel from "./components/GamePanel";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showGameMode, setShowGameMode] = useState(true);
  const [player1Name, setPlayer1Name] = useState(null);
  const [player2Name, setPlayer2Name] = useState(null);
  const [firstPlay, setFirstPlay] = useState(null);

  const handleGameMode = (mode) => {
    console.log("Selected Game Mode: ", mode);
    switch (mode) {
      case "pvc":
      case "pvp":
        setOpen(true);
        setGameMode(mode);
        break;
      default:
        console.log("Error receiving game mode...");
    }
  };

  const handleClose = () => setOpen(false);

  const getNickNames = (nickName1, nickName2) => {
    // Change the states to replace the components visibility
    handleClose();
    setShowGameMode(false);
    setShowGrid(true);

    // Define the player names
    setPlayer1Name(nickName1);
    setPlayer2Name(nickName2);
    console.log(`Player 1: ${nickName1}\nPlayer 2: ${nickName2}\n`);

    // Calls the function to choose who plays first
    getFirstPlay(nickName1, nickName2);
  };

  const getFirstPlay = (nickName1, nickName2) => {
    console.log("Selecting first player...");
    switch (gameMode) {
      case "pvc":
        console.log(`Choosing between player1:${nickName1} & computer`);
        Math.random() < 0.5
          ? setFirstPlay(nickName1)
          : setFirstPlay("computer");
        break;
      case "pvp":
        console.log(
          `Choosing between player1:${nickName1} & player2:${nickName2}`
        );
        Math.random() < 0.5 ? setFirstPlay(nickName1) : setFirstPlay(nickName2);
        break;
    }
  };

  return (
    <>
      {/*===== Navigation Bar =====*/}
      <Navbar />

      {/*===== GameMode Buttons =====*/}
      <GameMode showGameMode={showGameMode} handleGameMode={handleGameMode} />

      <GamePanel
        showGrid={showGrid}
        gameMode={gameMode}
        player1Name={player1Name}
        player2Name={player2Name}
        firstPlay={firstPlay}
      />

      <Modal
        open={open}
        onHide={handleClose}
        gameMode={gameMode}
        getNickNames={getNickNames}
      />

      <Footer />
    </>
  );
}

export default App;
