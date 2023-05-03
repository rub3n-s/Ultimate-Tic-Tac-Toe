import "./App.css";
import Navbar from "./components/Navbar";
import GameMode from "./components/GameMode";
import GamePanel from "./components/GamePanel";
import Footer from "./components/Footer";
import { useState } from "react";
// import {
//   Navbar,
//   GameMode,
//   GamePanel,
//   Modal,
//   Footer
// } from "./components";

function App() {
  const [showGrid, setShowGrid] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [player1Name, setPlayer1Name] = useState(null);
  const [player2Name, setPlayer2Name] = useState(null);
  const [levelTimeOut, setTimeOut] = useState(null);

  const handleCloseGrid = () => {
    setShowGrid(false);
    setGameMode(null);
    setPlayer1Name(null);
    setPlayer2Name(null);
    setTimeOut(null);
  };

  const handleGameMode = (showGrid, gameMode, player1Name, player2Name, levelTimeOut) => {
    setShowGrid(showGrid);
    setGameMode(gameMode);
    setPlayer1Name(player1Name);
    setPlayer2Name(player2Name);
    setTimeOut(levelTimeOut);
  };

  return (
    <>
      {/*===== Navigation Bar =====*/}
      <Navbar />

      {/*===== GameMode Buttons =====*/}
      <GameMode retrieveData={handleGameMode} />

      <GamePanel
        showGrid={showGrid}
        handleCloseGrid={handleCloseGrid}
        gameMode={gameMode}
        player1Name={player1Name}
        player2Name={player2Name}
        levelTimeOut={levelTimeOut}
      />

      <Footer />
    </>
  );
}

export default App;
