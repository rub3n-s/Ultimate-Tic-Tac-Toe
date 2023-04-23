import "./App.css";
import "./components/GameMode.css";
import Footer from "./components/Footer";
import GameMode from "./components/GameMode";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [showGameMode, setShowGameMode] = useState(true);

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
    console.log(`Player 1: ${nickName1}\nPlayer 2: ${nickName2}\n`);
    handleClose();
    setShowGameMode(false);
  };

  return (
    <>
      {/*===== Navigation Bar =====*/}
      <Navbar />

      {/*===== GameMode Buttons =====*/}
      <GameMode showGameMode={showGameMode} handleGameMode={handleGameMode} />

      {/* <Grid /> */}

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
