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
    setShowGrid(true);
  };

  return (
    <>
      {/*===== Navigation Bar =====*/}
      <Navbar />

      {/*===== GameMode Buttons =====*/}
      <GameMode showGameMode={showGameMode} handleGameMode={handleGameMode} />

      <GamePanel showGrid={showGrid}/>
      
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
